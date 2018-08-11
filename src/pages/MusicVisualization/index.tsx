
import * as React from 'react'
import './index.less'
import tools from './tools'
import Visualizer from './visualizer'

interface IState {
  visualizer: Visualizer,
  width: number,
  height: number,
  src: any,
  pause: boolean
  volume: number,
  bars: number, 
  barColor: string[] | string
}

class MusicVisualization extends React.Component<null, IState> {

  canvas

  componentWillMount() {
    this.setState({
      src: './battle_heart_bgm.mp3',
      bars: 64,
      barColor: ['gold', 'black'],
      height: 300,
      width: 600,
      pause: false,
      volume: 0.3
    })
  }

  resize = () => {
    const { width, height } = this.state
    const canvas = this.canvas
    canvas.width = width
    canvas.height = height
  }

  play = () => {
    const { src } = this.state
    if (src instanceof Blob) {
      const fileReader = new FileReader()
      fileReader.onload = e => e && e.target && e.target.result && this.state.visualizer.play(e.target.result)
      fileReader.readAsArrayBuffer(src)
    } else if (typeof src === 'string') {
      this.state.visualizer.play(src)
    }
  }

  componentDidMount() {
    const ctx = this.canvas.getContext('2d')
    const { height, width, bars, barColor, volume } = this.state
    const param = { ctx, height, width, bars, barColor }
    this.setState({
      visualizer: new Visualizer({
        size: bars,
        draw: tools.draw(param),
        volume
      })
    }, this.play)
    this.resize()
  }

  componentDidUpdate(prevProps) {
    const {
      src: prevSrc,
      pause: prevPause,
      volume: prevVolume,
      height: prevHeight,
      width: prevWidth
    } = prevProps
    const { visualizer } = this.state
    const { src, pause, volume, height, width } = this.state
    if (prevSrc !== src) {
      this.play()
    }
    if (prevPause !== pause) {
      visualizer[pause ? 'pause' : 'resume']()
    }
    if (prevVolume !== volume) {
      visualizer.updateVolume(volume)
    }
    if (prevHeight !== height || prevWidth !== width) {
      this.resize()
    }
  }

  componentWillUnmount() {
    this.state.visualizer.stop()
  }

  render() {
    return (
      <div className="music-visualization">
        <canvas ref={ref => { this.canvas = ref }}/>
      </div>
    )
  }
}

export default MusicVisualization
