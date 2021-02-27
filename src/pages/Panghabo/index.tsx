import React, { useState, useCallback } from 'react'
import { Button } from 'antd'
import './index.less'

const Panghabo = () => {
  const [visible, setVisible] = useState(true)

  const restart = useCallback(
    () => {
      setVisible(visible => !visible)
      setTimeout(() => {
        setVisible(visible => !visible)
      }, 0)
    },
    []
  )

  return (
    <div className="panghabo-page-wrapper" style={{ display: visible ? 'flex' : 'none' }}>
      <div className="panghabo-wrapper">
        <div className="step-1">
          <div className="round" />
          <div className="rec">REC</div>
        </div>
        <div className="step-2">
          <div className="wrapper">
            <div className="screen">
              <div className="screen-inner">
                <div className="round" />
                <div className="triangle-wrapper">
                  <div className="triangle" />
                  <div className="rectangle" />
                </div>
              </div>
            </div>
            <div className="bottom">
              <div className="cover" />
            </div>
          </div>
        </div>
        <div className="step-3">
          <div className="wrapper">
            <div className="play-btn">
              <div className="triangle" />
            </div>
            <div className="arrow-wrapper">
              <div className="arrow">
                <div className="triangle" />
                <div className="rectangle" />
              </div>
            </div>
          </div>
        </div>
        <div className="step-4">
          <div className="wrapper">
            <div className="title">
              <span className="white">胖</span>
              <span className="yellow">哈勃</span>
            </div>
            <div className="community">leonzhang</div>
          </div>
        </div>
      </div>
      <Button type="primary" style={{ position: 'absolute', bottom: 20 }} onClick={restart}>restart</Button>
    </div>
  )
}

export default Panghabo
