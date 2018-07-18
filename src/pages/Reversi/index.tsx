import * as React from 'react'
import Tools from './tools'
import './index.less'
import Utils from '@utils'
import { Button } from 'antd'

interface IProps {
  isMobile: boolean
}

interface IState {
  checkerboard: any[][],
  step: number,
  history: any[]
}

const statusMap = {
  empty: 0,
  black: 1,
  white: 2,
  blackHover: 3,
  whiteHover: 4
}

class Reversi extends React.Component<IProps, IState> {
  componentWillMount() {
    this.reset()
  }

  reset = () => {
    this.setState({
      checkerboard: this.initCheckerboard(),
      history: [],
      step: 0
    })
  }

  initCheckerboard = () => [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 2, 1, 0, 0, 0],
    [0, 0, 0, 1, 2, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
  ]

  couldClick = ({ x, y }) => {
    const { checkerboard, step } = this.state
    return Tools.couldClick({ x, y, checkerboard, player: step % 2 })
  }

  itemMouseEnter = ({ rowIndex: x, itemIndex: y }) => {
    const { checkerboard, step } = this.state
    const { blackHover, whiteHover } = statusMap
    if (checkerboard[x][y] === statusMap.empty && this.couldClick({ x, y })) {
      checkerboard[x][y] = step % 2 === 0 ? blackHover : whiteHover
      this.setState({ checkerboard })
    }
  }

  itemMouseLeave = ({ rowIndex: x, itemIndex: y }) => {
    const { checkerboard } = this.state
    if (checkerboard[x][y] === statusMap.blackHover
      || checkerboard[x][y] === statusMap.whiteHover) {
      checkerboard[x][y] = statusMap.empty
      this.setState({ checkerboard })
    }
  }

  itemClick = ({ rowIndex: x, itemIndex: y }) => {
    const { checkerboard, step, history } = this.state
    const { black, white } = statusMap
    if (checkerboard[x][y] !== black && checkerboard[x][y] !== white && this.couldClick({ x, y })) {
      checkerboard[x][y] = step % 2 === 0 ? black : white
      const { c, r } = Tools.clickToCover({ x, y, checkerboard, player: step % 2 })
      history.push({ curr: { x, y }, reverse: r })
      this.setState({ 
        checkerboard: c, 
        step: history.length,
        history
      })
    }
  }

  retract = () => {
    const { history, checkerboard } = this.state
    const { curr, reverse } = history.pop()
    const { x, y } = curr
    const { empty, black, white } = statusMap
    checkerboard[x][y] = empty
    reverse.forEach(r => {
      checkerboard[r.x][r.y] = checkerboard[r.x][r.y] === white ? black : white
    })

    this.setState({ history, step: history.length, checkerboard })
  }

  renderItem = (item, rowIndex, itemIndex) => {
    const status = this.state.checkerboard[rowIndex][itemIndex]
    const { black, white, blackHover, whiteHover } = statusMap
    const className = status ? ['chosen'] : []
    if (className.length) {
      switch (status) {
        case black:
          className.push('black selected')
          break
        case white:
          className.push('white selected')
          break
        case blackHover:
          className.push('black')
          break
        case whiteHover:
          className.push('white')
          break
      }
    }
    return (
      <td className='item' key={itemIndex}
        onClick={Utils.handle(this.itemClick, { rowIndex, itemIndex })}
        onMouseOver={Utils.handle(this.itemMouseEnter, { rowIndex, itemIndex })}
        onMouseLeave={Utils.handle(this.itemMouseLeave, { rowIndex, itemIndex })}
      >
        <div className={className.join(' ')} >
          <div className='chess front'/>
          <div className='chess back'/>
        </div>
      </td>
    )
  }

  renderRow = (row, rowIndex) => (
    <tr className='row' key={rowIndex}>
      {row.map((item, itemIndex) => this.renderItem(item, rowIndex, itemIndex))}
    </tr>
  )

  render() {
    const { checkerboard, step, history } = this.state
    const { isMobile } = this.props
    const className = step % 2 === 1 ? ['current', 'white'] : ['current', 'black']
    return (
      <div className='reversi-wrapper'>
        <div className={ isMobile ? 'checkerboard' : 'checkerboard bigger' }>
          <table>
            <tbody>
              {checkerboard.map(this.renderRow)}
            </tbody>
          </table>
        </div>
        <div className='reversi-bottom'>
          <Button type="primary" disabled={history.length === 0} onClick={this.reset}>
            Reset
          </Button>
          <div className={ isMobile ? className.join(' ') : className.concat('bigger').join(' ') } />
          <Button type="primary" disabled={history.length === 0} onClick={this.retract}>
            Retract
          </Button>
        </div>
      </div>
    )
  }
}

export default Utils.connect({
  component: Reversi,
  mapStateToProps: state => ({
    isMobile: state.common.isMobile
  }),
})