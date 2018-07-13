import * as React from 'react'
import Utils from '@utils'
import './index.less'

interface IProps {
  isMobile: boolean
}

interface IState {
  size: number,
  checkerboard: any[][],
  step: number
}

class Gobang extends React.Component<IProps, IState> {
  componentWillMount() {
    const size = !this.props.isMobile ? 11 : 5
    
    this.setState({
      size,
      checkerboard: this.calculateCheckerboard(size),
      step: 0
    })
  }

  // state 
  // 0: nothing, 1: hover, 2: white, 3: black
  calculateCheckerboard = size => {
    const result: any[][] = []
    for(let i = 0; i < size; i++) {
      const row: any[] = []
      for(let j = 0; j < size; j++) {
        row.push({ state: 0 })
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
    this.setCheckerboard({  state: step % 2 === 1 ? 3 : 2, rowIndex, itemIndex }, true)
  }

  setCheckerboard = ({ state, rowIndex, itemIndex }, isClick?) => {
    const { checkerboard, step } = this.state
    if (checkerboard[rowIndex][itemIndex].state === 2 || checkerboard[rowIndex][itemIndex].state === 3) {
      return
    }
    checkerboard[rowIndex][itemIndex] = { state }
    this.setState({ checkerboard, step: isClick ? step + 1 : step })
  }

  renderItem = (item, rowIndex, itemIndex) => {
    const { state } = item
    const { step } = this.state
    let className = ''
    switch(state) {
      case 1:
        className = step % 2 !== 1 ? 'chosen black' : 'chosen white'
        break
      case 2:
        className = 'chosen black'
        break
      case 3:
        className = 'chosen white'
        break
      default:
      className = ''
    }
    return (
      <td className='item' key={itemIndex} 
        onClick={Utils.handle(this.itemClick, { rowIndex, itemIndex })}
        onMouseEnter={Utils.handle(this.mouseEnter, { rowIndex, itemIndex })}
        onMouseLeave={Utils.handle(this.mouseLeave, { rowIndex, itemIndex })}
      >
        <div className={className}/>
      </td>
    )
  }

  renderRow = (row, rowIndex) => (
    <tr className='row' key={rowIndex}>
      { row.map((item, itemIndex) => this.renderItem(item, rowIndex, itemIndex)) }
    </tr>
  )

  render() {
    const { checkerboard } = this.state
    return (
      <div className='gobang-wrapper'>
        <table>
          <tbody>
            { checkerboard.map(this.renderRow) }
          </tbody>
        </table>
      </div>
    )
  }
}

export default Utils.connect({
  component: Gobang,
  mapStateToProps: state => ({
    isMobile: state.common.isMobile
  }),
})