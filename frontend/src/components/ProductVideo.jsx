import React from 'react';
import { getVideoTypeAndEmbedUrl } from '../Utils/videoHelper';

const ProductVideo = ({ videoUrl, isCover = false, className = "" }) => {
  const { type, embedUrl, id } = getVideoTypeAndEmbedUrl(videoUrl);

  if (type === 'none' || !embedUrl) return null;

  if (type === 'youtube') {
    // For covers: loop, autoplay, muted, no controls, disable pointer events
    // For detail views: loop, autoplay, muted, show controls, enable pointer events
    const youtubeUrl = isCover 
      ? `${embedUrl}?autoplay=1&mute=1&loop=1&playlist=${id}&controls=0&showinfo=0&rel=0&modestbranding=1&iv_load_policy=3&playsinline=1&enablejsapi=1`
      : `${embedUrl}?autoplay=1&mute=1&loop=1&playlist=${id}&controls=1&playsinline=1`;

    return (
      <div className={`relative w-full h-full overflow-hidden flex items-center justify-center bg-black ${className}`}>
        <iframe
          src={youtubeUrl}
          title="YouTube video player"
          frameBorder="0"
          allow="autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className={`w-full h-full absolute inset-0 ${isCover ? 'pointer-events-none' : ''}`}
          style={isCover ? { transform: 'scale(1.4)', transformOrigin: 'center' } : {}}
        />
      </div>
    );
  }

  if (type === 'tiktok') {
    // For covers: loop, autoplay, muted, disable pointer events
    // For detail views: loop, autoplay, muted, enable pointer events, portrait aspect ratio
    const tiktokUrl = embedUrl;
    
    return (
      <div className={`relative w-full h-full overflow-hidden flex items-center justify-center bg-black ${className}`}>
        <iframe
          src={tiktokUrl}
          title="TikTok video player"
          frameBorder="0"
          allow="autoplay; encrypted-media"
          allowFullScreen
          className={`w-full h-full absolute inset-0 ${isCover ? 'pointer-events-none' : ''} ${!isCover ? 'aspect-[9/16] max-w-md mx-auto' : ''}`}
        />
      </div>
    );
  }

  if (type === 'upload') {
    return (
      <video
        src={videoUrl}
        autoPlay
        loop
        muted
        playsInline
        controls={!isCover}
        className={`w-full h-full object-cover bg-black ${className}`}
      />
    );
  }

  return null;
};

export default ProductVideo;
