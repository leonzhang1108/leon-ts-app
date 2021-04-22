import React, { useState, useCallback, useRef, useMemo } from 'react'
import Utils from '@utils'
import './index.less'

const colors = ['#4E79A5', '#F18F3B', '#E0585B', '#77B7B2']

const randomNum = (min, max) =>
  parseInt(Math.random() * (max - min + 1) + min, 10)

const initItem = () => ({
  key: Utils.uuid(),
  color: colors[randomNum(0, 3)],
  value: randomNum(1, 3),
  opacity: 1
})

const getItems = () => {
  const list: any = []
  for (let i = 0; i < 6; i++) {
    const itemList: any = []
    for (let j = 0; j < 6; j++) {
      itemList.push(initItem())
    }
    list.push(itemList)
  }
  return list
}

const getItemClass = (row, col, comboList, { isNew = false }) => {
  const index = comboList.findIndex((item) => {
    return Number(item.row) === Number(row) && Number(item.col) === Number(col)
  })
  const className = index >= 0 ? 'item active' : 'item'
  return isNew ? `${className} new` : className
}

const calculateNewItemList = (list) => {
  for (let col = 0; col < list.length; col++) {
    const colList = list.map(item => item[col]).filter(item => item.opacity === 1)
    const newItemsList: any = []
    for (let num = 0; num < list.length - colList.length; num++) {
      newItemsList.push({
        ...initItem(),
        isNew: true
      })
    }
    ;[...newItemsList, ...colList].map((item, i) => {
      const { top, ...rest } = item
      list[i][col] = rest
    })
  }
  return [...list]
}

const DualMatch3 = (props: any) => {
  const { isMobile } = props

  const wrapperRef = useRef<any>()
  const gameRef = useRef<any>()
  const staticItem = useRef<any>()
  const [itemList, setItemList] = useState(getItems())
  const [draging, setDraging] = useState(false)
  const [comboList, setComboList] = useState<any>([])
  const [lineColor, setLineColor] = useState<string>()
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  const containerStyle = useMemo(() => {
    return {
      width: isMobile ? 230 : 340,
      height: isMobile ? 230 : 340,
    }
  }, [isMobile])

  const itemStyle = useCallback(
    ({ row, col, item }) => {
      const { color, opacity, top = 0 } = item
      return {
        top: row * (isMobile ? 40 : 60) + top,
        left: col * (isMobile ? 40 : 60),
        width: isMobile ? 30 : 40,
        height: isMobile ? 30 : 40,
        background: color,
        opacity,
      }
    },
    [isMobile]
  )

  const svgLinePoints = useMemo(() => {
    if (!draging) return []
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
        x: col * (isMobile ? 40 : 60) - wrapperLeft + gameLeft + (isMobile ? 15 : 20),
        y: row * (isMobile ? 40 : 60) - wrapperTop + gameTop + (isMobile ? 15 : 20),
      }
    })
    return [...positions, mousePos]
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
      if (!draging || isMobile) return
      doSetMousePosition(e)
    },
    [comboList, draging]
  )

  const mouseUp = useCallback(() => {
    if (comboList.length >= 3) {

      // hide combo item
      comboList.forEach((item) => {
        const { row, col } = item
        itemList[row][col].opacity = 0
      })

      // gravity effect
      const tempList: any = [[], [], [], [], [], []]
      for (let col = 0; col < 6; col++) {
        let top = 0
        let row = 5
        let list: any = []

        while (row >= 0) {
          const item = itemList[row][col]
          item.top = top
          if (item.opacity === 0) {
            top += (isMobile ? 40 : 60)
          }
          row--
          list = [item, ...list]
        }
        
        list.forEach((item: any, row) => {
          tempList[row].push({ ...item })
        })
      }

      setItemList(tempList)

      setTimeout(() => {
        const list = calculateNewItemList(itemList)
        setItemList(list)
        setTimeout(() => {
          setItemList(list.map((row) => row.map(({ isNew, ...rest }) => rest)))
        }, 200)
      }, 300)
    }
    setDraging(false)
    setComboList([])
  }, [comboList, itemList])

  const touchMove = e => {
    if (!isMobile) return
    const touch = e.targetTouches[0]
    const currTarget: any = document.elementFromPoint(Math.floor(touch.pageX), Math.floor(touch.pageY))
    if (currTarget.className === 'item') {
      if (!staticItem.current) {
        const col = currTarget.getAttribute('col')
        const row = currTarget.getAttribute('row')
        const value = currTarget.getAttribute('value')
        const color = currTarget.getAttribute('color')
        const key = currTarget.getAttribute('unique')
        staticItem.current = {
          col, row, value, key
        }
        const item = { color, key }
        mouseEnter({ row, col, item })
      }
    } else {
      staticItem.current = null
    }
    doSetMousePosition(e)
  }

  return (
    <div
      className="dual-match-3-wrapper"
      ref={wrapperRef}
      onMouseUp={mouseUp}
      onMouseMove={wrapperMouseMove}
      onTouchMove={touchMove}
      onTouchEnd={mouseUp}
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
              className={getItemClass(row, col, comboList, item)}
              key={item.key}
              style={itemStyle({ row, col, item })}
              // @ts-ignore
              row={row}
              col={col}
              color={item.color}
              value={item.value}
              unique={item.key}
              onMouseDown={(e) => {
                if (isMobile) return
                setDraging(true)
                doSetMousePosition(e)
                setComboList(() => [{ row, col, key: item.key }])
                setLineColor(item.color)
              }}
              onTouchStart={(e) => {
                if (!isMobile) return
                setDraging(true)
                doSetMousePosition(e)
                setComboList(() => [{ row, col, key: item.key }])
                setLineColor(item.color)
                e.preventDefault()
              }}
              onMouseEnter={() => !isMobile && mouseEnter({ row, col, item })}
            >
              {item.value}
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default Utils.connect({
  component: DualMatch3,
  mapStateToProps: (state) => ({
    isMobile: state.common.isMobile,
  }),
})
