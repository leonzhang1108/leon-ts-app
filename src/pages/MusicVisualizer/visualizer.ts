import Axios from 'axios'

export default class Visualizer {
  source
  count
  ac
  draw
  size
  gainNode
  analyser
  rafId
  volume
  buffer
  currentTime
  curr
  total
  interval
  axiosModel
  axiosCancellation

  constructor ({ draw, size, volume, currentTime }) {
    this.source = null
    this.count = 0
    this.draw = draw
    this.size = size
    this.volume = volume
    this.currentTime = currentTime
    this.initAC()
  }

  initAC = () => {
    this.ac = new AudioContext()
    this.gainNode = this.ac.createGain()
    this.gainNode.gain.value = this.volume
    this.gainNode.connect(this.ac.destination)
    this.analyser = this.ac.createAnalyser()
    this.analyser.fftSize = this.size * 2
    this.analyser.connect(this.gainNode)
  }

  load = (url, callback, progressCb) => {
    this.abort()
    Axios({
      url,
      responseType: 'arraybuffer',
      onDownloadProgress: v => {
        const { loaded, total } = v
        progressCb(loaded / total * 100)
      },
      cancelToken: new Axios.CancelToken(c => {
        this.axiosCancellation = c
      })
    }).then(response => {
      callback(response.data)
    }).catch(thrown => {
      if (Axios.isCancel(thrown)) {
        console.log('Request canceled', thrown.message)
      } else {
        progressCb('error')
      }
    })
  }

  abort = () => this.axiosCancellation && this.axiosCancellation('abort')

  play = ({ src, cb, progressCb }) => {
    const n = ++this.count
    if (this.source) {
      this.source.stop()
    }
    const decodeCallback = buffer => {
      this.buffer = buffer
      if (n === this.count && this.ac) {
        try {
          this.createBufferSource({ buffer }, cb)
        } catch (e) {
          console.log(e)
        }
      }
    }
    if (src instanceof ArrayBuffer) {
      this.ac.decodeAudioData(src, decodeCallback)
    } else {
      this.load(src, arrayBuffer => {
        this.ac.decodeAudioData(arrayBuffer, decodeCallback)
      }, progressCb)
    }
  }

  createBufferSource = ({ buffer, start = 0 }, cb?) => {
    if (this.source) { this.source.stop() }
    if (!this.buffer) { return }
    const bufferSource = this.ac.createBufferSource()
    bufferSource.buffer = this.buffer = buffer
    bufferSource.loop = true
    bufferSource.connect(this.analyser)
    bufferSource.start(0, start)
    this.source = bufferSource
    this.visualize()
    if (cb) { cb() }
  }

  updateVolume = vol => {
    this.gainNode.gain.value = this.volume = vol
  }

  visualize = () => {
    const arr = new Uint8Array(this.analyser.frequencyBinCount)
    const raf = window.requestAnimationFrame
    const fn = () => {
      this.analyser.getByteFrequencyData(arr)
      this.draw(arr, this.volume)
      this.rafId = raf(fn)
    }
    fn()
  }

  setCurrent = (start = 0) => {
    const { buffer } = this
    this.curr = 0
    this.createBufferSource({ buffer, start })
    this.setInterval(true)
  }

  setInterval = (isFirst?) => {
    if (this.interval) { clearInterval(this.interval) }
    if (isFirst) { this.setCurrTime(isFirst) }
    this.interval = setInterval(() => {
      this.setCurrTime()
    }, 1000)
  }

  setCurrTime = (isFirst?) => {
    const total = this.buffer ? this.buffer.duration.toFixed(0) : 0
    this.currentTime({ curr: isFirst ? 0 : ++this.curr , total })
  }

  pause = () => {
    this.ac.suspend()
    window.cancelAnimationFrame(this.rafId)
    if (this.interval) { clearInterval(this.interval) }
  }

  resume = () => {
    this.ac.resume()
    this.visualize()
    this.setInterval()
  }

  stop = () => {
    this.abort()
    this.ac.close()
    window.cancelAnimationFrame(this.rafId)
  }
}
