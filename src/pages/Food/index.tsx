import * as React from 'react'
import './index.less'
import { Input } from 'antd'
import Word from './Word'
import Api from '@utils/fetch.js'
const Search = Input.Search

interface IFoodState{
  showCanvas: boolean
}

class Food extends React.Component<{}, IFoodState> {

  canvas
  wrapper
  words = {}
  interval

  componentWillMount() {
    this.setState({
      showCanvas: false
    })
  }

  onSearch = v => {
    console.log(v)
  }

  componentDidMount() {
    Api.get('data/food.json').then(this.initCanvas)
  }

  initCanvas = res => {
    this.setState({ showCanvas: true })
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
    const { showCanvas } = this.state
    return (
      <div className='food-wrapper' ref={el => this.wrapper = el}>
        <div className='input'>
          <Search
            placeholder="food you want"
            enterButton="Add"
            size="large"
            onSearch={this.onSearch}
          />
        </div>
        <canvas id='c' className='canvas' ref={el => this.canvas = el} style={{ opacity: showCanvas ? 1 : 0}}/>
      </div>
    )
  }
}


export default Food
