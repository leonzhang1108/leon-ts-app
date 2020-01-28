import { IFileReaderEvent } from '@interface'
import Utils from '@utils'
import * as React from 'react'
import FileLoading from './file-loading'
import FloatingTitle from './floating-title'
import './index.less'
import TimeBar from './time-bar'
import tools from './tools'
import Visualizer from './visualizer'
import VolumeBar from './volume-bar'

interface IState {
  visualizer?: Visualizer;
  width: number;
  height: number;
  src: any;
  pause: boolean;
  volume: number;
  bars: number;
  barColor: string[] | string;
  loading: boolean;
  percent: number;
  totalTime: number;
  currentTime: number;
  durationOffset: number;
  slideDuration: number | null;
  loadingFail: boolean;
  compatible: boolean;
  showAdd: boolean;
  musicName: string;
  mute: boolean;
}

interface IProps {
  isMobile: boolean;
  h: number;
}

declare global {
  interface Window {
    AudioContext: any;
  }
}

window.AudioContext = window.AudioContext || undefined

class MusicVisualizer extends React.Component<IProps, IState> {
  canvas

  input

  mounted: boolean

  constructor(props) {
    super(props)
    document.addEventListener('visibilitychange', this.visibilityChange)
    this.mounted = true
    this.state = {
      // src: 'https://golb-1256296192.cos.ap-shanghai.myqcloud.com/1.mp3',
      src: 'NoMusic',
      bars: 64,
      barColor: ['gold', 'aqua'],
      height: this.props.isMobile ? this.props.h * 0.5 : 400,
      width: this.props.isMobile ? 300 : 600,
      pause: false,
      volume: 0.77,
      loading: true,
      percent: 0,
      totalTime: 0,
      currentTime: 0,
      durationOffset: 0,
      slideDuration: null,
      loadingFail: false,
      compatible: !!window.AudioContext,
      showAdd: false,
      musicName: '',
      mute: false
    }
  }

  componentDidMount() {
    this.restartVisualizer()
  }

  componentWillUnmount() {
    this.state.visualizer!.stop()
    document.removeEventListener('visibilitychange', this.visibilityChange)
    this.mounted = false
  }

  visibilityChange = () => {
    const { visualizer } = this.state
    if (document.visibilityState === 'hidden') {
      visualizer!.pause()
      this.setState({ pause: true })
    } else {
      visualizer!.resume()
      this.setState({ pause: false })
    }
  }

  resize = () => {
    const { width, height } = this.state
    const canvas = this.canvas
    canvas.width = width
    canvas.height = height
  }

  play = (v?) => {
    const { src } = this.state
    if (v) {
      this.state.visualizer!.play(v)
    } else if (Utils.isString(src)) {
      this.state.visualizer!.play({
        src,
        cb: this.afterLoading,
        progressCb: this.progress
      })
    }
  }

  progress = v => {
    if (!this.mounted) {
      return
    }
    if (isNaN(v)) {
      this.setState({ percent: 0, loadingFail: true, showAdd: true })
    } else {
      this.setState({ percent: v, showAdd: true })
    }
  }

  afterLoading = () => {
    this.setState({ loading: false, showAdd: true }, () => {
      this.state.visualizer!.setCurrent(0)
    })
  }

  restartVisualizer = () => {
    if (!this.state.compatible) {
      return
    }
    const ctx = this.canvas.getContext('2d')
    const { height, width, bars, barColor, volume } = this.state
    const param = { ctx, height, width, bars, barColor }
    const { currentTime } = this
    this.setState(
      {
        visualizer: new Visualizer({
          size: bars,
          draw: tools.draw(param),
          volume,
          currentTime
        })
      },
      this.play
    )
    this.resize()
  }

  currentTime = ({ curr: currentTime, total: totalTime }) => {
    if (!this.mounted) {
      return
    }
    this.setState({ currentTime, totalTime })
  }

  changeVolume = v => {
    this.state.visualizer!.updateVolume(v / 100)
  }

