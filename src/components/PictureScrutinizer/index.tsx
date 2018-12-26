import * as React from 'react'
import './index.less'
import SVGLabelEditor from '@components/SVGLabelEditor'

interface IProps {
  wrapperHeight: number,
  wrapperWidth: number,
  src: string
}
interface IStates {
  times: number,
  currentTimes: number,
  top: number | null,
  left: number | null,
  lastX: number,
  lastY: number
}

class PictureScrutinizer extends React.Component<IProps, IStates> {

  img
  clicked = false
  isSVGDragging = false
  lastMouseX: number | null = null
  lastMouseY: number | null = null
  movedX: number | null = null
  movedY: number | null = null
  wrapper
  canvas
  ctx

  componentWillMount () {
    this.setState({
      times: 1,
      currentTimes: 1,
      top: null,
      left: null,
      lastX: 0,
      lastY: 0
    })
  }

  componentDidMount () {
    this.initCanvas()
  }

  componentWillReceiveProps () {
    this.initCanvas()
  }

  componentWillUnmount () {
    this.removeEvents()
  }

  initCanvas = () => {
    this.img = new Image()
    const { src } = this.props
    this.img.src = src
    this.img.onload = () => {
      this.canvas = document.querySelector('.picture-scrutinizer') as HTMLCanvasElement
      this.ctx = this.canvas.getContext('2d')
      const { wrapperWidth, wrapperHeight } = this.props
      this.canvas.width = wrapperWidth
      this.canvas.height = wrapperHeight
      this.draw()
      this.setEvents()
    }
  }

  zoom = scale => {
    const factor = Math.pow(1.1, scale)
    const { times, currentTimes } = this.state
    this.setState({
      times: times * factor,
      currentTimes: currentTimes * factor
    }, this.draw)
  }

  setEvents = () => {
    this.wrapper.addEventListener('wheel', this.onMouseWheel, { passive: false })
    this.wrapper.addEventListener('mousedown', this.onMouseDown)
    this.wrapper.addEventListener('mousemove', this.onMouseMove)
    document.addEventListener('mouseup', this.onMouseUp)
  }

  removeEvents = () => {
    this.wrapper.removeEventListener('wheel', this.onMouseWheel)
    this.wrapper.removeEventListener('mousedown', this.onMouseDown)
    this.wrapper.removeEventListener('mousemove', this.onMouseMove)
    document.removeEventListener('mouseup', this.onMouseUp)
  }

  onMouseWheel = e => {
    this.lastMouseX && this.lastMouseY && this.zoom(e.wheelDelta / 300)
    e.preventDefault()
  }

  onMouseDown = e => {
    const { offsetX, offsetY } = e
    this.clicked = true
    this.movedX = offsetX
    this.movedY = offsetY
    this.resetTopLeft()
  }

  onMouseMove = e => {
    const { offsetX, offsetY } = e
    const { currentTimes } = this.state
    this.lastMouseX = offsetX
    this.lastMouseY = offsetY
    currentTimes !== 1 && this.setState({ currentTimes: 1 })
    this.clicked ? this.drag(e) : this.resetTopLeft()
  }

  onMouseUp = () => {
    this.clicked = false
    this.movedX = null
    this.movedY = null
    this.isSVGDragging = false
    this.resetTopLeft()
  }

  resetTopLeft = () => {
    const { left, top, lastX, lastY } = this.state
    if (lastX !== left || lastY !== top) {
      this.setState({
        left: lastX,
        top: lastY
      })
    }
  }

  drag = e => {
    if (['circle', 'line', 'polygon'].indexOf(e.target.tagName) >= 0 || this.isSVGDragging) {
      this.isSVGDragging = true
      return
    }
    const { offsetX, offsetY } = e
    const { top: sTop, left: sLeft } = this.state
    const left = sLeft + offsetX - (this.movedX || 0)
    const top = sTop + offsetY - (this.movedY || 0)
    this.draw(left, top)
  }

  draw = (left?, top?) => {
    const { wrapperWidth, wrapperHeight } = this.props
    const { top: sTop, left: sLeft, currentTimes, times } = this.state
    const { width, height } = this.calculate(this.img, this.props)

    if (undefined === left || undefined === top) {
      if (sTop !== null && sLeft !== null) {
        left = sLeft || 0
        top = sTop || 0
      } else {
        left = (wrapperWidth - width) / 2
        top = (wrapperHeight - height) / 2
      }
    }
    left = left + ((this.lastMouseX || 0) - left) * (1 - currentTimes)
    top = top + ((this.lastMouseY || 0) - top) * (1 - currentTimes)

    this.setState({
      lastX: left,
      lastY: top
    })

    this.ctx.clearRect(0, 0, wrapperWidth, wrapperHeight)
    this.ctx.drawImage(this.img, left, top, width * times, height * times)
  }

  calculate = ({ height: imgHeight, width: imgWidth }, { wrapperHeight: height, wrapperWidth: width }) => {
    const ratio = imgHeight / imgWidth - height / width
    const imgRatio = imgHeight / imgWidth
    const zoomImg = {
      height: 0,
      width: 0
    }
    if (ratio > 0) {
      zoomImg.height = height
      zoomImg.width = zoomImg.height / imgRatio
    } else {
      zoomImg.width = width
      zoomImg.height = zoomImg.width * imgRatio
    }
    return zoomImg
  }

  render () {
    const { times, top, left, lastX, lastY } = this.state
    return (
      <div ref={el => this.wrapper = el} >
        <SVGLabelEditor
          times={times}
          top={top}
          left={left}
          lastX={lastX}
          lastY={lastY}
        />
        <canvas className='picture-scrutinizer' />
      </div>
    )
  }
}

export default PictureScrutinizer
