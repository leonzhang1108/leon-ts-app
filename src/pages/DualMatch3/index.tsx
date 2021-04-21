import React, { useEffect, useState, useCallback, useRef, useMemo } from 'react'
import Utils from '@utils'
import NotAvailableOnMobile from '@cpt/NotAvailableOnMobile'
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
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  const { x, y } = mousePos

  const containerStyle = useMemo(() => {
    return {
      width: isMobile ? 230 : 350,
      height: isMobile ? 230 : 350
    }
  }, [isMobile])

  const itemStyle = useCallback(({ row, col }) => {
    return {
      top: row * (isMobile ? 40 : 60),
      left: col * (isMobile ? 40 : 60),
      width: isMobile ? 30 : 50,
      height: isMobile ? 30 : 50
    }
  }, [isMobile])

  const svgLinePoints = useMemo(() => {
    if (!draging) return []
    if (!isMobile) {
      const { left: gameLeft, top: gameTop } = gameRef.current.getBoundingClientRect()
      const { left: wrapperLeft, top: wrapperTop } = wrapperRef.current.getBoundingClientRect()
      const positions = comboList.map((item: any) => {
        const { row, col } = item
        return { x: col * 60 - wrapperLeft + gameLeft + 25, y: row * 60 - wrapperTop + gameTop + 25 }
      })
      return [...positions, mousePos]
    }
    return []
  }, [draging, comboList, mousePos, isMobile])

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

  const doSetMousePosition = (e) => {
    const { left: wrapperLeft, top: wrapperTop } = wrapperRef.current.getBoundingClientRect()
    const mouseLeft = e.pageX || e.touches[0].pageX
    const mouseTop = e.pageY || e.touches[0].pageY

    const left = mouseLeft - wrapperLeft
    const top = mouseTop - wrapperTop
    setMousePos({ x: left, y: top })
  }

  const wrapperMouseMove = useCallback((e) => {
    if (!draging) return
    doSetMousePosition(e)
  }, [comboList, draging])

  return !isMobile ? (
    <div
      className="dual-match-3-wrapper"
      ref={wrapperRef}
      onMouseUp={() => setDraging(false)}
      onMouseMove={wrapperMouseMove}
    >
      <svg className="svg-container" xmlns="http://www.w3.org/2000/svg" version="1.1">
        {
          svgLinePoints.map((points, i) => {
            if (i !== 0) {
              const prevPoints = svgLinePoints[i - 1]
              // console.log(points, prevPoints)
              return (
                <line
                  key={i}
                  x1={prevPoints.x}
                  y1={prevPoints.y}
                  x2={points.x}
                  y2={points.y}
                  style={{ stroke: 'red', strokeWidth: 5 }}
                />
              )
            }
            return null
          })
        }
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
                    onMouseDown={(e) => {
                      setDraging(true)
                      doSetMousePosition(e)
                      setComboList(() => [{ row, col, key: item.key }])
                    }}
                    onMouseEnter={() => mouseEnter({ row, col, key: item.key })}
                  ></div>
                )
              )
          )
        }
      </div>
    </div>
  ) : <NotAvailableOnMobile />
}

export default Utils.connect({
  component: DualMatch3,
  mapStateToProps: state => ({
    isMobile: state.common.isMobile,
  })
})