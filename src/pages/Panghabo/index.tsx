import React, { useState, useCallback, useEffect } from 'react'
import { Button, Switch } from 'antd'
import { makeSound, preloadSound } from './utils'
import intro from '@sound/panghabo-intro.mp3'
import './index.less'

const Panghabo = () => {
  const [visible, setVisible] = useState(true)
  const [hasMusic, setHasMusic] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  
  useEffect(() => {
    hasMusic && preloadSound(intro)
  }, [hasMusic])

  const restart = useCallback(
    () => {
      setIsPlaying(true)
      setVisible(visible => !visible)
      setTimeout(() => {
        setVisible(visible => !visible)
        hasMusic && makeSound(intro)
      }, 0)
      setTimeout(() => {
        setIsPlaying(false)
      }, 2700)
    },
    [hasMusic]
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
      <div className="btn-wrapper">
        <Switch disabled={isPlaying} checked={hasMusic} onChange={setHasMusic} checkedChildren="开启音乐" unCheckedChildren="关闭音乐" />
        <Button disabled={isPlaying} shape="round" type="primary" onClick={restart}>restart</Button>
      </div>
    </div>
  )
}

export default Panghabo
