import Util from '@utils'
import React from 'react'
import './index.less'

interface IProps {
  fromDate?: Date
  toDate?: Date
}

interface IState {
  year: number
  month: number
  step: number
  weekList: string[]
  fromDate?: {
    year: number
    month: number
    day: number
    week: number
  }
  toDate?: {
    year: number
    month: number
    day: number
    week: number
  }
  visible: boolean
}

class DatePicker extends React.Component<IProps, IState> {
  constructor(props) {
    super(props)
    const date = new Date()
    const { fromDate, toDate } = this.props
    this.state = {
      year: fromDate ? fromDate.getFullYear() : date.getFullYear(),
      month: fromDate ? fromDate.getMonth() : date.getMonth(),
      weekList: ['日', '一', '二', '三', '四', '五', '六'],
      visible: false,
      fromDate: fromDate ? this.initDate(fromDate) : undefined,
      toDate: toDate ? this.initDate(toDate) : undefined,
      step: fromDate && toDate ? 2 : 0,
    }
    document.addEventListener('click', this.hideCalender)
  }

  initDate = (date) => ({
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate(),
    week: date.getDay(),
  })

  componentWillUnmount() {
    document.removeEventListener('click', this.hideCalender)
  }

  next = () => {
    const { year, month } = this.nextMonth()
    this.setState({ year, month })
  }

  pre = () => {
    const { year, month } = this.preMonth()
    this.setState({ year, month })
  }

  nextYear = () => this.setState({ year: this.state.year + 1 })

  preYear = () => this.setState({ year: this.state.year - 1 })

  nextMonth = () => {
    const { year, month } = this.state
    if (month >= 11) {
      return {
        year: year + 1,
        month: 0,
      }
    } else {
      return {
        year,
        month: month + 1,
      }
    }
  }

  preMonth = () => {
    const { year, month } = this.state
    if (month === 0) {
      return {
        year: year - 1,
        month: 11,
      }
    } else {
      return {
        year,
        month: month - 1,
      }
    }
  }

  renderTitle = () => {
    const { weekList } = this.state
    return (
      <tr className="c-row">
        {weekList.map((item, i) => (
          <td className="item" key={i}>
            {item}
          </td>
        ))}
      </tr>
    )
  }

  itemClick = ({ year, month, day, week }) => {
    if (!day) {
      return
    }
    const { fromDate, step } = this.state
    if (!fromDate) {
      this.setState({ fromDate: { year, month, day, week }, step: 1 })
    } else {
      if (step === 2) {
        this.setState({
          fromDate: { year, month, day, week },
          toDate: undefined,
          step: 0,
        })
      } else {
        const { year: fromYear, month: fromMonth, day: fromDay } = fromDate
        if (
          new Date(fromYear, fromMonth, fromDay) > new Date(year, month, day)
        ) {
          this.setState({ fromDate: { year, month, day, week }, step: 1 })
        } else {
          this.setState({
            toDate: { year, month, day, week },
            step: 2,
            visible: false,
          })
        }
      }
    }
  }

  itemMouseEnter = ({ year, month, day, week }) => {
    const { fromDate, step } = this.state
    if (!fromDate || step === 2 || !day) {
      return
    }
    this.setState({ toDate: { year, month, day, week } })
  }

  isSelected = ({ year, month, day, date }) => {
    if (!date) {
      return false
    }
    const { year: dYear, month: dMonth, day: dDay } = date
    return year === dYear && month === dMonth && day === dDay
  }

  toggleVisible = (res?) =>
    this.setState({ visible: res === undefined ? !this.state.visible : res })

  hideCalender = () => this.toggleVisible(false)

  stopBubbling = (e) => e.nativeEvent.stopImmediatePropagation()

  inputClick = (e) => {
    this.toggleVisible()
    this.stopBubbling(e)
  }

