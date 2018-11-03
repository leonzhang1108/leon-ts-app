import * as React from 'react'
import './index.less'

interface IProps {
  wrapperHeight: number,
  wrapperWidth: number,
  src: string
}

class PictureScrutinizer extends React.Component<IProps> {

  img
  clicked = false
  times = 1
  currentTimes = 1
  lastX = 0
  lastY = 0
  lastMouseX: number | null = null
  lastMouseY: number | null = null
  left: number | null = null
  top: number | null = null
  movedX: number | null = null
  movedY: number | null = null
  canvas
  ctx

  componentDidMount () {
    this.initCanvas()
  }

  componentWillReceiveProps () {
    this.initCanvas()
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
    this.times *= factor
    this.currentTimes *= factor
    this.draw()
  }

  setEvents = () => {
    this.canvas.onwheel = e => {
      this.lastMouseX && this.lastMouseY && this.zoom(e.wheelDelta / 300)
      e.preventDefault()
    }
    this.canvas.onmousedown = e => {
      const { offsetX, offsetY } = e
      this.clicked = true
      this.movedX = offsetX
      this.movedY = offsetY
      this.resetTopLeft()
    }
    this.canvas.onmousemove = e => {
      const { offsetX, offsetY } = e
      this.lastMouseX = offsetX
      this.lastMouseY = offsetY
      this.currentTimes = 1
      this.clicked ? this.drag(e) : this.resetTopLeft()
    }
    document.onmouseup = () => {
      this.clicked = false
      this.movedX = null
      this.movedY = null
      this.resetTopLeft()
    }
  }

  resetTopLeft = () => {
    this.left = this.lastX
    this.top = this.lastY
  }

  drag = e => {
    const { offsetX, offsetY } = e
    const left = this.left + offsetX - (this.movedX || 0)
    const top = this.top + offsetY - (this.movedY || 0)
    this.draw(left, top)
  }

  draw = (left?, top?) => {
    const { wrapperWidth, wrapperHeight } = this.props
    const { width, height } = this.calculate(this.img, this.props)

    if (!left || !top) {
      if (this.left && this.top) {
        left = this.left || 0
        top = this.top || 0
      } else {
        left = (wrapperWidth - width) / 2
        top = (wrapperHeight - height) / 2
      }
    }

    this.lastX = left = left + ((this.lastMouseX || 0) - left) * (1 - this.currentTimes)
    this.lastY = top = top + ((this.lastMouseY || 0) - top) * (1 - this.currentTimes)
    this.ctx.clearRect(0, 0, wrapperWidth, wrapperHeight)
    this.ctx.drawImage(this.img, left, top, width * this.times, height * this.times)
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
    return (
      <canvas className='picture-scrutinizer' />
    )
  }
}

export default PictureScrutinizer
