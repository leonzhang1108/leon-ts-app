import React from 'react'
import './index.less'

const Loader = () => {
  return (
    <div className="loading-center">
      <div className="loading">
        <div className="cat">
          <div className="head">
            <div className="ears"></div>
            <div className="eyes"></div>
          </div>
        </div>
        <div className="squares">
          <div className="box"></div>
          <div className="box"></div>
          <div className="box"></div>
        </div>
      </div>
    </div>
  )
}

export default Loader
