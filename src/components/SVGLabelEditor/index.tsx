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

  state = {
    pointsList: [
      [
        {
          x: 100, y: 100
        }, {
          x: 150, y: 100
        }, {
          x: 150, y: 150
        }, {
          x: 100, y: 150
        }
      ]
    ],
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

  onMouseMove = (p, index, i) => {
    const { pointsList } = this.state
    const { times } = this.props
    const { x, y } = p
    const { x: x0, y: y0 } = pointsList[index][i]
    pointsList[index][i] = {
      x: x0 + x / times,
      y: y0 + y / times
    }

    this.setState({ pointsList })
  }

  render () {
    const { pointsList, r, strokeWidth } = this.state
    const radius = this.calclateTimes(r)
    const width = this.calclateTimes(strokeWidth)
    return (
      <svg className='svg-wrapper'>
      {
        pointsList.map((points, index) => points.map(({ x, y }, i) => {
          const { x: xn, y: yn } = i === points.length - 1 ? points[0] : points[i + 1]
          const { x: x1, y: y1 } = this.calculatePoint(x, y)
          const { x: x2, y: y2 } = this.calculatePoint(xn, yn)
          return (
            <React.Fragment key={i}>
              <line x1={x1} y1={y1} x2={x2} y2={y2} strokeWidth={width} {...baseLine}/>
              <DragHOC onMouseMove={Utils.handle(this.onMouseMove, index, i)}>
                <circle cx={x1} cy={y1} r={radius} {...baseCirlce} />
              </DragHOC>
            </React.Fragment>
          )
        }))
      }
      </svg>
    )
  }
}

export default SVGLabelEditor
