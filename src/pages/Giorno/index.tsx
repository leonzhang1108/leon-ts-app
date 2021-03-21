import React from 'react'
import Utils from '@utils'
import './index.less'


const Giorno = (props: any) => {
  const { isMobile } = props
  return (
    <div className={`giorno-wrapper ${isMobile ? 'mobile' : ''}`} >   
      <div className="icon-body">
        <div className="top">
          <div className="nose" />
          <div className="eye left" />
          <div className="eye right" />
        </div>
        <div className="heart-wrapper">
          <div className="left-spot-1" />
          <div className="right-spot-1" />
          <div className="left-spot-2" />
          <div className="right-spot-2" />
          <div className="left-spot-3" />
          <div className="right-spot-3" />
          <div className="line" />
          <div className="heart">
            <div className="heart-left" />
            <div className="heart-right" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Utils.connect({
  component: Giorno,
  mapStateToProps: state => ({
    isMobile: state.common.isMobile
  })
})
