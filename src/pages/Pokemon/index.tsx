import React, { useEffect, useRef, useState, useMemo } from 'react'
import init from './util'
import Utils from '@utils'
import Loader from '@cpt/Loader'
import './index.less'

const Pokemon = (props: any) => {
  const wrapperRef = useRef<any>()
  const { height, width } = props
  const [count, setCount] = useState(0)

  const loading = useMemo(() => {
    return count !== 3
  }, [count])

  useEffect(() => {
    const destroy = init({
      el: wrapperRef.current,
      height,
      width,
      setCount,
    })
    return () => {
      destroy()
    }
  }, [])

  return (
    <div className="pokemon-wrapper">
      <div ref={wrapperRef} />
      {/* <div className="source-tip">
        source: https://codepen.io/pizza3/pen/oNZYyxy
      </div> */}
      {loading ? (
        <div className="model-loading">
          <Loader />
        </div>
      ) : null}
    </div>
  )
}

export default Utils.connect({
  component: Pokemon,
  mapStateToProps: (state) => ({
    width: state.common.contentWidth,
    height: state.common.contentHeight,
  }),
})
