import React from 'react'
import Utils from '@utils'
import frame from './frame.svg'
import './index.less'

const Friends = (props: any) => {
  const { h, w, isMobile } = props
  return (
    <div className="friends-wrapper">
      <img
        className="frame"
        src={frame}
        height={isMobile ? (h / 2) : (h / 1.2)}
        width={isMobile ? w : w * 0.8}
      />
      <div
        className="l-logo"
        style={{
          transform: `scale(${isMobile ? 0.4 : 1})`,
          height: isMobile ? undefined : 300
        }}>
        <div className="fire red _f" />
        <div className="fire yellow _r" />
        <div className="fire blue _i" />
        <div className="fire red _e" />
        <div className="fire yellow _n" />
        <div className="fire blue _d" />
        <div className="friends-title">friends</div>
      </div>
    </div>
  )
}

export default Utils.connect({
  component: Friends,
  mapStateToProps: state => ({
    h: state.common.contentHeight,
    w: state.common.contentWidth,
    isMobile: state.common.isMobile,
  })
})