import React, { useState } from 'react'
import Utils from '@utils'
import frame from './frame.svg'
import './index.less'

const emojiList = [
  '🦖💍🐒🎹🥪🇬🇧',
  '🤣🐣🛁💻🚬🇾🇪',
  '🐧🤌🍕👙🩺🇨🇳',
  '👸👗👠☕️⛵️🇮🇳',
  '👩‍🍳💯👢🎰🕶🇬🇧',
  '🐈🎸🚕🏃‍♀️🚲🇫🇷',
]

const Friends = (props: any) => {
  const { h, w, isMobile } = props
  const [index, setIndex] = useState(Utils.random(0, 6))

  return (
    <div
      className="friends-wrapper"
      onClick={() => {
        let tempIndex = index
        while (tempIndex === index) {
          tempIndex = Utils.random(0, 6)
        }
        setIndex(tempIndex)
      }}
    >
      <div className="frame-wrapper">
        <img
          className="frame"
          src={frame}
          height={isMobile ? (h / 2) : (h / 1.2)}
          width={isMobile ? w : w * 0.8}
        />
        <div className="emoji" style={{ fontSize: isMobile ? (h / 25) : (h / 17) }}>{emojiList[index]}</div>
      </div>
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
