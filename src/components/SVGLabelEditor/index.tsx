import * as React from 'react'
import './index.less'
import { Point } from '@interface'
import DragHOC from './DragHOC'
import Utils from '@utils'

interface IProps {
  times: number,
  currentTimes: number,
  top: number | null,
  left: number | null,
  lastX: number,
  lastY: number
}

interface IStates {
  pointsList: Point[][],
  tempList: Point[]
  r: number,
  strokeWidth: number,
  oriTop: number | null,
  oriLeft: number | null
}

const baseCirlce = {
  fill: 'rgb(89, 249, 46)'
}

const baseLine = {
  stroke: 'rgb(211, 220, 230)'
}

const basePolygon = {
  fill: 'rgb(56, 120, 196, .5)'
}

class SVGLabelEditor extends React.Component<IProps, IStates> {

  static getDerivedStateFromProps (props, states) {
    const { left, top } = props
    const { oriLeft, oriTop } = states
    if (left !== null && top !== null && oriLeft === null && oriTop === null) {
      return {
        oriLeft: left,
        oriTop: top
      }
    }
    return null
  }

  clicked = false

  state = {
    pointsList: [] as Point[][],
    tempList: [] as Point[],
    r: 7,
    strokeWidth: 1.5,
    oriTop: null,
    oriLeft: null
  }

  calculatePoint = (x, y) => {
    const { lastX, lastY, times } = this.props
    return {
      x: x * times + lastX,
      y: y * times + lastY
    }
  }

  calclateTimes = v => v * this.props.times

  onMouseUp = i => {
    if (!this.clicked || i) return
    const { tempList, pointsList } = this.state
    pointsList.push(tempList)
    this.setState({
      tempList: [],
      pointsList
    })
  }

  onMouseMove = (i, p: Point) => {
    const { tempList } = this.state
    const { times } = this.props
    const { x, y } = p
    const { x: x0, y: y0 } = tempList[i]
    tempList[i] = {
      x: x0 + x / times,
      y: y0 + y / times
    }
    this.setState({ tempList })
  }

  wrapperMouseDown = e => {
    this.clicked = true
  }

  wrapperMouseMove = e => {
    this.clicked = false
  }

  wrapperMouseUp = e => {

    const { clientX, clientY, target } = e

    if (target.tagName !== 'svg' || !this.clicked) return

    const { left: offsetLeft, top: offsetTop } = target.getBoundingClientRect()
    const { tempList } = this.state
    const { times, left, top } = this.props

    const x = (clientX - (left || 0) - offsetLeft) / times
    const y = (clientY - (top || 0) - offsetTop) / times

    tempList.push({ x, y })

    this.setState({ tempList })
    this.clicked = false
  }

  convertPoints2String = points =>
    points.map(({ x, y }) => this.calculatePoint(x, y))
      .map(({ x, y }) => `${x},${y}`).join(' ')

  render () {
    const { pointsList, tempList, r, strokeWidth } = this.state
    const radius = this.calclateTimes(r)
    const width = this.calclateTimes(strokeWidth)
    return (
      <svg className='svg-wrapper'
        onMouseDown={this.wrapperMouseDown}
        onMouseMove={this.wrapperMouseMove}
        onMouseUp={this.wrapperMouseUp}
      >
      {
        tempList.map(({ x, y }: Point, i) => {
          const isLast = i === tempList.length - 1
          const { x: xn, y: yn } = isLast ? tempList[0] : tempList[i + 1]
          const { x: x1, y: y1 } = this.calculatePoint(x, y)
          const { x: x2, y: y2 } = this.calculatePoint(xn, yn)
          return (
            <React.Fragment key={i}>
              {!isLast ? <line x1={x1} y1={y1} x2={x2} y2={y2} strokeWidth={width} {...baseLine}/> : ''}
              <DragHOC
                onMouseMove={Utils.handle(this.onMouseMove, i)}
              >
                <circle cx={x1} cy={y1} r={radius} {...baseCirlce}
                  onMouseUp={Utils.handle(this.onMouseUp, i)}
                />
              </DragHOC>
            </React.Fragment>
          )
        })
      }
      {
        pointsList.map((points, i) => {
          return <polygon key={i} points={this.convertPoints2String(points)} {...basePolygon} />
        })
      }
      </svg>
    )
  }
}

export default SVGLabelEditor
