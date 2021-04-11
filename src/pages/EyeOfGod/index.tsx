import React from 'react'
import Utils from '@utils'
import './index.less'

const EyeOfGod = (props: any) => {

  const { h } = props

  return (
    <div className="eye-of-god-wrapper" >
      <div className="inner-wrapper" style={{ transform: `scale(${h / 1000})` }}>
        <div className="eye">
          <div className="iris">
            <div className="ring-4">
              <div className="ring-3">
                <div className="ring-2">
                  <div className="ring-1">
                    <div className="pupil" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Utils.connect({
  component: EyeOfGod,
  mapStateToProps: state => ({
    h: state.common.contentHeight,
  })
})