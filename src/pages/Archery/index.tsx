import React, { useMemo } from 'react'
import Utils from '@utils'
import './index.less'

const getDeg = (num: number) => (num / 180) * Math.PI

const getPoint = (x: number, y: number, radius: number, deg: number) =>
  `${x + Math.cos(getDeg(deg)) * radius},${y + Math.sin(getDeg(deg)) * radius}`

const getPentacleList = (
  x: number,
  y: number,
  radius: number,
  rotate: number
) => {
  const resultList: string[] = [
    getPoint(x, y, radius, -90 + rotate),
    getPoint(x, y, radius, 54 + rotate),
    getPoint(x, y, radius, -162 + rotate),
    getPoint(x, y, radius, -18 + rotate),
    getPoint(x, y, radius, 126 + rotate),
  ]
  return resultList
}

const Archery = (props: any) => {
  const { w, h } = props

  const center = useMemo(() => {
    return {
      x: w / 2,
      y: h / 2,
    }
  }, [w, h])

  const pentacleList = useMemo(() => {
    const { x, y } = center
    return getPentacleList(x, y + 50, 30, 0)
  }, [center])

  const pentacle1 = useMemo(() => {
    const { x, y } = center
    return getPentacleList(x - 55, y - 10, 15, -5)
  }, [center])

  const pentacle2 = useMemo(() => {
    const { x, y } = center
    return getPentacleList(x - 20, y - 30, 15, -50)
  }, [center])

  const pentacle3 = useMemo(() => {
    const { x, y } = center
    return getPentacleList(x + 20, y - 30, 15, 50)
  }, [center])

  const pentacle4 = useMemo(() => {
    const { x, y } = center
    return getPentacleList(x + 55, y - 10, 15, 5)
  }, [center])

  return (
    <div className="archery-wrapper">
      <div className="arrow" />
      <div className="top" />
      <svg
        xmlns="http://www.w3.org/2000/svg"
        version="1.1"
        width={w}
        height={h}
      >
        <polygon points={pentacleList.join(' ')} fill="#FEF35F" />
        <polygon points={pentacle1.join(' ')} fill="#FEF35F" />
        <polygon points={pentacle2.join(' ')} fill="#FEF35F" />
        <polygon points={pentacle3.join(' ')} fill="#FEF35F" />
        <polygon points={pentacle4.join(' ')} fill="#FEF35F" />
      </svg>
    </div>
  )
}

export default Utils.connect({
  component: Archery,
  mapStateToProps: (state) => ({
    w: state.common.contentWidth,
    h: state.common.contentHeight,
  }),
})
