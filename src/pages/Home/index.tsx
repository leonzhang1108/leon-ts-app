
import * as React from 'react'
import './index.less'
import * as ReactDOM from 'react-dom'
import 'tracking'
import 'tracking/build/data/face-min.js'

const w = window as any
const navi = navigator as any
const tracking = w.tracking

interface IState {
  hasCamera: boolean
}

class Home extends React.Component<null, IState> {
  v
  task

  constructor(props) {
    super(props)
    this.state = {
      hasCamera: true
    }
  }

  userMedia = () => navigator.getUserMedia = navi.getUserMedia || navi.webkitGetUserMedia || navi.mozGetUserMedia || navi.msGetUserMedia || null

  startCamera = () => {
    if (this.userMedia()) {
      const constraints = {
        video: true,
        audio: false
      }
      navigator.getUserMedia(constraints, stream => {
        const v = ReactDOM.findDOMNode(this.v) as any
        const url = w.URL || w.webkitURL
        if (v) {
          v.src = url ? url.createObjectURL(stream) : stream
          v.play()
        }
      }, error => {
        console.log("ERROR")
        console.log(error)
      })
    } else {
      console.log("不支持")
    }
  }

  startDrawing = () => {
    if (this.userMedia()) {
      navigator.getUserMedia({
        video: true,
        audio: false
      }, stream => {
        this.doDrawing.apply(this)
      }, error => {
        this.setState({ hasCamera: false })
      })
    } else {
      this.setState({ hasCamera: false })
    }
    
  }

  doDrawing = () => {
    const canvas = document.getElementsByClassName('canvas')[0] as any
    const dom = ReactDOM.findDOMNode(this.v) as HTMLElement
    const height = dom.offsetHeight
    const width = dom.offsetWidth
    canvas.height = height
    canvas.width = width
    const context = canvas.getContext('2d')
    const { ObjectTracker } = tracking
    const tracker = new ObjectTracker("face")
    tracker.setInitialScale(4)
    tracker.setStepSize(1) 
    tracker.setEdgesDensity(0.1)
    this.task = tracking.track('#video', tracker, { camera: true })
    tracker.on('track', event => {
      context.clearRect(0, 0, canvas.width, canvas.height)
      event.data.forEach(rect => {
        context.strokeStyle = '#FF0000'
        context.strokeRect(rect.x, rect.y, rect.width, rect.height)
        context.font = '11px Helvetica'
        context.fillStyle = "#fff"
      })
    })
    this.task.run()
  }

  componentWillUnmount() {
    if (this.task && this.task.stop) {
      this.task.stop()
    }
  }

  componentDidMount() {
    this.startDrawing()
  }

  render() {
    const { hasCamera } = this.state

    return hasCamera 
      ? (
        <div className='home'>
          <canvas className="canvas"/>
          <video id='video' className='video' width="100%" height="100%" ref={el => this.v = el} autoPlay/>
        </div>
      ) : (
        <div className='empty'><span>没有摄像头</span></div>
      )

  }
}

export default Home
