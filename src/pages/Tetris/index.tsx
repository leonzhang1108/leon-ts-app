import Utils from '@utils'
import { Button } from 'antd'
import React from 'react'
import Constant from './constant'
import './index.less'
import Tools from './tools'
const { block: blockMap, keyCode, scores } = Constant

const blocks = Object.keys(blockMap)

interface IStates {
  row: number,
  column: number,
  screen: number[][],
  playboard: number[][],
  cBlock: string,
  interval?: number,
  y: number,
  x: number,
  h: number,
  rotate: number,
  intervalTime: number,
  couldMove: boolean,
  pause: boolean,
  gameover: boolean,
  touchDown: boolean,
  score: number,
  pressed: boolean,
  style: any,
}

interface IProps {
  isMobile: boolean,
  h: number
}

class Tetris extends React.Component<IProps, IStates> {

  interval

  btnInterval

  transform = Utils.transform

  constructor (props) {
    super(props)
    document.addEventListener('keyup', this.keyup)
    document.addEventListener('keydown', this.keydown)
    document.addEventListener('touchend', this.clearBtnInterval)
    document.addEventListener('visibilitychange', this.visibilitychange)
    this.resetGame()
  }

  componentWillUnmount () {
    this.clearInterval()
    this.clearBtnInterval()
    document.removeEventListener('keyup', this.keyup)
    document.removeEventListener('keydown', this.keydown)
    document.removeEventListener('touchend', this.clearBtnInterval)
    document.removeEventListener('visibilitychange', this.visibilitychange)
  }

  componentDidUpdate (nextProps) {
    const { isMobile } = this.props
    if (nextProps.isMobile !== isMobile) {
      this.setState({ style: this.getSize(nextProps) })
    }
  }

  clearBtnInterval = () => {
    if (this.btnInterval) { clearInterval(this.btnInterval) }
  }

  clearInterval = () => {
    if (this.interval) { clearInterval(this.interval) }
  }

  resetGame = (e?) => {
    this.clearInterval()
    const row = 20
    const column = 10
    const screen = this.calculateScreen({ row, column })
    const state = {
      row, column, screen,
      playboard: screen,
      style: this.getSize(this.props),
      cBlock: blocks[Utils.random(0, blocks.length)],
      x: 0, y: 0, intervalTime: 800, score: 0, rotate: Utils.random(0, 4),
      pause: false, gameover: false, touchDown: false, pressed: false
    }
    if (e) {
      this.setState(state, () => this.doMovePlayboard(true))
    } else {
      this.state = { ...state, couldMove: false, h: 0 }
      setTimeout(() => this.doMovePlayboard(true), 0)
    }
  }

  visibilitychange = () => {
    if ((!this.state.pause && document.visibilityState === 'hidden')
        || (this.state.pause && document.visibilityState !== 'hidden')) {
      this.togglePause()
    }
  }

  isGameOver = () => {
    const { x, y, cBlock, screen, rotate } = this.state
    const { couldMove } = Tools.getCurrPosition({ x, y: y + 1, cBlock, screen, rotate, moveTo: keyCode.down })
    return !(couldMove || blockMap[cBlock][rotate].length < y - 1)
  }

  clearRow = playboard => {
    const screen = Utils.clone(playboard).map(row => row.map(item => item ? 2 : 0))
    const clearedList: number[] = []
    playboard.forEach((row, i) => {
      if (row.every(item => item)) {
        screen.splice(i, 1)
        screen.unshift(new Array(10).fill(0))
        clearedList.push(i)
      }
    })
    return { screen, clearedList }
  }

  keyup = () => {
    this.clearBtnInterval()
    this.setState({ pressed: false })
  }

  keydown = e => {
    if (!this.state.pressed) {
      const { keyCode: code } = e
      if (code === keyCode.space) {
        this.doMove(code)
      } else {
        this.touchStart(code)
      }
    }
  }

  doMove = code => {
    const { x: cx, y: my, screen, cBlock, row, rotate, pause, gameover } = this.state
    if (pause || gameover) { return }
    let playboard = [[]]
    let x = cx
    switch (code) {
      case keyCode.left:
        x = cx - 1
        const {
          playboard: lp,
          x: lx,
          couldMove: lc
        } = Tools.getCurrPosition({ x, y: my ? my : 20, cBlock, screen, rotate, moveTo: keyCode.left })
        if (lc) {
          x = lx
          playboard = lp
          this.setState({ playboard, x, pressed: true })
        }
        return
      case keyCode.right:
        x = cx + 1
        const {
          playboard: rp,
          x: rx,
          couldMove: rc
        } = Tools.getCurrPosition({ x, y: my ? my : 20, cBlock, screen, rotate, moveTo: keyCode.right })
        if (rc) {
          x = rx
          playboard = rp
          this.setState({ playboard, x, pressed: true })
        }
        return
      case keyCode.down:
        if (my > row) { return }
        const {
          couldMove,
          playboard: dp
        } = Tools.getCurrPosition({ x, y: my + 1, cBlock, screen, rotate, moveTo: keyCode.down })
        if (couldMove) {
          this.newInterval()
          this.setState({ playboard: dp, y: my + 1, pressed: true })
        } else {
          this.reset()
        }
        return
      case keyCode.up:
        let r = rotate
        r = r >= 3 ? 0 : r + 1
        const {
          playboard: up,
          couldMove: uc
        } = Tools.getCurrPosition({ x: cx, y: my ? my : 20, cBlock, screen, rotate: r, moveTo: keyCode.up })
        if (uc) {
          playboard = up
          this.setState({ playboard, rotate: r, pressed: true })
        }
        return
      case keyCode.space:
        this.goToBottom()
        break
      default:

    }
  }

