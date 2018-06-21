import * as React from 'react'
import './index.less'
import { Input } from 'antd'
import Word from './Word'
const Search = Input.Search


class Food extends React.Component {

  canvas
  wrapper
  words = {}
  timeout

  onSearch = v => {
    console.log(v)
  }

  componentDidMount() {
    setTimeout(() => {
      this.initCanvas()
    }, 0)
  }

  initCanvas = () => {

    const lyric = "i couldn't take it couldn't stand another minute couldn't bear another day without you in it all of the joy that I had known for my life was stripped away from me the minute that you died to have you in my life was all i ever wanted but now without you I'm a soul forever haunted can't help but feel that i had taken you for granted no way in hell that i can ever comprehend this i wasn't dreaming when they told me you were gone i was wide awake and feeling that they had to be wrong how could you leave me when you swore that you would stay now i'm trapped inside a nightmare every single fucking day it's like a movie but there's not a happy ending every scene fades black and there's no pretending this little fairy tale doesn't seem to end well theres no knight in shining armor who will wake me from the spell i know you didn't plan this you tried to do what's right but in the middle of this madness i'm the one you left to win this fight red like roses fills my head with dreams and finds me always closer to the emptiness and sadness that has come to take the place of you i know you're broken down by anger and by sadness you feel I left you in a world that's full of madness wish i could talk to you if only for a minute make you understand the reasons why i did it i wanna tell you that you're all that ever mattered want you to know that for eternity i'm shattered i tried so hard just to protect you but i failed to and in a prison of abandonment i've jailed you i never planned that i would leave you there alone i was sure that i would see you when i made it back home and all the times I swore that it would be okay now i'm nothing but a liar and you're thrown into the fray this bedtime story ends with misery ever after the pages are torn and there's no final chapter i didn't have a choice I did what I had to do i made a sacrifice but forced a bigger sacrifice on you i know you've lived a nightmare i caused you so much pain but baby please don't do what i did i don't want you to waste your life in vain red like roses fills my head with dreams and finds me always closer to the emptiness and sadness that has come to take the place of you you're not the only one who needed me i thought you understood you were the one i needed and you left me as I always feared you would would I change it if i could? it doesn't matter how the petals scatter now every nightmare just discloses it's your blood that's red like roses and no matter what I do nothing ever takes the place of you red like roses fills my head with dreams and finds me always closer to the emptiness and sadness that has come to take the place of you"
    const wordsAttr: any[] = []
    const { offsetHeight: h, offsetWidth: w } = this.wrapper
    this.stringHandle(lyric)
    this.canvas.width = w
    this.canvas.height = h
    const words = this.words
    const c = this.canvas.getContext('2d')

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

    this.timeout = setInterval(() => {
      c.clearRect(0, 0, w, h)
      animation()
    }, 24)

  }

  componentWillUnmount() {
    clearTimeout(this.timeout)
  }

  stringHandle = str => {
    const splitStr = str.split(" ")
    const wordArray: any[] = []
    const wordCount: any[] = []
    splitStr.every((x, i) => {
      let check = true
      wordArray.every((_, j) => {
        if (splitStr[i] === wordArray[j]) {
          wordCount[j]++
          check = false
          return false
        }
        return true
      })
      if (check) {
        wordArray.push(splitStr[i])
        wordCount.push(1)
      }
      return true
    })

    wordArray.forEach((_, i) => {
      this.words[wordArray[i]] = wordCount[i]
    })
    return this.words
  }

  render() {
    return (
      <div className='food' ref={el => this.wrapper = el}>
        <div className='input'>
          <Search
            placeholder="food you want"
            enterButton="Add"
            size="large"
            onSearch={this.onSearch}
          />
        </div>
        <canvas id='c' className='canvas' ref={el => this.canvas = el} />
      </div>
    )
  }
}


export default Food
