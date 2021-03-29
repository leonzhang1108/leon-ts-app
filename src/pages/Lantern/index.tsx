import React, { useState, useMemo } from 'react'
import Utils from '@utils'
import { oathEn, oathCh } from './oath'
import './index.less'

function GreenLantern(props: any) {
  return (
    <div className="green-lantern lantern" {...props}>
      <div className="inner-circle" />
    </div>
  )
}

function RedLantern(props: any) {
  return (
    <div className="red-lantern lantern" {...props}>
      <div className="inner-circle" />
      <div className="left-1" />
      <div className="left-2" />
      <div className="left-3" />
      <div className="right-1" />
      <div className="right-2" />
      <div className="right-3" />
    </div>
  )
}

function BlackLantern(props: any) {
  return (
    <div className="black-lantern lantern" {...props}>
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
}

function OrangeLantern(props: any) {
  return (
    <div className="orange-lantern lantern" {...props}>
      <div className="inner-circle" />
      <div className="left-1" />
      <div className="right-1" />
      <div className="left-2" />
      <div className="right-2" />
      <div className="left-3" />
      <div className="right-3" />
    </div>
  )
}

function IndigoLantern(props: any) {
  return (
    <div className="indigo-lantern lantern" {...props}>
      <div className="inner-circle" />
      <div className="top-trangle" />
      <div className="top-trangle-inner" />
      <div className="bottom-trangle" />
      <div className="bottom-trangle-inner" />
    </div>
  )
}

function PurpleLantern(props: any) {
  return (
    <div className="purple-lantern lantern" {...props}>
      <div className="inner-square-1" />
      <div className="inner-square-2" />
      <div className="inner-square-1 rotate" />
      <div className="inner-square-2 rotate" />
      <div className="inner-circle" />
    </div>
  )
}

function BlueLantern(props: any) {
  return (
    <div className="blue-lantern lantern" {...props}>
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
}

function YellowLantern(props: any) {
  return (
    <div className="yellow-lantern lantern" {...props}>
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
}

function WhiteLantern(props: any) {
  return (
    <div className="white-lantern lantern" {...props}>
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
}

const LanternList = [
  WhiteLantern,
  PurpleLantern,
  IndigoLantern,
  BlueLantern,
  GreenLantern,
  YellowLantern,
  OrangeLantern,
  RedLantern,
  BlackLantern,
]


const colorMap = {
  WhiteLantern: '204, 204, 204',
  PurpleLantern: '160, 60, 150',
  IndigoLantern: '88, 0, 199',
  BlueLantern: '70, 117, 185',
  GreenLantern: '79, 139, 90',
  YellowLantern: '150, 140, 40',
  OrangeLantern: '198, 85, 15',
  RedLantern: '203, 35, 40',
  BlackLantern: '51, 51, 51',
}

const randomIndex = Utils.random(0, 8)

const Lantern = (props: any) => {
  const { isMobile } = props
  const [curr, setCurr] = useState(LanternList[randomIndex].name)
  const [visible, setVisible] = useState(true)
  const [fadeIn, setFadeIn] = useState(false)
  const [fadeOut, setFadeOut] = useState(false)

  const { CenterLantern, OtherLanterns } = useMemo(() => {
    const index = LanternList.findIndex((Item) => Item.name === curr)
    const CenterLantern = LanternList[index]
    const OtherLanterns = LanternList.filter((_, i) => i !== index)
    return {
      CenterLantern,
      OtherLanterns
    }
  }, [curr])

  return (
    <div className="lantern-wrapper" style={{ background: `rgba(${colorMap[curr]}, 0.3)` }}>
      {
        visible ? (
          <div className={`oath-wrapper ch ${isMobile ? 'mobile' : 'pc'} ${fadeIn ? 'fadein' : ''} ${fadeOut ? 'fadeout' : ''}`} style={{ color: `rgba(${colorMap[curr]}, 0.8)` }}>  
            {oathCh[curr].split('\n').filter(item => !!item).map((item, i) => <div key={i}>{item}</div>)}
          </div>
        ) : null
      }
      {
        visible ? (
          <div className={`around-wrapper-wrapper ${fadeIn ? 'fadein' : ''} ${fadeOut ? 'fadeout' : ''}`}>
            <div className={`around-wrapper ${isMobile ? 'mobile' : 'pc'}`}>
              <div className="center">
                <CenterLantern />
              </div>
              {
                OtherLanterns.map((Cpt, index) => {
                  return (
                    <div className={`around item-${index}`} key={index}>
                      <Cpt onClick={() => {
                        setFadeOut(true)
                        setTimeout(() => {
                          setCurr(Cpt.name)
                          setVisible(false)
                          setFadeOut(false)
                          setFadeIn(true)
                          setTimeout(() => {
                            setVisible(true)
                          })
                          setTimeout(() => {
                            setFadeIn(false)
                          }, 350)
                        }, 350)
                        
                      }}/>
                    </div>
                  )
                })
              }
            </div>
          </div>
        ) : null
      }
      {
        visible ? (
          <div className={`oath-wrapper en ${isMobile ? 'mobile' : 'pc'} ${fadeIn ? 'fadein' : ''} ${fadeOut ? 'fadeout' : ''}`} style={{ color: `rgba(${colorMap[curr]}, 0.8)` }}>
            {oathEn[curr].split('\n').filter(item => !!item).map((item, i) => <div key={i}>{item}</div>)}
          </div>
        ) : null
      }
    </div>
  )
}

export default Utils.connect({
  component: Lantern,
  mapStateToProps: state => ({
    isMobile: state.common.isMobile
  })
})
