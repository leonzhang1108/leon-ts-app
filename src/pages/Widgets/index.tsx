import * as React from 'react'
import './index.less'
import DatePicker from '@components/DatePicker'

class Widgets extends React.Component {
  render() {
    const fromDate = new Date('1991-11-8')
    const toDate = new Date()
    return (
      <div className='widget-wrapper'>
        <DatePicker fromDate={fromDate} toDate={toDate}/>
      </div>
    )
  }
}

export default Widgets