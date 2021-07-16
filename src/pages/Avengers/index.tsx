import React, { useMemo, useState, useCallback } from 'react'
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

const colors = ['#55bee6', '#2d3542', '#326018', '#7A8592', '#3F004F', '#000']

const randomNum = (min, max) => parseInt(Math.random()*(max - min + 1) + min, 10)

const IronMan = () => (
  <div className="iron-man-wrapper">
    {[0, 0, 0].map((item, index) => (
      <div className={`iron-man clip-${index + 1}`} key={index}>
        <div className="inner-circle">
          <div className="white-circle"></div>
          <div className="center-triangle-4"></div>
          <div className="center-triangle-3"></div>
          <div className="center-triangle-2"></div>
          <div className="center-triangle"></div>
        </div>
      </div>
    ))}
  </div>
)

const CaptainAmerica = () => {
  const size = 70
  const points = getPentacleList(size, size, size - 20, 0)
  const outerPoints = getPentacleList(size, size, size, 0)
  return (
    <div className="captain-america-wrapper">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        version="1.1"
        width={size * 2}
        height={size * 2}
      >
        <polygon
          points={outerPoints.join(' ')}
          fill="#2D3542"
          stroke="#2D3542"
        />
        <polygon points={points.join(' ')} fill="#fff" stroke="#fff" />
      </svg>
      <div className="line-1" />
      <div className="line-2">
        <div className="inner" />
      </div>
      <div className="line-3">
        <div className="inner" />
      </div>
    </div>
  )
}

const Hulk = () => {
  return (
    <div className="hulk-wrapper">
      <div className="core-circle" />
      <div className="leaf leaf-1" />
      <div className="leaf leaf-2" />
      <div className="leaf leaf-3" />
    </div>
  )
}

const Thor = () => {
  return (
    <div className="thor-wrapper">
      <div className="top"></div>
      <div className="bottom"></div>
      <div className="needle"></div>
      <div className="wing-left"></div>
      <div className="mouth-left"></div>
      <div className="wing-left-top-1"></div>
      <div className="wing-left-top-2"></div>
      <div className="wing-left-top-3"></div>
      <div className="wing-right"></div>
      <div className="mouth-right"></div>
      <div className="wing-right-top-1"></div>
      <div className="wing-right-top-2"></div>
      <div className="wing-right-top-3"></div>
    </div>
  )
}

const HawkEye = () => {
  return (
    <div className="hawk-eye-wrapper">
      <div className="inner-circle"></div>
      <div className="outer-circle"></div>
      <div className="vertical-line"></div>
      <div className="horizontal-line"></div>
    </div>
  )
}

const BlackWidow = () => {
  return (
    <div className="black-widow-wrapper" />
  )
}

const Cpts = [IronMan, CaptainAmerica, Hulk, Thor, HawkEye, BlackWidow]

const Avengers = () => {

  const [index, setIndex] = useState(randomNum(0, colors.length - 1))

  const Cpt = useMemo(() => {
    return Cpts[index]
  }, [index])

  const backgroundColor = useMemo(() => {
    return colors[index]
  }, [index])

  const onClick = useCallback(() => {
    let newIndex = randomNum(0, colors.length - 1)
    while (index === newIndex) {
      newIndex = randomNum(0, colors.length - 1)
    }
    setIndex(newIndex)
  }, [index])

  return (
    <div className="avengers-wrapper" style={{ backgroundColor }} onClick={onClick}>
      <Cpt />
    </div>
  )
}

export default Avengers
