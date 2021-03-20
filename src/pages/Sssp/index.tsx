import React, { useMemo } from 'react'
import Utils from '@utils'
import './index.less'

const getDeg = (num: number) => num / 180 * Math.PI

const getPoint = (x: number, y: number, radius: number, deg: number) =>
  `${x + Math.cos(getDeg(deg)) * radius},${y + Math.sin(getDeg(deg)) * radius}`

const getPentacleList = (x: number, y: number, radius: number, rotate: number) => {
  const resultList: string[] = [
    getPoint(x, y, radius, -90 + rotate),
    getPoint(x, y, radius, 54 + rotate),
    getPoint(x, y, radius, -162 + rotate),
    getPoint(x, y, radius, -18 + rotate),
    getPoint(x, y, radius, 126 + rotate),
  ]
  return resultList
}

const getTailList = (x: number, y: number, size: number, isMobile: boolean) => {

  const getList1 = v => [
    v,
    v + 160 * size,
    v + 220 * size,
    v + 400 * size,
    v + 350 * size,
    v + 400 * size,
    v + 220 * size,
    v + 160 * size
  ]

  const getList2 = v => [
    v,
    v + 20 * size,
    v + 80 * size,
    v + 100 * size,
    v,
    v - 100 * size,
    v - 80 * size,
    v - 20 * size
  ]

  const xList = isMobile ? getList2(x) : getList1(x)
  const yList = isMobile ? getList1(y)  : getList2(y)

  return xList.map((_, i) => {
    return `${xList[i]},${yList[i]}`
  })
}


const SSSP = (props: any) => {
  const { w, h, isMobile } = props

  const center = useMemo(() => {
    return {
      x: w / 2 - (isMobile ? 0 : 100),
      y: h / 2 - (isMobile ? 80 : 0)
    }
  }, [w, h, isMobile])

  // 五角星
  const pentacleList = useMemo(() => {
    const { x, y } = center
    return getPentacleList(x, y, !isMobile ? 100 : 60, isMobile ? 0 : -90)
  }, [center, isMobile])

  // 五角星 border
  const pentacleBorderList = useMemo(() => {
    const { x, y } = center
    return getPentacleList(x, y, !isMobile ? 100 : 60, isMobile ? 0 : -90)
  }, [center, isMobile])

  // 尾巴
  const tailList = useMemo(() => {
    const { x, y } = center
    return getTailList(x, y, isMobile ? 0.5 : 1, isMobile)
  }, [center, isMobile])

  // 尾巴 border
  const tailBorderList = useMemo(() => {
    const { x, y } = center
    return getTailList(x, y, isMobile ? 0.5 : 1, isMobile)
  }, [center, isMobile])

  return (
    <div className="sssp-wrapper">   
      <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width={w} height={h}>
        {/* pentacle wrapper */}
        <polygon points={pentacleBorderList.join(' ')} fill="black" stroke="black" strokeWidth={isMobile ? 25 : 35} strokeLinejoin="round">
          <animateTransform attributeName="transform" begin="0s" dur="20s" type="rotate" from={`0 ${center?.x} ${center?.y}`} to={`360 ${center?.x} ${center?.y}`} repeatCount="indefinite"/>
        </polygon>
        {/* tail wrapper */}
        <polygon points={tailBorderList.join(' ')} fill="black" stroke="black" strokeWidth={isMobile ? 25 : 35} strokeLinejoin="round" />
        {/* pentacle border */}
        <polygon points={pentacleBorderList.join(' ')} fill="white" stroke="white" strokeWidth={isMobile ? 20 : 30} strokeLinejoin="round">
          <animateTransform attributeName="transform" begin="0s" dur="20s" type="rotate" from={`0 ${center?.x} ${center?.y}`} to={`360 ${center?.x} ${center?.y}`} repeatCount="indefinite"/>
        </polygon>
        {/* tail border */}
        <polygon points={tailBorderList.join(' ')} fill="white" stroke="white" strokeWidth={isMobile ? 20 : 30} strokeLinejoin="round" />
        {/* pentacle */}
        <polygon points={pentacleList.join(' ')} fill="white" stroke="#262F63" strokeWidth={isMobile ? 5 : 10} strokeLinejoin="round" >
          <animateTransform attributeName="transform" begin="0s" dur="20s" type="rotate" from={`0 ${center?.x} ${center?.y}`} to={`360 ${center?.x} ${center?.y}`} repeatCount="indefinite"/>
        </polygon>
        {/* tail */}
        <polygon points={tailList.join(' ')} fill="white" stroke="#AC3632" strokeWidth={isMobile ? 5 : 10} strokeLinejoin="round" />
      </svg>
    </div>
  )
}

export default Utils.connect({
  component: SSSP,
  mapStateToProps: state => ({
    w: state.common.contentWidth,
    h: state.common.contentHeight,
    isMobile: state.common.isMobile
  })
})
