import React, { useEffect, useState, useCallback, useRef, useMemo } from 'react'
import Utils from '@utils'
import './index.less'

const getItems = () => {
  const list: any = []
  for (let i = 0; i < 6; i++) {
    const itemList: any = []
    for (let j = 0; j < 6; j++) {
      itemList.push({
        key: Utils.uuid()
      })
    }
    list.push(itemList)
  }
  return list
}

const DualMatch3 = (props: any) => {
  const { isMobile } = props

  const wrapperRef = useRef<any>()
  const gameRef = useRef<any>()
  const [itemList, setItemList] = useState(getItems())
  const [draging, setDraging] = useState(false)
  const [comboList, setComboList] = useState<any>([])
  const [{ x, y }, setMousePos] = useState({ x: 50, y: 50 })

  const containerStyle = useMemo(() => {
    return {
      width: isMobile ? 230 : 350,
      height: isMobile ? 230 : 350
    }
  }, [isMobile])

  const itemStyle = useCallback(({ row, col }) => {
    return {
      top: row * (isMobile ? 40: 60),
      left: col * (isMobile ? 40: 60),
      width: isMobile ? 30 : 50,
      height: isMobile ? 30 : 50
    }
  }, [isMobile])

  useEffect(() => {
    // console.log(draging)
  }, [draging])

  useEffect(() => {
    if (draging) {
      // console.log(comboList)
    }
  }, [comboList, draging])

  const mouseEnter = useCallback(({ row, col, key }) => {
    if (!draging) return
    const index = comboList.findIndex(item => item.key === key)
    if (index === comboList.length - 1) {
      setComboList(comboList => comboList.slice(0, comboList.length - 1))
    } else {
      if (index === -1) {
        setComboList(comboList => comboList.concat({ row, col, key }))
      }
    }
  }, [comboList, draging])

  const wrapperMouseMove = useCallback((e) => {
    if (!draging) return
    const { left: gameLeft, top: gameTop } = gameRef.current.getBoundingClientRect()
    const { left: wrapperLeft, top: wrapperTop } = wrapperRef.current.getBoundingClientRect()
    const mouseLeft = e.pageX || e.touches[0].pageX
    const mouseTop = e.pageY || e.touches[0].pageY

    const left = mouseLeft - wrapperLeft
    const top = mouseTop - wrapperTop
    setMousePos({ x: left, y: top })
  }, [comboList, draging])

  return (
    <div
      className="dual-match-3-wrapper"
      ref={wrapperRef}
      onMouseUp={() => setDraging(false)}
      onTouchEnd={() => setDraging(false)}
      onMouseMove={wrapperMouseMove}
      onTouchMove={wrapperMouseMove}
    >
      <svg className="svg-container" xmlns="http://www.w3.org/2000/svg" version="1.1">
        <line x1="50" y1="50" x2={x} y2={y} style={{ stroke: 'red', strokeWidth: 5 }}/>
      </svg>
      <div className="game-area" ref={gameRef} style={containerStyle}>
        {
          itemList.map(
            (list: any, row: number) => 
              list.map(
                (item: any, col: number) => (
                  <div
                    className="item"
                    key={item.key}
                    style={itemStyle({ row, col })}
                    onMouseDown={() => {
                      setDraging(true)
                      setComboList(comboList => comboList.concat({ row, col, key: item.key }))
                    }}
                    onTouchStart={() => {
                      setDraging(true)
                      setComboList(comboList => comboList.concat({ row, col, key: item.key }))
                    }}
                    onMouseEnter={() => mouseEnter({ row, col, key: item.key })}
                  ></div>
                )
              )
          )
        }
      </div>
    </div>
  )
}

export default Utils.connect({
  component: DualMatch3,
  mapStateToProps: state => ({
    isMobile: state.common.isMobile,
  })
})