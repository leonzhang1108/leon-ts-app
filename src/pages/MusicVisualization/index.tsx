
import * as React from 'react'
import './index.less'
import Utils from '@utils'
import tools from './tools'
import Visualizer from './visualizer'
import VolumnBar from './volumn-bar'
import TimeBar from './time-bar'
import FileLoading from './file-loading'

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
  slideDuration: number | null,
  loadingFail: boolean
}

interface IProps {
  isMobile: boolean,
  h: number
}

class MusicVisualization extends React.Component<IProps, IState> {

  canvas

  mounted: boolean

  componentWillMount () {
    document.addEventListener('visibilitychange', this.visibilityChange)
    this.setState({
      src: 'https://d28julafmv4ekl.cloudfront.net/64%2F30%2F211549645_S64.mp3?response-content-type=audio%2Fmpeg&Expires=1534259413&Signature=j0pKh8V7hL6ZPRpX~Bz5sDLfQHNb3RoCThMi3oYscbApTIY4Nud~W-3L5KGF5fvYg1~h0HULu69e9gVTHGEzRdJakzJ4do3zBQCFjNJknxso9gYhBRUBRM~Zzk4j7V-~AUpAoXgUujgzuAIQoxUJw0Y203c1Rq66CCwywRtnwXE_&Key-Pair-Id=APKAJVZTZLZ7I5XDXGUQ',
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
      slideDuration: null,
      loadingFail: false
    })
    this.mounted = true
  }

  visibilityChange = () => {
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
      // const fileReader = new FileReader()
      // fileReader.onload = e => {
      //   console.log(e)
      //   e && e.target && e.target.result && this.state.visualizer.play(e.target.result)
      // }
      // fileReader.readAsArrayBuffer(src)
    } else if (typeof src === 'string') {
      this.state.visualizer.play({ src, cb: this.afterLoading, progressCb: this.progress })
    }
  }

  progress = v => {
    if (!this.mounted) { return }
    if (isNaN(v)) {
      this.setState({ percent: 0, loadingFail: true })
    } else {
      this.setState({ percent: v })
    }
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
    if (!this.mounted) { return }
    this.setState({ currentTime, totalTime })
  }

  componentWillUnmount () {
    this.state.visualizer.stop()
    document.removeEventListener('visibilitychange', this.visibilityChange)
    this.mounted = false
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

  formatPercent = percent => {
    return percent === 100
      ? 'decoding'
      : this.state.loadingFail
        ? 'loading fail'
        : `${percent.toFixed(1)}%`
  }

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
    const { pause, loading, percent, durationOffset, slideDuration, currentTime, totalTime, loadingFail } = this.state
    const curr = totalTime ? parseInt(((currentTime % totalTime) / totalTime * 100).toFixed(0), 10) : 0

    return (
      <div className={`music-visualization ${loading ? 'loading' : 'loaded'}`}>
        <canvas ref={ref => { this.canvas = ref }} />
        {
          !loading ? (
            <VolumnBar
              pause={pause}
              togglePause={this.togglePause}
              changeVolumn={this.changeVolumn}
            />
          ) : ''
        }
        {
          !loading ? (
            <TimeBar
              curr={curr}
              totalTime={totalTime}
              formatTime={this.formatTime}
              slideDuration={slideDuration}
              durationOffset={durationOffset}
              durationChanged={this.durationChanged}
              durationChanging={this.durationChanging}
            />
          ) : ''
        }
        {
          loading ? (
            <FileLoading
              percent={percent}
              formatPercent={this.formatPercent}
              loadingFail={loadingFail}
            />
          ) : ''
        }
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
