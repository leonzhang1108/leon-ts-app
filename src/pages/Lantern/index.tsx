import React from 'react'
import Utils from '@utils'
import './index.less'

const GreenLantern = () => (
  <div className="green-lantern lantern">
    <div className="inner-circle" />
  </div>
)

const RedLantern = () => (
  <div className="red-lantern lantern">
    <div className="inner-circle" />
    <div className="left-1" />
    <div className="left-2" />
    <div className="left-3" />
    <div className="right-1" />
    <div className="right-2" />
    <div className="right-3" />
  </div>
)

const BlackLantern = () => (
  <div className="black-lantern lantern">
    <div className="trangle" />
    <div className="trangle-inner" />
    <div className="vertical-line" />
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
)

const OrangeLantern = () => (
  <div className="orange-lantern lantern">
    <div className="inner-circle" />
    <div className="left-1" />
    <div className="right-1" />
    <div className="left-2" />
    <div className="right-2" />
    <div className="left-3" />
    <div className="right-3" />
  </div>
)

const IndigoLantern = () => (
  <div className="indigo-lantern lantern">
    <div className="inner-circle" />
    <div className="top-trangle" />
    <div className="top-trangle-inner" />
    <div className="bottom-trangle" />
    <div className="bottom-trangle-inner" />
  </div>
)

const PurpleLantern = () => (
  <div className="purple-lantern lantern">
    <div className="inner-square-1" />
    <div className="inner-square-2" />
    <div className="inner-square-1 rotate" />
    <div className="inner-square-2 rotate" />
    <div className="inner-circle" />
  </div>
)

const BlueLantern = () => (
  <div className="blue-lantern lantern">
    <div className="inner-circle-1" />
    <div className="inner-circle-2" />
    <div className="inner-circle-3">
      <div className="inner-circle-3-item" />
    </div>
    <div className="top-left-black" />
    <div className="top-right-black" />
    <div className="top-center-black" />
    <div className="top-left-blue" />
    <div className="top-right-blue" />
    <div className="bottom-left-black" />
    <div className="bottom-right-black" />
    <div className="bottom-center-black" />
    <div className="bottom-left-blue" />
    <div className="bottom-right-blue" />
  </div>
)

const YellowLantern = () => (
  <div className="yellow-lantern lantern">
    <div className="inner-circle-1" />
    <div className="inner-circle-2" />
    <div className="inner-circle-3" />
    <div className="top-left-black" />
    <div className="top-right-black" />
    <div className="top-left-yellow" />
    <div className="top-right-yellow" />
    <div className="top-left-black-outer" />
    <div className="top-right-black-outer" />
    <div className="bottom-left-black" />
    <div className="bottom-right-black" />
    <div className="bottom-center" />
  </div>
)

const WhiteLantern = () => (
  <div className="white-lantern lantern">
    <div className="trangle" />
    <div className="trangle-inner" />
    <div className="inner-circle" />
    <div className="bar-wrapper">
      <div className="bar item-0" />
      <div className="bar item-1" />
      <div className="bar item-2" />
      <div className="bar item-3" />
      <div className="bar item-4" />
      <div className="bar item-5" />
      <div className="bar item-6" />
      <div className="bar item-7" />
      <div className="bar item-8" />
      <div className="bar item-9" />
    </div>
  </div>
)

const Lantern = (props: any) => {
  const { isMobile } = props
  return (
    <div className="lantern-wrapper">
      <div className ={`ring-wrapper ${!isMobile ? 'pc' : ''}`}>
        <WhiteLantern />
        <PurpleLantern />
        <IndigoLantern />
        <BlueLantern />
        <GreenLantern />
        <YellowLantern />
        <OrangeLantern />
        <RedLantern />
        <BlackLantern />
      </div>
    </div>
  )
}

export default Utils.connect({
  component: Lantern,
  mapStateToProps: state => ({
    isMobile: state.common.isMobile
  })
})
