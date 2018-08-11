
import * as React from 'react'
import './index.less'
import Utils from '@utils'
import tools from './tools'
import Visualizer from './visualizer'
import { Slider } from 'antd'
import { Progress } from 'antd'

interface IState {
  visualizer: Visualizer,
  width: number,
  height: number,
  src: any,
  pause: boolean
  volume: number,
  bars: number, 
  barColor: string[] | string,
  loading: boolean,
  percent: number
}

interface IProps {
  isMobile: boolean
}

class MusicVisualization extends React.Component<IProps, IState> {

  canvas

  componentWillMount() {
    this.setState({
      src: './battle_heart_bgm.mp3',
      bars: 64,
      barColor: ['gold', 'aqua'],
      height: 400,
      width: this.props.isMobile ? 300 : 600,
      pause: false,
      volume: 0.3,
      loading: true,
      percent: 0
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
      this.state.visualizer.play({src, cb: this.afterLoading, progressCb: this.progress})
    }
  }

  progress = v => {
    this.setState({ percent: v })
  }

  afterLoading = () => {
    this.setState({ loading: false})
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

  componentWillUnmount() {
    this.state.visualizer.stop()
  }

  changeVolumn = v => {
    this.state.visualizer.updateVolume(v / 100)
  }

  togglePause = () => {
    const { visualizer, pause } = this.state

    if (pause) {
      visualizer.resume()
    } else {
      visualizer.pause()
    }

    this.setState({ pause: !pause })
  }

  formatPercent = percent => `${percent.toFixed(1)}%`

  render() {
    const { pause, loading, percent } = this.state

    return (
      <div className={`music-visualization ${loading ? 'loading' : 'loaded'}`}>
        <canvas ref={ref => { this.canvas = ref }}/>
        <div className='control-zone'>
          <div className='icon anticon anticon-ts-app icon-volumn'/>
          <Slider className='slider' defaultValue={30} onChange={this.changeVolumn}/>
          <div onClick={this.togglePause} className={`icon anticon anticon-ts-app icon-${pause ? 'play' : 'pause'}`}/>
        </div>
        <div className='loading-mask'>
          <Progress type="circle" percent={percent} format={this.formatPercent}/>
        </div>
      </div>
    )
  }
}

export default Utils.connect({
  component: MusicVisualization,
  mapStateToProps: state => ({
    isMobile: state.common.isMobile
  })
})