import React, { useEffect, useRef } from 'react'
import { Howl } from 'howler'
import init from './index.js'
import './index.less'

const Page5123 = () => {
  const audioRef: any = useRef()
  useEffect(() => {
    init()

    window.addEventListener('click', () => {
      audioRef.current.play()
    })
  }, [])

  return (
    <div>
      <canvas id="c" />
      <audio
        ref={audioRef}
        src="https://music.163.com/song/media/outer/url?id=566436186.mp3"
        autoPlay
      />
    </div>
  )
}

export default Page5123