  togglePause = () => {
    const { visualizer, pause } = this.state

    if (pause) {
      visualizer!.resume()
    } else {
      visualizer!.pause()
    }

    this.setState({ pause: !pause })
  }

  formatPercent = percent => {
    return percent === 100
      ? 'decoding'
      : this.state.loadingFail
        ? '↓'
        : `${percent.toFixed(1)}%`
  }

  formatTime = () => {
    const { currentTime, totalTime, durationOffset, slideDuration } = this.state
    const c = Utils.secondFormatToTime(
      totalTime
        ? ((currentTime % totalTime) +
            this.durationToSecond(slideDuration || durationOffset)) %
            totalTime
        : 0
    )
    const t = Utils.secondFormatToTime(totalTime)
    return `${c} / ${t}`
  }

  durationChanging = duration => {
    this.setState({ slideDuration: duration, currentTime: 0 })
  }

  durationChanged = duration => {
    this.setState(
      {
        slideDuration: null,
        durationOffset: duration,
        pause: false,
        currentTime: 0
      },
      () => {
        this.state.visualizer!.setCurrent(this.durationToSecond(duration))
        this.state.visualizer!.resume()
      }
    )
  }

  durationToSecond = duration =>
    parseInt(((duration / 100) * this.state.totalTime).toFixed(0), 10)

  fileChange = () => {
    if (!this.input.files[0]) {
      return
    }
    this.state.visualizer!.abort()
    this.setState({ showAdd: false, percent: 0 }, () => {
      const reader: any = new FileReader()
      const { name } = this.input.files[0]
      reader.readAsArrayBuffer(this.input.files[0])
      reader.onload = (res: IFileReaderEvent) => {
        this.play({
          src: res.currentTarget.result,
          cb: this.afterLoading,
          progressCb: this.progress
        })
        this.setState({
          loadingFail: false,
          loading: true,
          durationOffset: 0,
          musicName: name
        })
      }
    })
  }

  setMute = () => {
    const { mute } = this.state
    this.setState({ mute: !mute }, () => {
      const { mute: m, volume: v } = this.state
      this.changeVolume(m ? 0 : v * 100)
    })
  }

  render() {
    const {
      pause,
      loading,
      percent,
      durationOffset,
      slideDuration,
      currentTime,
      totalTime,
      loadingFail,
      compatible,
      showAdd,
      musicName,
      mute
    } = this.state

    if (!compatible) {
      return <div className="music-visualizer">not compatible</div>
    }

    const curr = totalTime
      ? parseInt((((currentTime % totalTime) / totalTime) * 100).toFixed(0), 10)
      : 0

    return (
      <div className={`music-visualizer ${loading ? 'loading' : 'loaded'}`}>
        <canvas
          ref={ref => {
            this.canvas = ref
          }}
        />
        <FloatingTitle musicName={musicName} />
        {!loading ? (
          <VolumeBar
            pause={pause}
            mute={mute}
            setMute={this.setMute}
            togglePause={this.togglePause}
            changeVolume={this.changeVolume}
          />
        ) : (
          ''
        )}
        {!loading ? (
          <TimeBar
            curr={curr}
            totalTime={totalTime}
            formatTime={this.formatTime}
            slideDuration={slideDuration}
            durationOffset={durationOffset}
            durationChanged={this.durationChanged}
            durationChanging={this.durationChanging}
          />
        ) : (
          ''
        )}
        {loading ? (
          <FileLoading
            percent={percent}
            formatPercent={this.formatPercent}
            loadingFail={loadingFail}
          />
        ) : (
          ''
        )}
        <a className={`upload ${!showAdd ? 'disappear' : ''}`}>
          <div className={`anticon anticon-ts-app icon-add`} />
          <input
            className="change"
            ref={ref => {
              this.input = ref
            }}
            type="file"
            accept="audio/mpeg"
            onChange={this.fileChange}
          />
        </a>
      </div>
    )
  }
}

export default Utils.connect({
  component: MusicVisualizer,
  mapStateToProps: state => ({
    isMobile: state.common.isMobile,
    h: state.common.contentHeight
  })
})
