import React, { useEffect, useRef } from 'react'
import init from './index.js'
import './index.less'

const Page5123 = () => {
  const audioRef: any = useRef()
  useEffect(() => {
    init()
  }, [])

  return <canvas id="c" />
}

export default Page5123
