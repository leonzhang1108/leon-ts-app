import React, { useCallback, useState, useEffect } from 'react'
import Utils from '@utils'
import './index.less'

const EyeOfTruth = (props: any) => {
  const { h } = props

  const [isClose, setIsClose] = useState(true)
  const [visible, setVisible] = useState(false)
  const [clickable, setClickable] = useState(true)

  const openEye = useCallback(() => {
    setClickable(false)
    setIsClose(false)
    setTimeout(() => {
      setVisible(true)
      setClickable(true)
    }, 500)
  }, [])

  const closeEye = useCallback(() => {
    setClickable(false)
    setVisible(false)
    setTimeout(() => {
      setIsClose(true)
      setClickable(true)
    }, 500)
  }, [])

  const doBlick = useCallback(() => {
    if (!clickable) return
    isClose ? openEye() : closeEye()
  }, [visible, clickable])

  console.log(isClose)
  useEffect(() => {
    setTimeout(openEye)
  }, [])

  return (
    <div className="eye-of-truth-wrapper" onClick={doBlick}>
      <div className="inner-wrapper" style={{ transform: `scale(${h / 1000}) rotateY(${isClose ? 90 : 0}deg)` }}>
        <div className="eye">
          <div className="iris" style={{ opacity: visible ? 1 : 0}}>
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
  component: EyeOfTruth,
  mapStateToProps: state => ({
    h: state.common.contentHeight,
  })
})