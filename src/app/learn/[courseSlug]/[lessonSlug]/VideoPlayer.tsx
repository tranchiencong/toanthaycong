'use client'

import LiteYouTubeEmbed from 'react-lite-youtube-embed'
import 'react-lite-youtube-embed/dist/LiteYouTubeEmbed.css'

export function VideoPlayer({ youtubeId, title }: { youtubeId: string, title: string }) {
  return (
    <div className="w-full bg-black aspect-video overflow-hidden">
      <LiteYouTubeEmbed
        id={youtubeId}
        title={title}
        wrapperClass="yt-lite"
        playerClass="lty-playbtn"
        adNetwork={true}
        params="rel=0"
      />
    </div>
  )
}
