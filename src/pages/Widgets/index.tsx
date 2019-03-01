// import DatePicker from '@cpt/DatePicker'
import ImgZoomer from '@cpt/ImgZoomer'
import src from '@img/justice_league.jpg'
import Utils from '@utils'
import * as React from 'react'
import './index.less'

interface IProps {
  height: number,
  width: number
}

class Widgets extends React.Component<IProps> {
  render () {
    // const fromDate = new Date('1991-11-8')
    // const toDate = new Date()
    const { height, width } = this.props
    return (
      <div className='widget-wrapper'>
        {/* <DatePicker fromDate={fromDate} toDate={toDate}/> */}
        <ImgZoomer
          wrapperHeight={height}
          wrapperWidth={width}
          src={src}
        />
      </div>
    )
  }
}

export default Utils.connect({
  component: Widgets,
  mapStateToProps: state => ({
    height: state.common.contentHeight,
    width: state.common.contentWidth
  })
})
