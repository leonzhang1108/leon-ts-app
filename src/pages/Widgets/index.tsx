import * as React from 'react'
import './index.less'
import DatePicker from '@components/DatePicker'
import { Row, Col } from 'antd'

class Widgets extends React.Component {
  render() {
    const fromDate = new Date('1991-11-8')
    const toDate = new Date()
    return (
      <div className='widget-wrapper'>
        <Row gutter={16}>
          <Col className="gutter-row" span={6}>
            <DatePicker fromDate={fromDate} toDate={toDate}/>
          </Col>
        </Row>
      </div>
    )
  }
}

export default Widgets