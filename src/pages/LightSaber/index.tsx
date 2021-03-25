import React, { useState, useEffect, useCallback } from 'react'
import Utils from '@utils'
import './index.scss'

const LightSaber = (props: any) => {
  const { isMobile, h, w } = props
  const [mainBeam, setMainBeam] = useState(false)
  const [sideBeam, setSideBeam] = useState(false)
  const [isOn, setIsOn] = useState(false)
  const [loading, setLoading] = useState(false)

  const onClick = () => {
    if (!loading) {
      setLoading(true)
      if (isOn) {
        setTimeout(() => {
          setMainBeam(false)
        }, 200)
        setTimeout(() => {
          setSideBeam(false)
        }, 970)
        setTimeout(() => {
          setIsOn(false)
          setLoading(false)
        }, 1200)
      } else {
        setIsOn(true)
        setTimeout(() => {
          setMainBeam(true)
        }, 500)
        setTimeout(() => {
          setSideBeam(true)
          setLoading(false)
        }, 1270)
      }
    }
  }

  return (
    <div className="light-saber-wrapper" onClick={onClick}>
      <div
        className={`container ${isMobile ? 'mobile' : 'pc'} ${isOn ? 'on' : 'off'}`}
        style={{
          top: isMobile ? (h / 2 - 300) : undefined,
          right: !isMobile ? (w / 2 - 200) : undefined
        }}
      >
        <div className="housing">
          <div className="battery" />
          <div className="back" />
          <div className="backPeg backPeg1" />
          <div className="backPeg backPeg2" />
          <div className="backPeg backPeg3" />
          <div className="backPeg backPeg4" />
          <div className="yellow">
            <div className="leftScrew" />
            <div className="rightScrew" />
          </div>
          <div className="peg middlePeg1" />
          <div className="peg middlePeg2" />
          <div className="peg middlePeg3" />
          <div className="spacer spacer1" />
          <div className="front">
            <div className="hole">
              <div className="power" />
              <div className="blue blueCable1" />
              <div className="blue blueCable2" />
            </div>
            <div className="spacer spacer2" />
            <div className="sideHousing">
              <div className="spacer spacer3" />
              <div className="frontHousing" />
              <div className="side upperSideHousing">
                <div className="left side1CoverLeft" />
                <div className="right side1CoverRight" />
                <div className="left side2CoverLeft" />
                <div className="right side2CoverRight" />
              </div>
              <div className="side lowerSideHousing" />
              <div className="saberLong" style={{ width: mainBeam ? 1000 : 0 }}>
                <div className={`sparks sparkUp spark1 ${mainBeam ? 'sparkAnimationUp spark' : ''}`} />
                <div className={`sparks sparkDown spark2 ${mainBeam ? 'sparkAnimationDown spark' : ''}`} />
                <div className="line1" style={{ width: mainBeam ? 960 : 0 }} />
                <div className="line2" style={{ width: mainBeam ? 960 : 0 }} />
              </div>
              <div className="saberUpper" style={{ height: sideBeam ? 175 : 0 }}>
                <div className="line3" style={{ height: sideBeam ? 150 : 0 }} />
                <div className="line4" style={{ height: sideBeam ? 150 : 0 }} />
              </div>
              <div className="saberLower" style={{ height: sideBeam ? 175 : 0 }}>
                <div className="line5" style={{ height: sideBeam ? 150 : 0 }} />
                <div className="line6" style={{ height: sideBeam ? 150 : 0 }} />
              </div>
            </div>
          </div>
          <div className="redCable" />
          <div className="cover cover1" />
          <div className="cover cover2" />
          <div className="cover cover3" />
          <div className="cover cover4" />
        </div>
      </div>
    </div>
  );
}

export default Utils.connect({
  component: LightSaber,
  mapStateToProps: state => ({
    isMobile: state.common.isMobile,
    h: state.common.contentHeight,
    w: state.common.contentWidth,
  })
})

