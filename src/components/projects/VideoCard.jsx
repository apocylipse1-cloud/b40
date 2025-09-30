import React, { useState, useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'

const VideoCard = ({ videoId, aspectRatio, index, isHovered, style, className }) => {
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [thumbnailLoaded, setThumbnailLoaded] = useState(false)
  const cardRef = useRef(null)

  // YouTube embed + thumbnail URLs
  const embedUrl = `https://www.youtube.com/embed/${videoId}?controls=1&modestbranding=1&rel=0&showinfo=0`
  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
  const fallbackThumbnail = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`

  // Hover animation for scale effect
  useGSAP(() => {
    if (cardRef.current && isHovered) {
      gsap.to(cardRef.current.querySelector('.video-inner'), {
        scale: 1.05,
        duration: 0.3,
        ease: 'power2.out'
      })
    } else if (cardRef.current) {
      gsap.to(cardRef.current.querySelector('.video-inner'), {
        scale: 1,
        duration: 0.3,
        ease: 'power2.out'
      })
    }
  }, [isHovered])

  const handleIframeLoad = () => setIsLoaded(true)
  const handleIframeError = () => setHasError(true)
  const handleThumbnailLoad = () => setThumbnailLoaded(true)

  const handleThumbnailError = (e) => {
    if (e.target.src !== fallbackThumbnail) e.target.src = fallbackThumbnail
  }

  return (
    <div
      ref={cardRef}
      className={`relative ${aspectRatio || 'aspect-video'} rounded-lg overflow-hidden transition-transform duration-300 ${className || ''}`}
      style={{
        ...style,
        boxShadow: isHovered
          ? '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
          : `
            rgba(0, 0, 0, 0.01) 0.796192px 0px 0.796192px 0px,
            rgba(0, 0, 0, 0.03) 2.41451px 0px 2.41451px 0px,
            rgba(0, 0, 0, 0.08) 6.38265px 0px 6.38265px 0px,
            rgba(0, 0, 0, 0.25) 20px 0px 20px 0px
          `,
      }}
    >
      <div className="video-inner w-full h-full">
        {/* Loading Spinner */}
        {!isLoaded && !hasError && (
          <div className="absolute inset-0 flex items-center justify-center z-10 bg-black/20 backdrop-blur-sm">
            <div className="loading-spinner w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          </div>
        )}

        {/* Error Fallback with Thumbnail */}
        {hasError && (
          <div className="absolute inset-0 z-10">
            <img
              src={thumbnailUrl}
              alt={`Video ${index + 1} thumbnail`}
              className="w-full h-full object-cover object-left-top"
              onLoad={handleThumbnailLoad}
              onError={handleThumbnailError}
            />
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex flex-col items-center justify-center">
              <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mb-3 transform transition-transform hover:scale-110">
                <div className="w-0 h-0 border-l-[10px] border-l-white border-y-[8px] border-y-transparent ml-1"></div>
              </div>
              <p className="text-sm font-medium text-white opacity-90">Watch on YouTube</p>
            </div>
          </div>
        )}

        {/* Video Embed */}
        {!hasError && (
          <iframe
            className={`absolute top-0 left-0 w-full h-full transition-opacity duration-500 ${
              isLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            src={embedUrl}
            title={`Project Video ${index + 1}`}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            loading="lazy"
            onLoad={handleIframeLoad}
            onError={handleIframeError}
          />
        )}

        {/* Click Redirect when error */}
        {hasError && (
          <button
            className="absolute inset-0 z-20 cursor-pointer"
            onClick={() => window.open(`https://www.youtube.com/watch?v=${videoId}`, '_blank')}
            aria-label={`Watch video ${index + 1} on YouTube`}
          />
        )}

        {/* Subtle Hover Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      </div>
    </div>
  )
}

export default VideoCard