  newInterval = (next?) => {
    this.clearInterval()
    if (this.isGameOver()) {
      this.setState({ gameover: true })
    } else {
      this.doMovePlayboard(next)
    }
  }

  doMovePlayboard = (next?) => {
    if (next) { this.movePlayboard(this.state) }
    this.doTimeout()
  }

  doTimeout = () => {
    this.interval = setInterval(() => {
      this.movePlayboard(this.state)
    }, this.state.intervalTime)
  }

  movePlayboard = ({ x, y }) => {
    const { screen, cBlock, rotate } = this.state
    const { playboard, couldMove } = Tools.getCurrPosition({ x, y: y + 1, cBlock, screen, rotate, moveTo: keyCode.down })
    if (couldMove) {
      this.setState({ playboard, y: y + 1 })
    } else {
      this.reset()
    }
  }

  goToBottom = () => {
    const { x, cBlock, rotate, screen, gameover, pause } = this.state
    if (gameover || pause) { return }
    let { y, playboard: p } = this.state
    let couldGoDown = true
    while (couldGoDown) {
      const { couldMove, playboard } = Tools.getCurrPosition({ x, y: y + 1, cBlock, screen, rotate, moveTo: keyCode.down })
      couldGoDown = couldMove
      if (couldMove) {
        y++
        p = playboard
      } else {
        this.setState({ playboard: p, y, touchDown: true, pressed: true }, this.isRowNeedClear)
      }
    }
    setTimeout(() => this.setState({ touchDown: false }), 100)
  }

  isRowNeedClear = (couldCalculate?) => {
    this.clearInterval()
    const { playboard, score } = this.state
    const { screen, clearedList } = this.clearRow(playboard)
    const { length } = clearedList
    if (length) {
      const state = couldCalculate ? { screen, score: score + scores[length - 1] } : { screen, score }
      clearedList.forEach(index => playboard[index] = new Array(10).fill(3))
      this.setState({ screen: playboard })
      this.vibrate(100)
      setTimeout(() => { this.setState(state, () => this.newInterval(true)) }, 300)
    } else {
      this.setState({ screen }, () => this.newInterval(true))
    }
  }

  reset = () => {
    this.vibrate(100)
    this.setState({
      cBlock: blocks[Utils.random(0, blocks.length)],
      y: 0, x: 0, rotate: Utils.random(0, 4)
    }, () => this.isRowNeedClear(true))
  }

  // state
  // 0: empty, 1: block 2: full 3: cleared
  calculateScreen = ({ row: r, column: c }) => {
    const result: number[][] = []
    for (let i = 0; i < r; i++) {
      const row: number[] = []
      for (let j = 0; j < c; j++) { row.push(0) }
      result.push(row)
    }
    return result
  }

  renderPlayboard = () => this.state.playboard ? this.state.playboard.map((r, i) => (
    <div className='row' key={i}>
      { r.map((c, j) => {
        let cName = ''
        switch (c) {
          case 1:
            cName = 'block'
            break
          case 2:
            cName = 'full'
            break
          case 3:
            cName = 'cleared'
            break
        }
        return <div key={j} className={`item ${cName}`}/>
      }) }
    </div>
  )) : null

  togglePause = () => {
    const { pause } = this.state
    if (!pause && this.interval) {
      this.clearInterval()
      this.clearBtnInterval()
    } else {
      this.newInterval()
    }
    this.setState({ pause: !pause })
  }

  touchStart = code => {
    this.clearBtnInterval()
    const interval = code === keyCode.down ? 50 : 100
    this.doMove(code)
    if (code !== keyCode.up) {
      this.btnInterval = setInterval(() => this.doMove(code), interval)
    }
  }

  getSize = props => {
    if (!this.props.isMobile) { return {} }
    const { h } = props
    const scale = h / 960
    const filling = h - 480
    return {
      paddingTop: (filling - 100) * .6,
      [this.transform]: `scale(${scale + .3})`
    }
  }

  vibrate = s => false && this.props.isMobile && navigator.vibrate ? navigator.vibrate(s) : null

  getDirectionBtn = direction =>
    <div onTouchStart={Utils.handle(direction === 'up' ? this.doMove : this.touchStart, keyCode[direction])} className={`anticon anticon-ts-app icon-${direction}-circle`}/>

  render () {
    const { isMobile } = this.props
    const { pause, gameover, touchDown, score, style } = this.state
    const btnStyle = { [this.transform]: style[this.transform] }
    return (
      <div className={`tetris-wrapper ${isMobile ? 'mobile' : ''}`}>
        <div className='tetris-screen-wrapper' style={style}>
          <div className='score'>{score}</div>
          <div className={`tetris-screen ${touchDown ? 'touch-buttom' : ''}`}>
            { this.renderPlayboard() }
            {
              gameover ? (
                <div className='game-over'>
                  <Button type='primary' onClick={this.resetGame}>Reset</Button>
                </div>
              ) : null
            }
          </div>
        </div>
        <div className='btn-wrapper'>
          <div className='functional-btn' style={btnStyle}>
            <div onTouchStart={this.togglePause} className={`anticon anticon-ts-app icon-${pause ? 'play' : 'pause'}`}/>
            <div onTouchStart={this.goToBottom} className={`anticon anticon-ts-app icon-down`}/>
          </div>
          <div className='direction' style={btnStyle}>
            { this.getDirectionBtn('up') }
            <div className='middle'>
              { this.getDirectionBtn('left') }
              { this.getDirectionBtn('right') }
            </div>
            { this.getDirectionBtn('down') }
          </div>
        </div>
      </div>
    )
  }
}

export default Utils.connect({
  component: Tetris,
  mapStateToProps: state => ({
    isMobile: state.common.isMobile,
    h: state.common.contentHeight
  })
})
