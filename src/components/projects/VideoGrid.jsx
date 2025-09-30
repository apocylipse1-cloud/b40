import React, { useState } from 'react'
import VideoCard from './VideoCard'

const VideoGrid = ({ videos, gridCols, aspectRatio }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null)

  // If no videos
  if (!videos || videos.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="font-[font1] text-responsive text-layer-1">
          No videos available
        </p>
      </div>
    )
  }

  // Calculate responsive stagger height for desktop 3D overlapping layout
  const maxHeight = 120
  const totalVideos = videos.length
  const middle = Math.floor(totalVideos / 2)

  const calculateYOffset = (index) => {
    const distanceFromMiddle = Math.abs(index - middle)
    const staggerOffset = maxHeight - distanceFromMiddle * 20

    const isHovered = hoveredIndex === index
    const isOtherHovered = hoveredIndex !== null && hoveredIndex !== index

    // When hovering: hovered card moves to consistent top position, others move to baseline
    return isHovered ? -120 : isOtherHovered ? 0 : -staggerOffset
  }

  const marqueeRepeat = 4

  return (
    <div className="relative w-full">
      {/* Desktop 3D overlapping layout - hidden on mobile */}
      <div className="hidden md:block relative overflow-hidden h-[400px] -mb-[200px]">
        <div className="flex -space-x-72 md:-space-x-80 pb-8 pt-40 items-end justify-center">
          {videos.map((video, index) => {
            if (!video || !video.videoId) {
              console.warn(`Video at index ${index} is missing videoId:`, video)
              return null
            }

            const zIndex = totalVideos - index
            const yOffset = calculateYOffset(index)

            return (
              <div
                key={`${video.videoId}-${index}`}
                className="group cursor-pointer flex-shrink-0 video-container"
                style={{
                  zIndex: zIndex,
                  transform: `perspective(5000px) rotateY(-45deg) translateY(${yOffset}px)`,
                  opacity: 1,
                  transition: 'transform 0.2s cubic-bezier(0.25, 0.1, 0.25, 1), opacity 0.6s ease',
                  transitionDelay: `${index * 0.05}s`,
                }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <VideoCard
                  videoId={video.videoId}
                  aspectRatio={aspectRatio}
                  index={index}
                  isHovered={hoveredIndex === index}
                  className="w-64 md:w-80 lg:w-96"
                />
              </div>
            )
          })}
        </div>
      </div>

      {/* Mobile marquee layout */}
      <div className="block md:hidden relative pb-8">
        <div
          className="group flex overflow-hidden p-2 flex-row"
          style={{
            '--duration': '40s',
            '--gap': '1rem',
            gap: 'var(--gap)',
          }}
        >
          {Array(marqueeRepeat)
            .fill(0)
            .map((_, repeatIndex) => (
              <div
                key={`repeat-${repeatIndex}`}
                className="flex shrink-0 justify-around animate-marquee flex-row group-hover:paused"
                style={{
                  gap: 'var(--gap)',
                }}
              >
                {videos.map((video, videoIndex) => {
                  if (!video || !video.videoId) {
                    return null
                  }

                  return (
                    <div
                      key={`${repeatIndex}-${video.videoId}-${videoIndex}`}
                      className="flex-shrink-0"
                    >
                      <VideoCard
                        videoId={video.videoId}
                        aspectRatio={aspectRatio}
                        index={videoIndex}
                        className="w-64"
                      />
                    </div>
                  )
                })}
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}

export default VideoGrid