  isInRange = ({ year, month, day }) => {
    const { fromDate, toDate } = this.state
    if (fromDate && toDate && day) {
      const { year: fromYear, month: fromMonth, day: fromDay } = fromDate
      const { year: toYear, month: toMonth, day: toDay } = toDate
      return (
        new Date(year, month, day) >= new Date(fromYear, fromMonth, fromDay) &&
        new Date(year, month, day) <= new Date(toYear, toMonth, toDay)
      )
    }
    return false
  }

  formatDate = (date) => {
    if (!date) {
      return {}
    }
    const { year, month, day, week } = date
    return {
      date: year && month && day ? `${year}-${month}-${day}` : '',
      week,
    }
  }

  getMonthList = (year, month) => {
    let row = 0
    let weekDay = new Date(`${year}-${month}-1`).getDay()
    const days = new Date(year, month, 0).getDate()
    const list: any[] = [new Array(7).fill(0)]
    for (let i = 1; i <= days; i++) {
      if (list[row][weekDay] === undefined) {
        row++
        weekDay = 0
        list.push(new Array(7).fill(0))
      }
      list[row][weekDay] = i
      weekDay++
    }
    return { year, month, list }
  }

  renderRow = ({ row, rowIdx, year, month }) => (
    <tr className="c-row" key={rowIdx}>
      {row.map((day, week) => {
        return (
          <td
            className={`
              item
              ${day ? 'date' : ''}
              ${this.isInRange({ year, month, day }) ? 'in-range' : ''}
              ${
                this.isSelected({ year, month, day, date: this.state.fromDate })
                  ? 'selectedFrom'
                  : ''
              }
              ${
                this.isSelected({ year, month, day, date: this.state.toDate })
                  ? 'selectedTo'
                  : ''
              }
            `}
            key={week}
            onClick={Util.handle(this.itemClick, { year, month, day, week })}
            onMouseEnter={Util.handle(this.itemMouseEnter, {
              year,
              month,
              day,
              week,
            })}
          >
            <span className="item-inner">{day || ''}</span>
          </td>
        )
      })}
    </tr>
  )

  renderCalender = ({ list, year, month }) => (
    <div className="calender">
      <div className="year-month">
        {year}-{month}
      </div>
      <table>
        <thead>{this.renderTitle()}</thead>
        <tbody>
          {list.map((row, rowIdx) =>
            this.renderRow({ row, rowIdx, year, month })
          )}
        </tbody>
      </table>
    </div>
  )

  render() {
    const {
      year: leftYear,
      month: leftMonth,
      fromDate,
      toDate,
      visible,
      step,
      weekList,
    } = this.state
    const { year: rightYear, month: rightMonth } = this.nextMonth()
    const left = this.getMonthList(leftYear, leftMonth + 1)
    const right = this.getMonthList(rightYear, rightMonth + 1)
    const { date: fDate, week: fWeek } = this.formatDate(fromDate)
    const { date: tDate, week: tWeek } = this.formatDate(toDate)

    return (
      <div className="calender-component">
        <div className="calender-input" onClick={this.inputClick}>
          <div className="input">
            <span className="icon">
              <i className="anticon icon-calendar" />
            </span>
            <span className="date-content">{fDate}</span>
            <span className="week">{fWeek >= 0 ? weekList[fWeek] : ''}</span>
          </div>
          <div className="input">
            <span className="icon">
              <i className="anticon icon-calendar" />
            </span>
            <span className="date-content">{step === 2 ? tDate : ''}</span>
            <span className="week">
              {step === 2 ? (tWeek >= 0 ? weekList[tWeek] : '') : ''}
            </span>
          </div>
        </div>
        {visible ? (
          <div className="floating">
            <div className="calender-wrapper" onClick={this.stopBubbling}>
              <i className="anticon icon-left" onClick={this.pre} />
              <i className="anticon icon-right" onClick={this.next} />
              <i
                className="anticon icon-double-left double-left"
                onClick={this.preYear}
              />
              <i
                className="anticon icon-double-right double-right"
                onClick={this.nextYear}
              />
              {this.renderCalender(left)}
              {this.renderCalender(right)}
            </div>
          </div>
        ) : null}
      </div>
    )
  }
}

export default DatePicker
