import React, { useState } from 'react'
import Utils from '@utils'
import './index.less'

const Jigglypuff = (props: any) => {
  const { isMobile } = props

  const [isAngry, setIsAngry] = useState(false)

  return (
    <div className="jigglypuff-wrapper" onClick={() => setIsAngry(!isAngry)}>
      <div className={`jigglypuff ${isAngry ? 'angry' : ''} ${isMobile ? 'mobile' : ''}`} >
        <div className="head">
          <div className="body" />
          <div className="eye-left">
            <div className="pupil">
              <div className="shine-1" />
              <div className="shine-2">
                <div className="shine-3" />
              </div>
            </div>
          </div>
          <div className="eye-brow-left-top" />
          <div className="eye-brow-left-bottom" />
          <div className="eye-right">
            <div className="pupil">
              <div className="shine-1" />
              <div className="shine-2">
                <div className="shine-3" />
              </div>
            </div>
          </div>
          <div className="eye-brow-right-top" />
          <div className="eye-brow-right-bottom" />
          <div className='smile' />
          <div className="hand-left" />
          <div className="hand-right" />
          <div className="leg-left" />
          <div className="leg-right" />
          <div className="ear-left">
            <div className="inner-ear-left">
              <div className="ear-light-left" />
            </div>
          </div>
          <div className="puff-1" />
          <div className="puff-2" />
          <div className="ear-right">
            <div className="inner-ear-right">
              <div className="ear-light-right" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Utils.connect({
  component: Jigglypuff,
  mapStateToProps: state => ({
    isMobile: state.common.isMobile,
  })
})

