import React, { useEffect, useState, useCallback, useRef, useMemo } from 'react'
import Utils from '@utils'
import NotAvailableOnMobile from '@cpt/NotAvailableOnMobile'
import './index.less'

const colors = ['#4E79A5', '#F18F3B', '#E0585B', '#77B7B2']

const randomNum = (min, max) =>
  parseInt(Math.random() * (max - min + 1) + min, 10)

const getItems = () => {
  const list: any = []
  for (let i = 0; i < 6; i++) {
    const itemList: any = []
    for (let j = 0; j < 6; j++) {
      itemList.push({
        key: Utils.uuid(),
        color: colors[randomNum(0, 3)],
        value: randomNum(1, 3),
        opacity: 1
      })
    }
    list.push(itemList)
  }
  return list
}

const getItemClass = (row, col, comboList) => {
  const index = comboList.findIndex((item) => {
    return item.row === row && item.col === col
  })
  return index >= 0 ? 'item active' : 'item'
}

const DualMatch3 = (props: any) => {
  const { isMobile } = props

  const wrapperRef = useRef<any>()
  const gameRef = useRef<any>()
  const [itemList, setItemList] = useState(getItems())
  const [draging, setDraging] = useState(false)
  const [comboList, setComboList] = useState<any>([])
  const [lineColor, setLineColor] = useState<string>()
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  const { x, y } = mousePos

  const containerStyle = useMemo(() => {
    return {
      width: isMobile ? 230 : 340,
      height: isMobile ? 230 : 340,
    }
  }, [isMobile])

  const itemStyle = useCallback(
    ({ row, col, item }) => {
      const { color, opacity } = item
      return {
        top: row * (isMobile ? 40 : 60),
        left: col * (isMobile ? 40 : 60),
        width: isMobile ? 30 : 40,
        height: isMobile ? 30 : 40,
        background: color,
        opacity
      }
    },
    [isMobile]
  )

  const svgLinePoints = useMemo(() => {
    if (!draging) return []
    if (!isMobile) {
      const {
        left: gameLeft,
        top: gameTop,
      } = gameRef.current.getBoundingClientRect()
      const {
        left: wrapperLeft,
        top: wrapperTop,
      } = wrapperRef.current.getBoundingClientRect()
      const positions = comboList.map((item: any) => {
        const { row, col } = item
        return {
          x: col * 60 - wrapperLeft + gameLeft + 20,
          y: row * 60 - wrapperTop + gameTop + 20,
        }
      })
      return [...positions, mousePos]
    }
    return []
  }, [draging, comboList, mousePos, isMobile])

  const mouseEnter = useCallback(
    ({ row, col, item }) => {
      if (!draging) return
      const { key, color } = item
      const index = comboList.findIndex((item) => item.key === key)
      if (index === comboList.length - 1) {
        setComboList((comboList) => comboList.slice(0, comboList.length - 1))
      } else {
        // 未连接且同色且相邻
        const latest = comboList[comboList.length - 1]
        const { row: latestRow, col: latestCol } = latest
        const isNeighbour = (Math.abs(latestRow - row) < 2) && (Math.abs(latestCol - col) < 2)
        if (isNeighbour && index === -1 && lineColor === color) {
          setComboList((comboList) => comboList.concat({ row, col, key }))
        }
      }
    },
    [comboList, draging, lineColor]
  )

  const doSetMousePosition = (e) => {
    const {
      left: wrapperLeft,
      top: wrapperTop,
    } = wrapperRef.current.getBoundingClientRect()
    const mouseLeft = e.pageX || e.touches[0].pageX
    const mouseTop = e.pageY || e.touches[0].pageY

    const left = mouseLeft - wrapperLeft
    const top = mouseTop - wrapperTop
    setMousePos({ x: left, y: top })
  }

  const wrapperMouseMove = useCallback(
    (e) => {
      if (!draging) return
      doSetMousePosition(e)
    },
    [comboList, draging]
  )

  const mouseUp = useCallback(() => {
    if (comboList.length >= 3) {
      const tempList = [...itemList]
      comboList.forEach((item) => {
        const { row, col } = item
        tempList[row][col] = {
          ...tempList[row][col],
          opacity: 0
        }
      })
      setItemList(itemList)
    }
    setDraging(false)
    setComboList([])
  }, [comboList, itemList])

  return !isMobile ? (
    <div
      className="dual-match-3-wrapper"
      ref={wrapperRef}
      onMouseUp={mouseUp}
      onMouseMove={wrapperMouseMove}
    >
      <svg
        className="svg-container"
        xmlns="http://www.w3.org/2000/svg"
        version="1.1"
      >
        {svgLinePoints.map((points, i) => {
          if (i !== 0) {
            const prevPoints = svgLinePoints[i - 1]
            return (
              <line
                key={i}
                x1={prevPoints.x}
                y1={prevPoints.y}
                x2={points.x}
                y2={points.y}
                style={{ stroke: lineColor, strokeWidth: 5 }}
              />
            )
          }
          return null
        })}
      </svg>
      <div className="game-area" ref={gameRef} style={containerStyle}>
        {itemList.map((list: any, row: number) =>
          list.map((item: any, col: number) => (
            <div
              className={getItemClass(row, col, comboList)}
              key={item.key}
              style={itemStyle({ row, col, item })}
              onMouseDown={(e) => {
                setDraging(true)
                doSetMousePosition(e)
                setComboList(() => [{ row, col, key: item.key }])
                setLineColor(item.color)
              }}
              onMouseEnter={() => mouseEnter({ row, col, item })}
            >
              {item.value}
            </div>
          ))
        )}
      </div>
    </div>
  ) : (
    <NotAvailableOnMobile />
  )
}

export default Utils.connect({
  component: DualMatch3,
  mapStateToProps: (state) => ({
    isMobile: state.common.isMobile,
  }),
})
