import * as React from 'react'
import './index.less'
import Utils from '@utils'
import Tools from './tools'
import { Button } from 'antd'
import Constant from './constant'
const { block: blockMap, keyCode } = Constant

const blocks = Object.keys(blockMap)

interface IStates {
  row: number,
  column: number,
  screen: number[][],
  playboard: number[][],
  cBlock: string,
  interval?: any,
  y: number,
  x: number,
  rotate: number,
  intervalTime: number,
  couldMove: boolean,
  pause: boolean,
  gameover: boolean,
  touchDown: boolean,
  score: number,
  pressed: boolean
}

interface IProps {
  isMobile: boolean
}

class Tetris extends React.Component<IProps, IStates> {

  interval

  btnInterval

  componentWillMount() {
    document.addEventListener('keyup', this.keyup)
    document.addEventListener('keydown', this.keydown)
    document.addEventListener('touchend', this.clearBtnInterval)
    document.addEventListener('visibilitychange', this.visibilitychange)
    this.resetGame()
  }

  componentWillUnmount() {
    this.clearInterval()
    this.clearBtnInterval()
    document.removeEventListener('keyup', this.keyup)
    document.removeEventListener('keydown', this.clearBtnInterval)
    document.removeEventListener('touchend', this.clearBtnInterval)
    document.removeEventListener('visibilitychange', this.visibilitychange)
  }

  clearBtnInterval = () => {
    if (this.btnInterval) { clearInterval(this.btnInterval) }
  }
  
  clearInterval = () => {
    if (this.interval) { clearInterval(this.interval) }
  }

  resetGame = () => {
    this.clearInterval()
    const row = 20
    const column = 10
    const screen = this.calculateScreen({ row, column })
    this.setState({
      row, column, screen,
      playboard: screen,
      cBlock: blocks[Utils.random(0, blocks.length)],
      y: 0,
      x: 0,
      rotate:  Utils.random(0, 4),
      intervalTime: 800,
      pause: false,
      gameover: false,
      touchDown: false,
      score: 0,
      pressed: false
    }, () => this.doMovePlayboard(true))
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
      this.touchStart(e.keyCode)
    }
  }

  doMove = code => {
    const { x: cx, y: my, screen, cBlock, row, rotate, pause, gameover } = this.state
    if (pause || gameover) { return }
    let playboard = [[]]
    let x = cx
    switch(code) {
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
    if (next) {
      const { x: ix, y: iy } = this.state
      this.movePlayboard({ x: ix, y: iy})
    }
    this.doTimeout()
  }

  doTimeout = () => {
    this.interval = setInterval(() => {
      const { x, y } = this.state
      this.movePlayboard({ x, y })
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
    if (clearedList.length) { 
      clearedList.forEach(index => playboard[index] = new Array(10).fill(3))
      this.setState({ screen: playboard })
      const state = couldCalculate ? { screen, score: score + clearedList.length } : { screen, score }
      setTimeout(() => { this.setState(state, () => this.newInterval(true)) }, 300)
    } else {
      this.setState({ screen }, () => this.newInterval(true))
    }
  }

  reset = () => {
    this.setState({
      cBlock: blocks[Utils.random(0, 7)],
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
    const interval = code === keyCode.down ? 50 : 100
    this.doMove(code)
    if (code !== keyCode.up) {
      this.btnInterval = setInterval(() => this.doMove(code), interval)
    }
  }
  
  render() {
    const { isMobile } = this.props
    const { pause, gameover, touchDown, score } = this.state
    return (
      <div className={`tetris-wrapper ${isMobile ? 'mobile' : ''}`}>
        <div className='tetris-screen-wrapper'>
          <div className='score'>{score}</div>
          <div className={`tetris-screen ${touchDown ? 'touch-buttom' : ''}`}>
            { this.renderPlayboard() }
            {
              gameover ? (
                <div className='game-over'>
                  <Button type="primary" onClick={this.resetGame}>Reset</Button>
                </div>
              ) : null
            }
          </div>
        </div>
        <div className='btn-wrapper'>
          <div className='functional-btn'>
            <div onTouchStart={this.togglePause} className={`anticon anticon-ts-app icon-${pause ? 'play' : 'pause'}`}/>
            <div onTouchStart={this.goToBottom} className={`anticon anticon-ts-app icon-down`}/>
          </div>
          <div className='direction'>
            <div onTouchStart={Utils.handle(this.doMove, keyCode.up)} className='anticon anticon-ts-app icon-up-circle'/>
            <div className='middle'>
              <div onTouchStart={Utils.handle(this.touchStart, keyCode.left)} className='anticon anticon-ts-app icon-left-circle'/>
              <div onTouchStart={Utils.handle(this.touchStart, keyCode.right)} className='anticon anticon-ts-app icon-right-circle'/>
            </div>
            <div onTouchStart={Utils.handle(this.touchStart, keyCode.down)} className='anticon anticon-ts-app icon-down-circle'/>
          </div>
        </div>
      </div>
    )
  }
}

export default Utils.connect({
  component: Tetris,
  mapStateToProps: state => ({
    isMobile: state.common.isMobile
  })
})