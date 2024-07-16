import React, { useEffect, useMemo } from 'react'
import init from './index.js'
import './index.less'

const Page5123 = () => {
  useEffect(() => {
    init()
  }, [])
  return <canvas id="c" />
}

export default Page5123
