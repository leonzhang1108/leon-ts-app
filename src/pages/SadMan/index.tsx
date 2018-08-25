import * as React from 'react'
import './index.less'
import SadMan from './sadman'
import Utils from '@utils'

interface IProps {
  h: number,
  w: number
}

class SadManPage extends React.Component<IProps> {
  canvas
  ctx
  tick = 0
  sadman

  componentDidMount () {
    this.initCanvas()
    this.loop()
  }

  loop = () => this.draw() && requestAnimationFrame(this.loop)

  initCanvas = () => {
    const { h, w } = this.props
    this.ctx = this.canvas.getContext('2d')
    this.sadman = new SadMan(this.ctx)
    this.canvas.width = w
    this.canvas.height = h
  }

  draw = () => {
    if (!this.canvas) { return false }
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    this.tick += 0.05
    this.sadman.draw(this.tick)
    return true
  }

  render () {
    return (
      <div className='sad-man-wrapper' >
        <canvas ref={el => this.canvas = el}/>
      </div>
    )
  }
}

export default Utils.connect({
  component: SadManPage,
  mapStateToProps: state => ({
    w: state.common.contentWidth,
    h: state.common.contentHeight
  })
})
