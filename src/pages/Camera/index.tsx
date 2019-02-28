
import Utils from '@utils'
import * as React from 'react'
import 'tracking'
import 'tracking/build/data/face-min.js'
import './index.less'

const w = window as any
const navi = navigator as any
const tracking = w.tracking

interface IState {
  hasCamera: boolean,
  x: number,
  y: number,
  height: number,
  width: number,
  index: number
}

class Camera extends React.Component<null, IState> {
  v
  task

  frame = ['threat', 'big threat', 'machine', 'analog', 'gov', 'president']

  constructor (props) {
    super(props)
    this.state = {
      hasCamera: true,
      x: 0,
      y: 0,
      height: 150,
      width: 150,
      index: Utils.random(0, 5)
    }
  }

  userMedia = () => navigator.getUserMedia = navi.getUserMedia || navi.webkitGetUserMedia || navi.mozGetUserMedia || navi.msGetUserMedia || null

  startDrawing = () => {
    if (this.userMedia()) {
      navigator.getUserMedia({
        video: true,
        audio: false
      }, stream => {
        this.doDrawing.apply(this)
      }, error => {
        this.setState({ hasCamera: false })
        console.log(error)
      })
    } else {
      this.setState({ hasCamera: false })
    }
  }

  doDrawing = () => {
    const { ObjectTracker } = tracking
    const tracker = new ObjectTracker('face')
    tracker.setInitialScale(4)
    tracker.setStepSize(1)
    tracker.setEdgesDensity(0.1)
    this.task = tracking.track('#video', tracker, { camera: true })
    tracker.on('track', event => {
      event.data.forEach(rect => {
        const { x, y, width, height } = rect
        this.setState({ x, y, width, height })
      })
    })
    this.task.run()
  }

  componentWillUnmount () {
    if (this.task && this.task.stop) {
      this.task.stop()
    }
  }

  componentDidMount () {
    this.startDrawing()
  }

  render () {
    const { hasCamera, x, y, height, width, index } = this.state

    return hasCamera
      ? (
        <div className='home'>
          <div className='frame-wrapper' style={{ transform: `translate3d( ${x}px, ${y}px, 0)` }}>
            <div className={`frame ${this.frame[index]}`} style={{ height: `${height}px`, width: `${width}px` }}>
              <div className='top-left corner'/>
              <div className='top-right corner'/>
              <div className='bottom-right corner'/>
              <div className='bottom-left corner'/>
              <div className='top line'/>
              <div className='left line'/>
              <div className='right line'/>
              <div className='bottom line'/>
            </div>
          </div>
          <video id='video' className='video' width='100%' height='100%' ref={el => this.v = el} autoPlay={true}/>
        </div>
      ) : (
        <div className='empty'><span>no camera</span></div>
      )
  }
}

export default Camera
