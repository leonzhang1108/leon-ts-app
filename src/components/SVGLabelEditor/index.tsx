import { Point } from '@interface'
import Utils from '@utils'
import * as React from 'react'
import DragHOC from './DragHOC'
import './index.less'

interface IProps {
  times: number,
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
  fill: 'rgb(89, 249, 46)',
  cursor: 'move'
}

const baseLine = {
  stroke: 'rgb(211, 220, 230)'
}

const basePolygon = {
  fill: 'rgb(56, 120, 196, .5)',
  cursor: 'move'
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
  wrapper

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
    if (!this.clicked || i) { return }
    const { tempList, pointsList } = this.state
    pointsList.push(tempList)
    this.setState({
      tempList: [],
      pointsList
    })
  }

  onMouseMove = (i, p: Point) => {
    const { tempList } = this.state
    tempList[i] = this.resetPoint(tempList[i], p)
    this.setState({ tempList })
  }

  onPolygonPointMouseMove = (i, index, p: Point) => {
    const { pointsList } = this.state
    pointsList[i][index] = this.resetPoint(pointsList[i][index], p)
    this.setState({ pointsList })
  }

  onPolygonMouseMove = (i, p: Point) => {
    const { pointsList } = this.state
    pointsList[i] = pointsList[i].map(point => this.resetPoint(point, p))
    this.setState({ pointsList })
  }

  resetPoint = ({ x: x0, y: y0 }, { x, y }) => ({
    x: x0 + x / this.props.times,
    y: y0 + y / this.props.times
  })

  wrapperMouseDown = e => {
    this.clicked = true
  }

  wrapperMouseMove = e => {
    this.clicked = false
  }

  wrapperMouseUp = e => {
    const { target } = e
    if (target.tagName !== 'svg' || !this.clicked) { return }
    const { tempList } = this.state
    tempList.push(this.addPoint(e))
    this.setState({ tempList })
    this.clicked = false
  }

  onPoligonLineClick = (i, index, e) => {
    const { pointsList } = this.state
    index = index === pointsList[i].length - 1 ? 0 : index + 1
    pointsList[i].splice(index, 0, this.addPoint(e))
    this.setState({ pointsList })
  }

  addPoint = e => {
    const { clientX, clientY } = e
    const { left: offsetLeft, top: offsetTop } = this.wrapper.getBoundingClientRect()
    const { times, left, top } = this.props
    const x = (clientX - (left || 0) - offsetLeft) / times
    const y = (clientY - (top || 0) - offsetTop) / times
    return { x, y }
  }

  convertPoints2String = points =>
    points.map(({ x, y }) => this.calculatePoint(x, y))
      .map(({ x, y }) => `${x},${y}`).join(' ')

  renderTemp = ({ tempList, width, radius }) => tempList.map(({ x, y }: Point, i) => {
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

  renderPolygon = ({ pointsList, width, radius }) => pointsList.map((points, i) => (
    <React.Fragment key={i}>
      <DragHOC
        onMouseMove={Utils.handle(this.onPolygonMouseMove, i)}
      >
        <polygon points={this.convertPoints2String(points)} {...basePolygon}/>
      </DragHOC>
      {
        this.renderPolygonWrapper({ points, i, width, radius })
      }
    </React.Fragment>
  ))

  renderPolygonWrapper = ({ points, width, radius, i }) =>
    points.map(({ x, y }) => this.calculatePoint(x, y))
      .map(({ x, y }, index) => {
        const isLast = index === points.length - 1
        const { x: xn, y: yn } = isLast ? points[0] : points[index + 1]
        const { x: x2, y: y2 } = this.calculatePoint(xn, yn)
        return (
          <React.Fragment key={index}>
            <line x1={x} y1={y} x2={x2} y2={y2} strokeWidth={width} {...baseLine}
              onClick={Utils.handle(this.onPoligonLineClick, i, index)}
            />
            <DragHOC
              onMouseMove={Utils.handle(this.onPolygonPointMouseMove, i, index)}
            >
              <circle cx={x} cy={y} r={radius} {...baseCirlce} />
            </DragHOC>
          </React.Fragment>
        )
      })

  render () {
    const { pointsList, tempList, r, strokeWidth } = this.state
    const radius = this.calclateTimes(r)
    const width = this.calclateTimes(strokeWidth)
    return (
      <svg className='svg-wrapper'
        ref={el => this.wrapper = el}
        onMouseDown={this.wrapperMouseDown}
        onMouseMove={this.wrapperMouseMove}
        onMouseUp={this.wrapperMouseUp}
      >
      { this.renderTemp({ tempList, width, radius }) }
      { this.renderPolygon({ pointsList, width, radius }) }
      </svg>
    )
  }
}

export default SVGLabelEditor
