import React, { useEffect, useRef } from 'react'
import utils from './utils'
import Utils from '@utils'

const Heart = (props: any) => {
  const { h, w } = props

  useEffect(() => {
    const { init, stop } = utils({ h, w })
    init()
    return stop
  }, [])

  return (
    <div>
      <canvas id="heart"></canvas>
    </div>
  )
}

export default Utils.connect({
  component: Heart,
  mapStateToProps: state => ({
    h: state.common.contentHeight,
    w: state.common.contentWidth
  })
})
