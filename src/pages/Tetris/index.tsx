import * as React from 'react'
import './index.less'
import Utils from '@utils'
import Tools from './tools'

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
  intervalTime: number
}

interface IProps {
  isMobile: boolean
}

const keyCode = {
  left: 37,
  up: 38,
  right: 39,
  down: 40
}

class Tetris extends React.Component<IProps, IStates> {

  componentWillMount() {
    const row = 20
    const column = 10
    const screen = this.calculateScreen({ row, column })
    document.addEventListener('keydown', this.keydown)
    this.setState({
      row, column, screen,
      playboard: screen,
      cBlock: 'I',
      y: 0,
      x: 0,
      rotate: 0,
      intervalTime: 500
    })
  }

  reset = (f?) => {
    this.setState({
      y: 1,
      x: 0,
      rotate: 0,
    }, f)
  }

  keydown = e => this.doMove(e.keyCode)

  doMove = code => {
    const { x: cx, y: my, screen, cBlock, row, rotate } = this.state
    let playboard = [[]]
    let x = cx
    switch(code) {
      case keyCode.left:
        x = cx - 1
        const { playboard: lp, x: lx, couldMove: lc } = Tools.getCurrPosition({ x, y: my ? my - 1 : 20, cBlock, screen, rotate, moveTo: keyCode.left })
        if (lc) { 
          x = lx 
          playboard = lp
          this.setState({ playboard, x })
        }
        return
      case keyCode.right:
        x = cx + 1
        const { playboard: rp, x: rx, couldMove: rc } = Tools.getCurrPosition({ x, y: my ? my - 1 : 20, cBlock, screen, rotate, moveTo: keyCode.right })
        if (rc) { 
          x = rx 
          playboard = rp
          this.setState({ playboard, x })
        }
        return
      case keyCode.down: 
        if (my > row) { return }
        const { couldMove } = Tools.getCurrPosition({ x, y: my, cBlock, screen, rotate, moveTo: keyCode.down })
        if (!couldMove) {
          this.isDropComplete(true)
          this.reset(this.newInterval)
        } else {
          this.newInterval()
        }
        return
      case keyCode.up:
        let r = rotate
        r = r >= 3 ? 0 : r + 1
        const { playboard: up, couldMove: uc } = Tools.getCurrPosition({ x: cx, y: my ? my - 1 : 20, cBlock, screen, rotate: r, moveTo: keyCode.up })
        if (uc) {
          playboard = up
          this.setState({ playboard, rotate: r })
        }
        return
      default:
        
    }
  }

  newInterval = () => {
    const { interval } = this.state
    if (interval) { clearInterval(interval)}
    this.doMovePlayboard()
  }

  componentDidMount() {
    this.doMovePlayboard()
  }

  doMovePlayboard = () => {
    const { x: ix, y: iy, intervalTime } = this.state
    const interval = setInterval(() => {
      const { x, y } = this.state
      this.movePlayboard({ x, y })
    }, intervalTime)
    this.movePlayboard({ x: ix, y: iy})
    this.setState({ interval })
  }

  movePlayboard = ({ x, y }) => {
    const { screen, cBlock, row, rotate } = this.state
    const { playboard, couldMove } = Tools.getCurrPosition({ x, y, cBlock, screen, rotate, moveTo: keyCode.down })
    if (couldMove) {
      this.setState({ playboard, y: y < row ? y + 1 : 0 }, () => this.isDropComplete())
    } else {
      this.isDropComplete(true, this.reset)
      
    }
    
  }

  isDropComplete = (res?, f?) => {
    const { y } = this.state
    if (y === 0 || res) {
      this.setState({ 
        screen: Utils.clone(this.state.playboard)
      }, f) 
    }
  }

  componentWillUnmount() {
    if (this.state.interval) { clearInterval(this.state.interval) }
    document.removeEventListener('keydown', this.keydown)
  }

  // state 
  // 0: empty, 1: full
  calculateScreen = ({ row: r, column: c }) => {
    const result: number[][] = []
    for (let i = 0; i < r; i++) {
      const row: number[] = []
      for (let j = 0; j < c; j++) { row.push(0) }
      result.push(row)
    }
    return result
  }

  renderPlayboard = () => this.state.playboard.map((r, i) => (
    <div className='row' key={i}>
      { r.map((c, j) => <div key={j} className={`item ${c ? 'full' : ''}`}/>) }
    </div>
  ))

  
  render() {
    const { isMobile } = this.props
    return (
      <div className={`tetris-wrapper ${isMobile ? 'mobile' : ''}`}>
        <div className='tetris-screen'>
          { this.renderPlayboard() }
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