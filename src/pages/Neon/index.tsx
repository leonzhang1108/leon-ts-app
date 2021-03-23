import React, { useEffect, useRef } from 'react'
import { init } from './init'
import NotAvailableOnMobile from '@cpt/NotAvailableOnMobile'
import Utils from '@utils'
import './index.less'

const Neon = (props: any) =>  {
  const wrapperRef = useRef<any>()
  const inputRef = useRef<any>()
  const { isMobile } = props

  useEffect(() => {
    !isMobile && init(wrapperRef, inputRef)
  }, [isMobile])
  return !isMobile ? (
    <div className="neon-wrapper" ref={wrapperRef}>
      <input ref={inputRef} className="input" placeholder="type here" defaultValue="Leon"/>
    </div>
  ) : <NotAvailableOnMobile />
}

export default Utils.connect({
  component: Neon,
  mapStateToProps: state => ({
    isMobile: state.common.isMobile
  })
})

