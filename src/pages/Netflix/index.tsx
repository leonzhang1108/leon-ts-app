import React, { useState, useCallback, useEffect } from 'react'
import { RedoOutlined } from '@constant/icons'
import './index.less'

const Netflix = () => {

  const [btnVisible, setBtnVisible] = useState(false)

  const renderFur = useCallback(() => {
    const list: number[] = []
    for (let i = 31; i > 0; i--) {
      list.push(i)
    }
    return (
      <div className="effect-brush">
        {list.map(item => <span key={item} className={`fur-${item}`} />)}
      </div>
    )
  }, [])

  const renderLamp = useCallback(() => {
    const list: number[] = []
    for (let i = 1; i < 29; i++) {
      list.push(i)
    }
    return (
      <div className="effect-lumieres">
        {list.map(item => <span key={item} className={`lamp-${item}`} />)}
      </div>
    )
  }, [])

  const resetAnime = useCallback( () => {
    setBtnVisible(false)
    setTimeout(() => {
      setBtnVisible(true)
    }, 5000)
  }, [])

  useEffect(resetAnime, [])

  return (
    <div className="netflix-wrapper">
      {
        btnVisible ? (
          <div className="redo">
            <RedoOutlined style={{ color: '#fff' }} onClick={resetAnime} />
          </div>
        ) : (
          <div className="netflix-container">
            {/* @ts-ignore */}
            <div className="letter" letter="N">
              <div className="helper-1">
                {renderFur()}
                {renderLamp()}
              </div>
              <div className="helper-2">
                {renderFur()}
              </div>
              <div className="helper-3">
                {renderFur()}
              </div>
              <div className="helper-4">
                {renderFur()}
              </div>
            </div>
          </div>
        )
      }
    </div>
  );
}

export default Netflix
