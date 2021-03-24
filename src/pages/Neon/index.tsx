import React, { useEffect, useRef } from 'react'
import { init } from './init'
import NotAvailableOnMobile from '@cpt/NotAvailableOnMobile'
import Utils from '@utils'
import './index.less'

const Neon = (props: any) =>  {
  const wrapperRef = useRef<any>()
  const inputRef = useRef<any>()
  const neonFunctionRef = useRef<any>()
  const { isMobile } = props

  useEffect(() => {
    if (!isMobile) {
      neonFunctionRef.current = init(wrapperRef, inputRef)
    }

    return () => {
      neonFunctionRef.current && neonFunctionRef.current.clear()
    }
  }, [isMobile])
  return !isMobile ? (
    <div className="neon-wrapper" ref={wrapperRef}>
      <input ref={inputRef} className="input" placeholder="type here" defaultValue="LEON"/>
    </div>
  ) : <NotAvailableOnMobile />
}

export default Utils.connect({
  component: Neon,
  mapStateToProps: state => ({
    isMobile: state.common.isMobile
  })
})

