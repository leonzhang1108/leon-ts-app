
import * as React from 'react'
import './index.less'
import Utils from '@utils'
import tools from './tools'
import Visualizer from './visualizer'
import { Slider, Progress } from 'antd'

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
  percent: number,
  totalTime: number,
  currentTime: number,
  durationOffset: number,
  slideDuration: number | null
}

interface IProps {
  isMobile: boolean,
  h: number
}

class MusicVisualization extends React.Component<IProps, IState> {

  canvas

  componentWillMount () {
    document.addEventListener('visibilitychange', this.visibilitychange)
    this.setState({
      src: 'https://m10.music.126.net/20180813191409/788556f52243825281036f6779e9558f/ymusic/fcc0/f5a9/dbb2/6572c024438329e20cfcdd9fb3bda993.mp3',
      bars: 64,
      barColor: ['gold', 'aqua'],
      height: this.props.isMobile ? this.props.h * .5 : 400,
      width: this.props.isMobile ? 300 : 600,
      pause: false,
      volume: 0.77,
      loading: true,
      percent: 0,
      totalTime: 0,
      currentTime: 0,
      durationOffset: 0,
      slideDuration: null
    })
  }

  visibilitychange = () => {
    const { visualizer } = this.state
    if (document.visibilityState === 'hidden') {
      visualizer.pause()
      this.setState({ pause: true })
    } else {
      visualizer.resume()
      this.setState({ pause: false })
    }
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
      this.state.visualizer.play({ src, cb: this.afterLoading, progressCb: this.progress })
    }
  }

  progress = v => {
    this.setState({ percent: v })
  }

  afterLoading = () => {
    this.setState({ loading: false }, () => {
      this.state.visualizer.setCurrent(0)
    })
  }

  componentDidMount () {
    this.restartVisualizer()
  }

  restartVisualizer = () => {
    const ctx = this.canvas.getContext('2d')
    const { height, width, bars, barColor, volume } = this.state
    const param = { ctx, height, width, bars, barColor }
    const { currentTime } = this
    this.setState({
      visualizer: new Visualizer({
        size: bars,
        draw: tools.draw(param),
        volume,
        currentTime
      })
    }, this.play)
    this.resize()
  }

  currentTime = ({ curr: currentTime, total: totalTime }) => {
    this.setState({ currentTime, totalTime })
  }

  componentWillUnmount () {
    this.state.visualizer.stop()
    document.removeEventListener('visibilitychange', this.visibilitychange)
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

  formatPercent = percent => percent === 100 ? 'decoding' : `${percent.toFixed(1)}%`

  formatTime = () => {
    const { currentTime, totalTime, durationOffset, slideDuration } = this.state
    const c = Utils.secondFormatToTime(
      totalTime
        ? ((currentTime % totalTime + this.durationToSecond(slideDuration || durationOffset)) % totalTime)
        : 0
    )
    const t = Utils.secondFormatToTime(totalTime)
    return `${c} / ${t}`
  }

  durationChanging = duration => {
    this.setState({ slideDuration: duration, currentTime: 0 })
  }

  durationChanged = duration => {
    this.setState({ slideDuration: null, durationOffset: duration, pause: false, currentTime: 0 }, () => {
      this.state.visualizer.setCurrent(this.durationToSecond(duration))
      this.state.visualizer.resume()
    })
  }

  durationToSecond = duration => parseInt((duration / 100 * this.state.totalTime).toFixed(0), 10)

  render () {
    const { pause, loading, percent, durationOffset, slideDuration, currentTime, totalTime } = this.state
    const curr = totalTime ? parseInt(((currentTime % totalTime) / totalTime * 100).toFixed(0), 10) : 0

    return (
      <div className={`music-visualization ${loading ? 'loading' : 'loaded'}`}>
        <canvas ref={ref => { this.canvas = ref }} />
        <div className='volumn-zone'>
          <div className='icon anticon anticon-ts-app icon-volumn' />
          <Slider className='slider' defaultValue={77} onChange={this.changeVolumn} tipFormatter={null} />
          <div onClick={this.togglePause} className={`icon anticon anticon-ts-app icon-${pause ? 'play' : 'pause'}`} />
        </div>
        <div className='time-zone'>
          <Slider className='duration-slider'
            value={totalTime ? (parseInt((slideDuration || durationOffset) + '', 10) + curr) % 100 : 0}
            onChange={this.durationChanging}
            onAfterChange={this.durationChanged}
            tipFormatter={null}
          />
          <div>{this.formatTime()}</div>
        </div>
        <div className='loading-mask'>
          <Progress type='circle' percent={percent} format={this.formatPercent} />
        </div>
      </div>
    )
  }
}

export default Utils.connect({
  component: MusicVisualization,
  mapStateToProps: state => ({
    isMobile: state.common.isMobile,
    h: state.common.contentHeight
  })
})
