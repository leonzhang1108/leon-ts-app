import * as React from 'react'
import './index.less'
import Utils from '@utils'

interface IStates {
  row: number,
  column: number,
  playboard: number[][]
  interval?: any
}

interface IProps {
  isMobile: boolean
}

class Widgets extends React.Component<IProps, IStates> {

  componentWillMount() {
    const row = 20
    const column = 10
    this.setState({
      row, column,
      playboard: this.calculatePlayboard({ row, column })
    })
  }

  componentDidMount() {
    let index = 0
    const interval = setInterval(() => {
      this.movePlayboard(index)
      index++
      if(index === 20) { index = 0 }
    }, 50)
    this.setState({ interval })
  }

  movePlayboard = i => {
    const { row, column } = this.state
    const playboard = this.calculatePlayboard({ row, column })
    playboard[i] = new Array(10).fill(1)
    this.setState({ playboard })
  }

  componentWillUnmount() {
    clearInterval(this.state.interval)
  }

  // state 
  // 0: empty, 1: full
  calculatePlayboard = ({ row: r, column: c }) => {
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
  component: Widgets,
  mapStateToProps: state => ({
    isMobile: state.common.isMobile
  })
})