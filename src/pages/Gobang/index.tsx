import Utils from '@utils'
import { Button, Modal } from 'antd'
import React from 'react'
import './index.less'

interface IProps {
  isMobile: boolean;
}

interface IState {
  size: number;
  showNumber: boolean;
  checkerboard: any[][];
  step: number;
  positions: any[];
  renju: number;
}

class Gobang extends React.Component<IProps, IState> {
  constructor(props) {
    super(props)
  }

  componentWillMount() {
    this.reset()
  }

  reset = () => {
    const size = !this.props.isMobile ? 15 : 3
    const renju = !this.props.isMobile ? 5 : 3
    const state = {
      size,
      renju,
      showNumber: false,
      step: 0,
      positions: [],
      checkerboard: this.calculateCheckerboard(size)
    }
    this.setState(state)
  }

  // state
  // 0: nothing, 1: hover, 2: black, 3: white
  calculateCheckerboard = size => {
    const result: any[][] = []
    for (let i = 0; i < size; i++) {
      const row: any[] = []
      for (let j = 0; j < size; j++) {
        row.push({ state: 0, index: -1 })
      }
      result.push(row)
    }
    return result
  }

  mouseEnter = ({ rowIndex, itemIndex }) => {
    this.setCheckerboard({ state: 1, rowIndex, itemIndex })
  }

  mouseLeave = ({ rowIndex, itemIndex }) => {
    this.setCheckerboard({ state: 0, rowIndex, itemIndex })
  }

  itemClick = ({ rowIndex, itemIndex }) => {
    const { step } = this.state
    this.setCheckerboard(
      { state: step % 2 === 1 ? 3 : 2, rowIndex, itemIndex },
      true
    )
  }

  setCheckerboard = ({ state, rowIndex, itemIndex }, isClick?) => {
    const { checkerboard, step, positions: p } = this.state
    if (
      checkerboard[rowIndex][itemIndex].state !== 2 &&
      checkerboard[rowIndex][itemIndex].state !== 3
    ) {
      checkerboard[rowIndex][itemIndex] = { state, index: isClick ? step : -1 }
      this.setState(
        {
          checkerboard,
          step: isClick ? step + 1 : step,
          positions: isClick
            ? p.concat({ row: rowIndex, column: itemIndex })
            : p
        },
        () =>
          isClick &&
          !this.isWin({ rowIndex, itemIndex, state }) &&
          this.isPeace()
      )
    }
  }

  isPeace = () => {
    const { size, step } = this.state
    if (size * size === step) {
      Modal.info({
        title: 'Peace',
        content: 'Draw'
      })
    }
  }

  isWin = ({ rowIndex, itemIndex, state }) => {
    const isWin =
      this.isColumnWin({ rowIndex, itemIndex, state }) ||
      this.isRowWin({ rowIndex, itemIndex, state }) ||
      this.isSkewWin({ rowIndex, itemIndex, state })

    if (isWin) {
      Modal.info({
        title: 'Victory',
        content: `${state === 2 ? 'black' : 'white'} wins`
      })
    }
    return isWin
  }

  isColumnWin = ({ rowIndex, itemIndex, state }) => {
    const { size, checkerboard, renju } = this.state
    let result = 0
    for (let i = -(renju - 1); i <= renju - 1; i++) {
      if (
        rowIndex + i >= 0 &&
        rowIndex + i < size &&
        checkerboard[rowIndex + i][itemIndex].state === state
      ) {
        result++
      } else {
        result = 0
      }
      if (result === renju) {
        break
      }
    }
    return result === renju
  }

  isRowWin = ({ rowIndex, itemIndex, state }) => {
    const { size, checkerboard, renju } = this.state
    let result = 0
    for (let i = -(renju - 1); i <= renju - 1; i++) {
      if (
        itemIndex + i >= 0 &&
        itemIndex + i < size &&
        checkerboard[rowIndex][itemIndex + i].state === state
      ) {
        result++
      } else {
        result = 0
      }
      if (result === renju) {
        break
      }
    }
    return result === renju
  }

  isSkewWin = ({ rowIndex, itemIndex, state }) =>
    this.isDownLineWin({ rowIndex, itemIndex, state }) ||
    this.isUpLineWin({ rowIndex, itemIndex, state })

  isDownLineWin = ({ rowIndex, itemIndex, state }) => {
    const { size, checkerboard, renju } = this.state
    let result = 0
    for (let i = -(renju - 1); i <= renju - 1; i++) {
      if (
        itemIndex + i >= 0 &&
        itemIndex + i < size &&
        rowIndex + i >= 0 &&
        rowIndex + i < size &&
        checkerboard[rowIndex + i][itemIndex + i].state === state
      ) {
        result++
      } else {
        result = 0
      }
      if (result === renju) {
        break
      }
    }
    return result === renju
  }

  isUpLineWin = ({ rowIndex, itemIndex, state }) => {
    const { size, checkerboard, renju } = this.state
    let result = 0
    for (let i = -(renju - 1); i <= renju - 1; i++) {
      if (
        itemIndex + i >= 0 &&
        itemIndex + i < size &&
        rowIndex - i >= 0 &&
        rowIndex - i < size &&
        checkerboard[rowIndex - i][itemIndex + i].state === state
      ) {
        result++
      } else {
        result = 0
      }
      if (result === renju) {
        break
      }
    }
    return result === renju
  }

  toggleShowNumber = () => {
    this.setState({ showNumber: !this.state.showNumber })
  }

  retract = () => {
    const { step, positions, checkerboard } = this.state
    const { row, column } = positions.pop()
    checkerboard[row][column] = { state: 0, index: -1 }
    this.setState({
      step: step - 1,
      positions,
      checkerboard
    })
  }

  renderItem = (item, rowIndex, itemIndex) => {
    const { state, index } = item
    const { step, showNumber } = this.state
    let className = ''
    switch (state) {
      case 1:
        className = step % 2 !== 1 ? 'chosen black' : 'chosen white'
        break
      case 2:
        className = 'chosen black selected'
        break
      case 3:
        className = 'chosen white selected'
        break
    }
    return (
      <div
        className="item"
        key={itemIndex}
        onClick={Utils.handle(this.itemClick, { rowIndex, itemIndex })}
        onMouseEnter={Utils.handle(this.mouseEnter, { rowIndex, itemIndex })}
        onMouseLeave={Utils.handle(this.mouseLeave, { rowIndex, itemIndex })}
      >
        <div className={className}>
          {showNumber && index >= 0 ? index + 1 : ''}
        </div>
      </div>
    )
  }

  renderRow = (row, rowIndex) => (
    <div className="row" key={rowIndex}>
      {row.map((item, itemIndex) => this.renderItem(item, rowIndex, itemIndex))}
    </div>
  )

  render() {
    const { checkerboard, showNumber, positions } = this.state
    return (
      <div className="gobang-wrapper">
        <div className="table-wrapper">{checkerboard.map(this.renderRow)}</div>
        <div className="button-wrapper">
          <Button
            type="primary"
            disabled={positions.length === 0}
            onClick={this.reset}
          >
            Reset
          </Button>
          <Button type="primary" onClick={this.toggleShowNumber}>
            {showNumber ? 'Hide steps' : 'Show steps'}
          </Button>
          <Button
            type="primary"
            disabled={positions.length === 0}
            onClick={this.retract}
          >
            Retract
          </Button>
        </div>
      </div>
    )
  }
}

export default Utils.connect({
  component: Gobang,
  mapStateToProps: state => ({
    isMobile: state.common.isMobile
  })
})
