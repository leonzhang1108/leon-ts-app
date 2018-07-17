
import * as React from 'react'
import './index.less'
import Utils from '@utils'

interface IProps {
  isMobile: boolean
}

interface IState {
  checkerboard: any[][],
}

class Reversi extends React.Component<IProps, IState> {
  componentWillMount() {
    this.reset()
  }

  reset = () => {
    const size = !this.props.isMobile ? 8 : 3
    this.setState({
      checkerboard: this.calculateCheckerboard(size)
    })
  }

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


  renderItem = (item, rowIndex, itemIndex) => {

    return (
      <td className='item' key={itemIndex} 
      >
        <div className='chosen black'/>
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
      <div className='reversi-wrapper'>
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
  component: Reversi,
  mapStateToProps: state => ({
    isMobile: state.common.isMobile
  }),
})