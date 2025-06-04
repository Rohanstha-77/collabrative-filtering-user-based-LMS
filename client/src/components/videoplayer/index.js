import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Slider } from '../ui/slider'
import { Button } from '../ui/button'
import { Maximize, Minimize, Pause, Play, RotateCcw, RotateCw, Volume2, VolumeX } from 'lucide-react'
import ReactPlayer from '@/config/ReactPlayerConfig.js'

export const VideoPlayer = ({ width = "100%", height = '100%', url, onProgressUpdate, progressData }) => {
  const [playing, setPlaying] = useState(false)
  const [volume, setVolume] = useState(0.5)
  const [muted, setMuted] = useState(false)
  const [seeking, setSeeking] = useState(false)
  const [played, setPlayed] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isFullScreen, setIsFullScreen] = useState(false)
  const [showControls, setShowControls] = useState(true)

  const playerRef = useRef(null)
  const playerContainerRef = useRef(null)
  const controlsTimeOutRef = useRef(null)

  const handlePlayAndPause = () => {
    setPlaying(prev => !prev)
  }

  const handleProgress = (state) => {
    if (!seeking) {
      setPlayed(state.played)
    }
  }

  const handleRewind = () => {
    const currentTime = playerRef?.current?.getCurrentTime?.() || 0
    playerRef?.current?.seekTo(currentTime - 5)
  }

  const handleForward = () => {
    const currentTime = playerRef?.current?.getCurrentTime?.() || 0
    playerRef?.current?.seekTo(currentTime + 5)
  }

  const handleMute = () => {
    setMuted(prev => !prev)
  }

  const handleSeekChange = (value) => {
    setPlayed(value[0])
    setSeeking(true)
  }

  const handelSeekMouseUp = () => {
    setSeeking(false)
    playerRef.current?.seekTo(played)
  }

  const handleVolumeChange = (value) => {
    setVolume(value[0])
  }

  const pad = (string) => {
    return ('0' + string).slice(-2)
  }

  const formateTime = (seconds) => {
    if (isNaN(seconds)) return "00:00"
    const date = new Date(seconds * 1000)
    const hh = date.getUTCHours()
    const mm = date.getUTCMinutes()
    const ss = pad(date.getUTCSeconds())
    return hh ? `${hh}:${pad(mm)}:${ss}` : `${pad(mm)}:${ss}`
  }

  const handleFullScreen = useCallback(() => {
    const el = playerContainerRef.current
    if (!document.fullscreenElement) {
      el?.requestFullscreen?.()
    } else {
      document.exitFullscreen?.()
    }
  }, [])

  const handleMouseMove = () => {
    setShowControls(true)
    clearTimeout(controlsTimeOutRef.current)
    controlsTimeOutRef.current = setTimeout(() => setShowControls(false), 3000)
  }

  useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement)
    }
    document.addEventListener('fullscreenchange', handleFullScreenChange)
    return () => {
      document.removeEventListener("fullscreenchange", handleFullScreenChange)
    }
  }, [])

  useEffect(() => {
    if(played === 1){
      onProgressUpdate({
        ...progressData,
        progressValue: played
      })
    }
  },[played])
  return (
    <div
      ref={playerContainerRef}
      className={`relative bg-gray-900 rounded-lg overflow-hidden shadow-2xl transition-all ease-in-out ${isFullScreen ? 'w-screen' : ''}`}
      style={{ width, height }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setShowControls(false)}
    >
      <ReactPlayer
        url={url}
        ref={playerRef}
        className="absolute top-0 left-0"
        height="100%"
        width="100%"
        playing={playing}
        volume={volume}
        muted={muted}
        onProgress={handleProgress}
        onDuration={(d) => setDuration(d)}
      />
      {
        showControls && (
          <div className="absolute bottom-0 left-0 right-0 bg-gray-800 bg-opacity-75 p-4 transition-opacity duration-300 opacity-100">
            <Slider
              value={[played * 100]}
              max={100}
              step={0.1}
              className="w-full mb-4"
              onValueChange={(value) => handleSeekChange([value[0] / 100])}
              onValueCommit={handelSeekMouseUp}
            />
            <div className='flex items-center justify-between'>
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="icon" onClick={handlePlayAndPause} className="text-white bg-transparent hover:text-white hover:bg-gray-700">
                  {playing ? <Pause className='h-6 w-6' /> : <Play className='h-6 w-6' />}
                </Button>
                <Button variant="ghost" size="icon" onClick={handleForward} className="text-white bg-transparent hover:text-white hover:bg-gray-700">
                  <RotateCw className='h-6 w-6' />
                </Button>
                <Button variant="ghost" size="icon" onClick={handleRewind} className="text-white bg-transparent hover:text-white hover:bg-gray-700">
                  <RotateCcw className='h-6 w-6' />
                </Button>
                <Button variant="ghost" size="icon" onClick={handleMute} className="text-white bg-transparent hover:text-white hover:bg-gray-700">
                  {muted ? <VolumeX className='h-6 w-6' /> : <Volume2 className='h-6 w-6' />}
                </Button>
                <Slider
                  value={[volume * 100]}
                  max={100}
                  step={1}
                  onValueChange={(value) => handleVolumeChange([value[0] / 100])}
                  className="w-24"
                />
                <div className="flex items-center space-x-2">
                  <div className="text-white">
                    {formateTime(played * duration) || "00:00"} / {formateTime(duration) || "00:00"}
                  </div>
                  <Button variant="ghost" size="icon" onClick={handleFullScreen} className="text-white bg-transparent hover:text-white hover:bg-gray-700">
                    {isFullScreen ? <Minimize className='h-6 w-6' /> : <Maximize className='h-6 w-6' />}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )
      }
    </div>
  )
}
