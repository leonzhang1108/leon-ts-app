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
  x: number
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
      cBlock: 'O',
      y: 0,
      x: 0
    })
  }

  keydown = e => this.doMove(e.keyCode)

  doMove = code => {
    const { x: cx, y: my, screen, cBlock } = this.state
    let playboard = [[]]
    let x = cx
    switch(code) {
      case keyCode.left:
        x = cx - 1
        const { playboard: lp, x: lx } = Tools.getCurrPosition({ x, y: my - 1, cBlock, screen })
        playboard = lp
        x = lx
        break
      case keyCode.right:
        x = cx + 1
        const { playboard: rp, x: rx } = Tools.getCurrPosition({ x, y: my - 1, cBlock, screen })
        playboard = rp
        x = rx
        break
      default:
        return
    }

    this.setState({ playboard, x })
  }

  componentDidMount() {
    const interval = setInterval(() => {
      const { x, y, row } = this.state
      this.movePlayboard({ x, y })
      if (y === row) { this.setState({ y: 0 }) }
    }, 1000)
    this.setState({ interval })
  }

  movePlayboard = ({ x, y }) => {
    const { screen, cBlock } = this.state
    const { playboard } = Tools.getCurrPosition({ x, y, cBlock, screen })
    this.setState({ playboard, y: y + 1 })
  }

  componentWillUnmount() {
    if (this.state.interval) { clearInterval(this.state.interval) }
    document.removeEventListener('keydown', this.keydown)
  }

  // state 
  // 0: empty, 1: full
  calculateScreen = ({ row: r, column: c }) => {
    const result: number[][] = []
    for(let i = 0; i < r; i++) {
      const row: number[] = []
      for(let j = 0; j < c; j++) {
        row.push(0)
      }
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