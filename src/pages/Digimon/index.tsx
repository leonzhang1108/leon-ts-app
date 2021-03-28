import React, { useEffect, useRef, useState } from 'react'
import courage from './badges/courage.svg'
import friendship from './badges/friendship.svg'
import love from './badges/love.svg'
import knowledge from './badges/knowledge.svg'
import purity from './badges/purity.svg'
import sincerity from './badges/sincerity.svg'
import hope from './badges/hope.svg'
import light from './badges/light.svg'
import Utils from '@utils'
import './index.less'

const list = [
  courage,
  friendship,
  love,
  knowledge,
  purity,
  sincerity,
  hope,
  light,
]

const Digimon = (props: any) => {
  const { isMobile } = props
  const screenRef = useRef<any>()
  const [index, setIndex] = useState(Utils.random(0, 7))
  const [inited, setInited] = useState(false)

  useEffect(() => {
    Utils.animateScrollTo({
      el: screenRef.current,
      from: screenRef.current.scrollTop,
      to: index * 90
    })
  }, [index])

  return (
    <div className="digimon-wrapper">
      <div className={`digivice-wrapper ${isMobile ? 'mobile' : 'pc'}`}>
        <div className="digivice-container">
          <div className="digivice-container__cut digivice-container__cut--left-top">
            <div className={`wireless ${inited ? 'active' : 'inactive'}`} />
          </div>
          <div className="digivice-container__cut digivice-container__cut--left-bottom" />
          <div className="digivice-container__cut digivice-container__cut--right-top" />
          <div className="digivice-container__cut digivice-container__cut--right-bottom" />
          <div className="digivice">
            <label className={`digivice__button digivice__button--digital ${inited ? 'active' : 'inactive'}`} onClick={() => setInited(inited => !inited)}/>
            <div className={`digivice__button digivice__button--a ${inited ? 'active' : 'inactive'}`} onClick={() => setIndex(index => index === 0 ? 7 : index - 1)} />
            <div className={`digivice__button digivice__button--b ${inited ? 'active' : 'inactive'}`} onClick={() => setIndex(index => index === 7 ? 0 : index + 1)} />
            <div className={`digivice__detail digivice__detail--h digivice__detail--left ${inited ? 'active' : 'inactive'}`} />
            <div className={`digivice__detail digivice__detail--h digivice__detail--right-a ${inited ? 'active' : 'inactive'}`}/>
            <div className={`digivice__detail digivice__detail--h digivice__detail--right-b ${inited ? 'active' : 'inactive'}`}/>
            <div className={`digivice__detail digivice__detail--h digivice__detail--top-left ${inited ? 'active' : 'inactive'}`}/>
            <div className={`digivice__detail digivice__detail--h digivice__detail--top-right ${inited ? 'active' : 'inactive'}`}/>
            <div className={`digivice__detail digivice__detail--h digivice__detail--bottom-left ${inited ? 'active' : 'inactive'}`}/>
            <div className={`digivice__detail digivice__detail--h digivice__detail--bottom-right ${inited ? 'active' : 'inactive'}`}/>
            <div className={`digivice__circle ${inited ? 'active' : 'inactive'}`}>
              <div className={`digivice__inner-circle ${inited ? 'active' : 'inactive'}`}>
                <div className={`digivice__screen ${inited ? 'active' : 'inactive'}`}>
                  <div className="badge-wrapper" ref={screenRef}>
                    {
                      list.map((item, key) => 
                        <div className="badge-item" key={key}>
                          <img src={item} height={90} width={90} />
                        </div>
                      )
                    }
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
  component: Digimon,
  mapStateToProps: state => ({
    isMobile: state.common.isMobile
  })
})
