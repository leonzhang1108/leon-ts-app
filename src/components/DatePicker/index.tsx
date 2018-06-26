import * as React from 'react'
import Util from '@utils'
import './index.less'
import { Icon } from 'antd'

interface IState {
  year: number,
  month: number,
  title: string[]
}

class DatePicker extends React.Component<{}, IState> {
  componentWillMount() {
    const date = new Date()
    this.setState({
      year: date.getFullYear(),
      month: date.getMonth(),
      title: ['日', '一', '二', '三', '四', '五', '六']
    })
  }

  next = () => {
    const { year, month} = this.nextMonth()
    this.setState({ year, month})
  }

  pre = () => {
    const { year, month} = this.preMonth()
    this.setState({ year, month})
  }

  nextMonth = () => {
    const { year, month } = this.state
    if (month >= 11) {
      return {
        year: year + 1,
        month: 0
      }
    } else {
      return {
        year,
        month: month + 1
      }
    }
  }

  preMonth = () => {
    const { year, month } = this.state
    if (month === 0) {
      return {
        year: year - 1,
        month: 11
      }
    } else {
      return {
        year,
        month: month - 1
      }
    }
  }

  renderTitle = () => {
    const { title } = this.state
    return (
      <tr className='c-row'>
        {title.map((item, i) => <td className='item' key={i}>{item}</td>)}
      </tr>
    )
  }

  renderRow = (row, i) => (
    <tr className='c-row' key={i}>
      {row.map((item, idx) => <td className='item' key={idx}>{item || ''}</td>)}
    </tr>
  )

  renderCalender = ({ list, year, month }) => (
    <div className='calender'>
      <div className='year-month'>{year}-{month}</div>
      <table>
        <thead>
          {this.renderTitle()}
        </thead>
        <tbody>
          {list.map((row, i) => this.renderRow(row, i))}
        </tbody>
      </table>
    </div>
  )

  render() {
    const { year: leftYear, month: leftMonth } = this.state
    const { year: rightYear, month: rightMonth } = this.nextMonth()
    const left = Util.getMonthList(leftYear, leftMonth + 1)
    const right = Util.getMonthList(rightYear, rightMonth + 1)

    return (
      <div className='calender-wrapper'>
        <Icon type="left" className='left' onClick={this.pre}/>
        <Icon type="right" className='right' onClick={this.next}/>
        {this.renderCalender(left)}
        {this.renderCalender(right)}
      </div>
    )
  }
}

export default DatePicker