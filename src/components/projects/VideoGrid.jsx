import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import VideoCard from './VideoCard'

const VideoGrid = ({ videos, title = "Browse my library", showHeader = false, archiveButton }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null)

  if (!videos || videos.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="font-[font1] text-responsive text-layer-1">
          No videos available
        </p>
      </div>
    )
  }

  const maxHeight = 120
  const totalVideos = videos.length
  const middle = Math.floor(totalVideos / 2)
  const marqueeRepeat = 4

  const calculateYOffset = (index) => {
    const distanceFromMiddle = Math.abs(index - middle)
    const staggerOffset = maxHeight - distanceFromMiddle * 20

    const isHovered = hoveredIndex === index
    const isOtherHovered = hoveredIndex !== null && hoveredIndex !== index

    return isHovered ? -120 : isOtherHovered ? 0 : -staggerOffset
  }

  return (
    <section className="relative w-full">
      <div className="max-w-7xl mx-auto bg-black/30 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden">
        {showHeader && (
          <div className="relative z-10 text-center pt-16 pb-8 px-8">
            <h2 className="text-4xl md:text-6xl font-[font2] uppercase text-white mb-8">
              {title}
            </h2>

            {archiveButton && (
              <Link
                to={archiveButton.href}
                className="inline-flex items-center gap-3 bg-[#D3FD50] text-black px-6 py-3 rounded-full font-[font2] uppercase hover:bg-[#b8e03e] transition-colors group mb-20"
              >
                <span>{archiveButton.text}</span>
                <svg
                  className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            )}
          </div>
        )}

        {/* Desktop 3D overlapping layout */}
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
                <motion.div
                  key={`${video.videoId}-${index}`}
                  className="group cursor-pointer flex-shrink-0"
                  style={{ zIndex }}
                  initial={{
                    transform: `perspective(5000px) rotateY(-45deg) translateY(200px)`,
                    opacity: 0,
                  }}
                  animate={{
                    transform: `perspective(5000px) rotateY(-45deg) translateY(${yOffset}px)`,
                    opacity: 1,
                  }}
                  transition={{
                    duration: 0.2,
                    delay: index * 0.05,
                    ease: [0.25, 0.1, 0.25, 1],
                  }}
                  onHoverStart={() => setHoveredIndex(index)}
                  onHoverEnd={() => setHoveredIndex(null)}
                >
                  <VideoCard
                    videoId={video.videoId}
                    aspectRatio="aspect-video"
                    index={index}
                    isHovered={hoveredIndex === index}
                    className="w-64 md:w-80 lg:w-96"
                  />
                </motion.div>
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
                  style={{ gap: 'var(--gap)' }}
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
                          aspectRatio="aspect-video"
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
    </section>
  )
}

export default VideoGrid
