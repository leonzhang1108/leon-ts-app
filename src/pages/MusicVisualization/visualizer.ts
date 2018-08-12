export default class Visualizer {
  source
  count
  ac
  draw
  size
  gainNode
  analyser
  rafId
  xhr
  volume
  buffer
  currentTime
  curr
  total
  interval

  constructor({ draw, size, volume, currentTime }) {
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
    this.xhr = new XMLHttpRequest()
    this.abort()
    this.xhr.open('GET', url)
    this.xhr.responseType = 'arraybuffer'
    this.xhr.onload = () => {
      callback(this.xhr.response)
    }
    this.xhr.onprogress = v => {
      const { loaded, total } = v
      progressCb(loaded / total * 100)
    }
    this.xhr.send()
  }

  abort = () => this.xhr && this.xhr.abort()

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
        } catch(e) {
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
    if(cb) { cb() }
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

  setCurrent = start => {
    const { buffer } = this
    this.curr = 0
    this.createBufferSource({ buffer, start })
    this.setInterval()
  }

  setInterval = () => {
    if (this.interval) { clearInterval(this.interval) }
    this.interval = setInterval(() => {
      const total = this.buffer.duration.toFixed(0)
      this.currentTime({ curr: ++this.curr, total })
    }, 1000)
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
