import React from 'react'
import Utils from '@utils'
import './index.less'
import CenaOptions from './cena.json'

interface ICenaState {
  loaded: boolean
}

class Word {
  text: string
  x: number
  y: number
  font: string
  speed: number
  constructor({ key, words, w, h }) {
    this.text = key
    this.x = Math.random() * w
    this.y = Math.random() * h
    this.font = words[key] * 10 + 'px arial'
    this.speed =
      (words[key] > 5 ? words[key] - 2.5 : words[key]) + Utils.random(0, 5)
  }
}

class Cena extends React.Component<{}, ICenaState> {
  canvas
  wrapper
  words = {}
  interval

  constructor(props) {
    super(props)
    this.state = {
      loaded: false,
    }
  }

  componentDidMount() {
    this.setState({ loaded: true }, () => this.initCanvas(CenaOptions))
  }

  initCanvas = (res) => {
    this.words = res
    const wordsAttr: any[] = []
    const { offsetHeight: h, offsetWidth: w } = this.wrapper
    const words = this.words
    const c = this.canvas.getContext('2d')
    this.canvas.width = w
    this.canvas.height = h

    c.fillStyle = '#000'
    c.globalAlpha = 0.2

    for (const key in this.words) {
      if (key) {
        wordsAttr.push(new Word({ key, words, w, h }))
      }
    }

    const move = () => {
      wordsAttr.forEach((_, i) => {
        if (wordsAttr[i].x > w) {
          wordsAttr[i].x = -wordsAttr[i].width
          wordsAttr[i].y = Math.random() * h
        } else {
          wordsAttr[i].x += wordsAttr[i].speed
        }
      })
    }

    const animation = () => {
      wordsAttr.forEach((_, i) => {
        c.font = wordsAttr[i].font
        c.fillText(wordsAttr[i].text, wordsAttr[i].x, wordsAttr[i].y)
        wordsAttr[i].width = c.measureText(wordsAttr[i].text).width
        c.stroke()
      })
      move()
    }

    const init = () => {
      c.clearRect(0, 0, w, h)
      animation()
    }

    if (requestAnimationFrame) {
      const loop = () => {
        init()
        requestAnimationFrame(loop)
      }
      loop()
    } else {
      this.interval = setInterval(init, 24)
    }
  }

  componentWillUnmount() {
    clearInterval(this.interval)
  }

  render() {
    const { loaded } = this.state
    return (
      <div className="cena-wrapper" ref={(el) => (this.wrapper = el)}>
        {loaded ? (
          <canvas
            id="c"
            className="canvas"
            ref={(el) => (this.canvas = el)}
            style={{ opacity: loaded ? 1 : 0 }}
          />
        ) : (
          <div className="loader" />
        )}
      </div>
    )
  }
}

export default Cena
