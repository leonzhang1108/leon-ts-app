import React from 'react'
import Utils from '@utils'
import './index.less'
import common from '@constant/common'
import { Button } from 'antd'
import nipplejs from 'nipplejs'
const { keyCode } = common

enum Direction {
  Up = 0,
  Down = 1,
  Left = 2,
  Right = 3
}

interface IProps {
  w: number
  h: number,
  isMobile: boolean
}

interface IState {
  isGameOver: boolean,
  hint: string
}

const { Up, Down, Left, Right } = Direction
const reverseDirection = {
  [Up]: Down,
  [Down]: Up,
  [Left]: Right,
  [Right]: Left
}
const backgroundColor = '#dcdcdc'
const initSnake = () => [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
const initSpeed = 200
const getFruit = (snake, max) => {
  const f = Utils.random(0, max - 1)
  return snake.includes(f) ? getFruit(snake, max) : f
}

class Snake extends React.Component<IProps, IState> {
  canvas
  ctx
  remote
  size = this.props.isMobile ? 20 : 20
  rowCount = ~~(this.props.w / this.size)
  colCount = ~~(this.props.h / this.size)
  max = this.rowCount * this.colCount
  direction = Right
  snake = initSnake()
  interval
  friut = getFruit(this.snake, this.max)
  speed = initSpeed
  count = 0
  state = {
    isGameOver: false,
    hint: ''
  }

  componentWillMount () {
    document.addEventListener('keydown', this.keydown)
  }

  componentWillUnmount () {
    document.removeEventListener('keydown', this.keydown)
  }

  keydown = e => {
    switch (e.keyCode) {
      case keyCode.up:
        this.go(Up)
        break
      case keyCode.down:
        this.go(Down)
        break
      case keyCode.left:
        this.go(Left)
        break
      case keyCode.right:
        this.go(Right)
        break
    }
  }

  componentDidMount () {
    this.ctx = this.canvas.getContext('2d')
    this.init()
    const joystick = nipplejs.create({
      zone: this.remote,
      color: '#777'
    })
    joystick.on('dir:up', () => this.go(Up))
    joystick.on('dir:down', () => this.go(Down))
    joystick.on('dir:left', () => this.go(Left))
    joystick.on('dir:right', () => this.go(Right))
  }

  go = direction => {
    if (this.state.isGameOver) return
    if (this.direction !== reverseDirection[direction]) this.direction = direction
    this.init()
  }

  init = () => {
    clearInterval(this.interval)
    this.doCycle()
    this.interval = setInterval(this.doCycle, this.speed)
  }

  reset = () => {
    this.setState({
      isGameOver: false
    }, () => {
      this.clearReact()
      this.snake = initSnake()
      this.direction = Right
      this.speed = initSpeed
      this.init()
    })
  }

  doCycle = () => {
    this.resetSnake()
    this.drawSnake()
  }

  clearReact = () => {
    const { w, h } = this.props
    this.ctx.clearRect(0, 0, w, h)
  }

  resetSnake = () => {
    this.clearReact()
    const last = this.snake[this.snake.length - 1]
    const next = this.getHead(last)

    // 是否吃到果子
    if (last === this.friut) {
      this.friut = getFruit(this.snake, this.max)
      // 每吃7个果实 加速
      if (this.count === 7) {
        this.speed *= .8
        this.count = 0
        this.init()
        return
      } else {
        this.count++
      }
    } else {
      this.snake.shift()
    }

    if (this.snake.includes(next)) {
      // game over
      clearInterval(this.interval)
      this.setState({
        hint: 'Game Over',
        isGameOver: true
      })
    } else if (this.snake.length === this.max) {
      // you win
      clearInterval(this.interval)
      this.setState({
        hint: 'You Win!!!',
        isGameOver: true
      })
    } else {
      this.snake.push(next)
    }
  }

  drawFriut = () => {
    this.draw(this.friut, '#666')
  }

  getHead = v => {
    const { rowCount, colCount, max, direction } = this
    let next
    let isTouchBorder
    switch (direction) {
      case Left:
        next = v - 1
        isTouchBorder = ~~(next / rowCount) !== ~~(v / rowCount)
        return isTouchBorder || v <= 0 ? v + rowCount - 1 : next
      case Right:
        next = v + 1
        isTouchBorder = ~~(next / rowCount) !== ~~(v / rowCount)
        return isTouchBorder ? v - rowCount + 1 : next
      case Up:
        next = v - rowCount
        isTouchBorder = next < 0
        return isTouchBorder ? max + v % rowCount : next
      case Down:
        next = v + rowCount
        isTouchBorder = ~~(next / rowCount) > colCount
        return isTouchBorder ? v % rowCount : next
    }
  }

  drawSnake = () => {
    this.drawFriut()
    const { length } = this.snake
    this.snake.forEach((v, i) => this.draw(v, i !== length - 1 ? '#666' : '#333'))
  }

  draw = (i, c) => {
    this.ctx.fillStyle = c
    this.ctx.fillRect(i % this.rowCount * this.size + 1, ~~(i / this.rowCount) * this.size + 1, this.size - 1, this.size - 1)
  }

  render () {
    const { w, h } = this.props
    const { isGameOver, hint } = this.state
    return (
      <div className='snake-wrapper'>
        <canvas ref={el => this.canvas = el} width={w} height={h} style={{ backgroundColor }} />
        <div className='remote-area' ref={el => this.remote = el}/>
        { isGameOver ? (
          <div className='over'>
            <div className='hint'>{ hint }</div>
            <Button type='primary' onClick={this.reset}>Reset</Button>
          </div>
        ) : ''}
      </div>
    )
  }
}

export default Utils.connect({
  component: Snake,
  mapStateToProps: state => ({
    w: state.common.contentWidth,
    h: state.common.contentHeight,
    isMobile: state.common.isMobile
  })
})
