import React from 'react'
import './index.less'

const Lantern = () => {
  return (
    <div className="lantern-wrapper">
      <div className="green-lantern">
        <div className="inner-circle" />
      </div>
      <div className="red-lantern">
        <div className="inner-circle" />
        <div className="left-1" />
        <div className="left-2" />
        <div className="left-3" />
        <div className="right-1" />
        <div className="right-2" />
        <div className="right-3" />
      </div>
      <div className="black-lantern">
        <div className="trangle" />
        <div className="trangle-inner" />
        <div className="line">
          <div className="item" />
          <div className="item" />
          <div className="item" />
          <div className="item" />
          <div className="item" />
        </div>
        <div className="inner-circle-wrapper">
          <div className="inner-circle" />
        </div>
      </div>
      <div className="orange-lantern">
        <div className="inner-circle" />
        <div className="left-1" />
        <div className="right-1" />
        <div className="left-2" />
        <div className="right-2" />
        <div className="left-3" />
        <div className="right-3" />
      </div>
      <div className="indigo-lantern">
        <div className="inner-circle" />
        <div className="top-trangle" />
        <div className="top-trangle-inner" />
        <div className="bottom-trangle" />
        <div className="bottom-trangle-inner" />
      </div>
      <div className="purple-lantern">

      </div>
    </div>
  )
}

export default Lantern
