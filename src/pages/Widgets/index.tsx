import * as React from 'react'
import './index.less'
import DatePicker from '@components/DatePicker'

class Widgets extends React.Component {
  render() {
    return (
      <div className='widget-wrapper'>
        <DatePicker/>
      </div>
    )
  }
}

export default Widgets