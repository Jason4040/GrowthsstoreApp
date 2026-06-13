export const getYouTubeId = (url) => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|\/shorts\/)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

export const getTikTokId = (url) => {
  if (!url) return null;
  const regExp = /\/video\/(\d+)/;
  const match = url.match(regExp);
  if (match) return match[1];

  const embedRegExp = /\/embed\/v2\/(\d+)/;
  const embedMatch = url.match(embedRegExp);
  if (embedMatch) return embedMatch[1];
  
  const mRegExp = /\/v\/(\d+)/;
  const mMatch = url.match(mRegExp);
  if (mMatch) return mMatch[1];

  return null;
};

export const isValidVideoLink = (url) => {
  if (!url) return false;
  const isYouTube = /^https?:\/\/(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})(?:\S*)?$/i.test(url);
  const isTikTok = /^https?:\/\/(?:www\.)?tiktok\.com\/@[^\/]+\/video\/(\d+)(?:\S*)?$/i.test(url) ||
                   /^https?:\/\/m\.tiktok\.com\/v\/(\d+)\.html(?:\S*)?$/i.test(url) ||
                   /^https?:\/\/(?:www\.)?tiktok\.com\/embed\/v2\/(\d+)(?:\S*)?$/i.test(url);
  return isYouTube || isTikTok;
};

export const getVideoTypeAndEmbedUrl = (url) => {
  if (!url) return { type: 'none', embedUrl: null, id: null };

  const youtubeId = getYouTubeId(url);
  if (youtubeId) {
    return {
      type: 'youtube',
      id: youtubeId,
      embedUrl: `https://www.youtube.com/embed/${youtubeId}`
    };
  }

  const tiktokId = getTikTokId(url);
  if (tiktokId) {
    return {
      type: 'tiktok',
      id: tiktokId,
      embedUrl: `https://www.tiktok.com/embed/v2/${tiktokId}`
    };
  }

  // Cloudinary links might not end with file extension but contain video/upload/ in the path
  const isRawVideo = /\.(mp4|webm|ogg|mov|mkv)(?:$|\?)/i.test(url) || 
                     url.includes("res.cloudinary.com") || 
                     url.includes("/video/upload/");
                     
  if (isRawVideo) {
    return {
      type: 'upload',
      embedUrl: url,
      id: null
    };
  }

  return { type: 'unknown', embedUrl: null, id: null };
};
