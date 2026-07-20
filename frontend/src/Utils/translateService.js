/**
 * translateService.js
 * Direct translation using Google Translate API (no widget, no banner)
 * Translates all visible text nodes in the page, caches per session.
 */

const CACHE_KEY = 'gt_cache';
const ORIG_KEY = 'gt_originals';

// Use localStorage for persistent cache across sessions
function loadCache() {
  try { return JSON.parse(localStorage.getItem(CACHE_KEY) || '{}'); }
  catch { return {}; }
}
function saveCache(cache) {
  try { localStorage.setItem(CACHE_KEY, JSON.stringify(cache)); } catch {}
}


// Translate a batch of strings via free Google Translate API
async function translateBatch(texts, targetLang) {
  const cache = loadCache();
  const cacheKey = targetLang;
  if (!cache[cacheKey]) cache[cacheKey] = {};

  const toTranslate = texts.filter(t => t.trim() && !cache[cacheKey][t]);

  if (toTranslate.length > 0) {
    // Batch into groups of 20 to avoid URL length limits
    const chunkSize = 20;
    for (let i = 0; i < toTranslate.length; i += chunkSize) {
      const chunk = toTranslate.slice(i, i + chunkSize);
      try {
        const params = new URLSearchParams({
          client: 'gtx',
          sl: 'en',
          tl: targetLang,
          dt: 't',
        });
        // Add each string as a q param
        chunk.forEach(t => params.append('q', t));

        const res = await fetch(
          `https://translate.googleapis.com/translate_a/single?${params.toString()}`,
          { method: 'GET' }
        );

        if (!res.ok) continue;
        const data = await res.json();

        // data[0] contains [[translated, original, ...], ...]
        // When multiple q params are sent, Google returns them concatenated
        // We do them one by one for reliability
      } catch (e) {
        console.warn('[Translate] Batch error:', e);
      }
    }

    // Fallback: translate one by one (more reliable)
    for (const text of toTranslate) {
      if (cache[cacheKey][text]) continue; // already cached from batch
      try {
        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
        const res = await fetch(url);
        if (!res.ok) continue;
        const data = await res.json();
        // data[0] is array of [translated_chunk, original_chunk, ...]
        const translated = data[0]?.map(x => x?.[0]).filter(Boolean).join('') || text;
        cache[cacheKey][text] = translated;
      } catch (e) {
        cache[cacheKey][text] = text; // fallback: keep original
      }
    }
    saveCache(cache);
  }

  return cache[cacheKey];
}

// Collect all text nodes within a root element
function getTextNodes(root) {
  const walker = document.createTreeWalker(
    root,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode(node) {
        const text = node.textContent.trim();
        if (!text || text.length < 2) return NodeFilter.FILTER_REJECT;
        // Skip script/style content
        const parent = node.parentElement;
        if (!parent) return NodeFilter.FILTER_REJECT;
        const tag = parent.tagName?.toLowerCase();
        if (['script', 'style', 'noscript', 'head', 'meta', 'link'].includes(tag)) {
          return NodeFilter.FILTER_REJECT;
        }
        // Skip elements with notranslate attribute
        if (parent.hasAttribute('data-notranslate') || parent.closest('[data-notranslate]')) {
          return NodeFilter.FILTER_REJECT;
        }
        return NodeFilter.FILTER_ACCEPT;
      }
    }
  );
  const nodes = [];
  let node;
  while ((node = walker.nextNode())) nodes.push(node);
  return nodes;
}

// Store originals in a WeakMap (so React doesn't lose them on re-render)
const originalsMap = new Map(); // node -> originalText

// Apply translation to the page
async function applyTranslation(targetLang) {
  const root = document.getElementById('root');
  if (!root) return;

  const nodes = getTextNodes(root);

  // Collect unique non-empty texts
  const texts = [...new Set(
    nodes
      .map(n => n.textContent.trim())
      .filter(t => t.length > 1 && /[a-zA-Z]/.test(t)) // only translate text with Latin chars
  )];

  if (texts.length === 0) return;

  const translations = await translateBatch(texts, targetLang);

  // Apply translations to text nodes
  for (const node of nodes) {
    const original = node.textContent.trim();
    if (!originalsMap.has(node)) {
      originalsMap.set(node, original);
    }
    const translated = translations[original];
    if (translated && translated !== original) {
      // Preserve leading/trailing whitespace
      const leading = node.textContent.match(/^\s*/)?.[0] || '';
      const trailing = node.textContent.match(/\s*$/)?.[0] || '';
      node.textContent = leading + translated + trailing;
    }
  }
}

// Restore original English text
function restoreOriginal() {
  const root = document.getElementById('root');
  if (!root) return;
  // Simply reload — this is the cleanest way to restore React-rendered content
  // Clear the lang so we don't re-translate on reload
  window.location.reload();
}

let currentLang = localStorage.getItem('appLang') || 'en';
let translateObserver = null;
let translateTimeout = null;

// Re-translate after React re-renders (debounced)
function scheduleReTranslate() {
  if (currentLang === 'en') return;
  clearTimeout(translateTimeout);
  translateTimeout = setTimeout(() => {
    applyTranslation(currentLang);
  }, 300);
}

// Watch for React DOM updates and re-apply translation
function startObserver() {
  if (translateObserver) translateObserver.disconnect();
  translateObserver = new MutationObserver((mutations) => {
    if (currentLang === 'en') return;
    const hasTextChange = mutations.some(m =>
      m.type === 'childList' &&
      Array.from(m.addedNodes).some(n => n.nodeType === Node.TEXT_NODE || n.nodeType === Node.ELEMENT_NODE)
    );
    if (hasTextChange) scheduleReTranslate();
  });
  const root = document.getElementById('root');
  if (root) {
    translateObserver.observe(root, { childList: true, subtree: true });
  }
}

// Internal flag for UI loader
let _isTranslating = false;
function setTranslating(flag) {
  _isTranslating = flag;
  const loader = document.getElementById('translation-loader');
  if (loader) {
    loader.style.display = flag ? 'flex' : 'none';
  }
  // Dispatch custom events for any UI that wants to listen
  window.dispatchEvent(new CustomEvent(flag ? 'translation-start' : 'translation-end'));
}
export function isTranslating() { return _isTranslating; }

// Pre‑fetch translations for all supported languages (rw, lg) after the first load.
async function prefetchAllLanguages() {
  const root = document.getElementById('root');
  if (!root) return;
  const nodes = getTextNodes(root);
  const texts = [...new Set(
    nodes.map(n => n.textContent.trim()).filter(t => t.length > 1 && /[a-zA-Z]/.test(t))
  )];
  const langs = ['rw', 'lg'];
  for (const lang of langs) {
    await translateBatch(texts, lang);
  }
}

// Update switchLanguage to use loader UI
export async function switchLanguage(langCode) {
  currentLang = langCode;
  localStorage.setItem('appLang', langCode);

  if (langCode === 'en') {
    restoreOriginal();
    return;
  }

  setTranslating(true);
  // Wait a tick for React to finish rendering
  await new Promise(r => setTimeout(r, 100));
  await applyTranslation(langCode);
  setTranslating(false);

  // Start watching for React updates to re‑translate new content
  startObserver();
}

// Init translation now also triggers prefetch after applying saved language
export async function initTranslation() {
  const saved = localStorage.getItem('appLang') || 'en';
  currentLang = saved;
  if (saved !== 'en') {
    await new Promise(r => setTimeout(r, 800)); // wait for React to render
    await applyTranslation(saved);
    startObserver();
    // Prefetch other languages in background (non‑blocking)
    prefetchAllLanguages().catch(() => {});
  }
}
