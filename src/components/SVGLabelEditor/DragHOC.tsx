import * as React from 'react'
import { Point } from '@interface'

interface IProps {
  children: React.ReactElement<any>,
  onMouseMove (v: Point): void
}

interface IStates {
  dragging: boolean,
  x: number,
  y: number
}

class DragHOC extends React.Component<IProps, IStates> {

  componentDidMount () {
    this.setState({
      dragging: false,
      x: 0,
      y: 0
    })
  }

  onMouseDown = e => {
    const { pageX, pageY } = e
    this.setState({
      dragging: true,
      x: pageX,
      y: pageY
    })
  }

  onMouseUp = () => {
    Object.assign(this.state, {
      dragging: false,
      x: 0,
      y: 0
    })
  }

  onMouseMove = e => {
    const { pageX, pageY } = e
    const {
      state: { dragging, x, y }
    } = this
    if (!dragging) {return}
    this.props.onMouseMove({
      x: pageX - x,
      y: pageY - y
    })
    Object.assign(this.state, {
      x: pageX,
      y: pageY
    })
  }

  render () {
    const { onMouseDown, onMouseMove, onMouseUp } = this

    window.addEventListener('mouseup', onMouseUp)
    window.addEventListener('mousemove', onMouseMove)
    return React.cloneElement(this.props.children, {
      onMouseDown
    })
  }
}

export default DragHOC
