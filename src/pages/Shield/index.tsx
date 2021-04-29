import React, { useRef, useEffect } from 'react'
import Utils from '@utils'
import { initShiled } from './utils'
import './index.less'

const Shield = (props: any) => {
  const canvasRef = useRef<any>()
  const { w, h, isMobile } = props

  useEffect(() => {
    initShiled(canvasRef.current, w, h, isMobile)
  }, [])

  return (
    <div className="shild-wrapper">
      <canvas ref={canvasRef} />  
    </div>
  )
}

export default Utils.connect({
  component: Shield,
  mapStateToProps: state => ({
    w: state.common.contentWidth,
    h: state.common.contentHeight,
    isMobile: state.common.isMobile,
  })
})