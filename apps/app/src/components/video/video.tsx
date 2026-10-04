import ReactPlayer from 'react-player'

// Render a YouTube video player

export interface VideoProps {
  video: {
    url: string
  }
}

export const Video: React.FC<VideoProps> = ({ video }: VideoProps) => {
  return (
    <div className='video-player-wrapper'>
      <ReactPlayer
        url={video?.url}
        className='react-player'
        width='100%'
        height='100%'
      />
    </div>
  )
}
