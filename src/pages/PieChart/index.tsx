
import * as React from 'react'
import './index.less'
import Echarts from 'echarts'
import Utils from '@utils'
import Api from '@utils/fetch.js'

interface IProps {
  contentHeight: number,
  contentWidth: number
}

class PieChart extends React.Component<IProps> {

  echarts: HTMLDivElement | null
  myChart: any

  componentDidMount () {
    Api.get('data/echarts.json').then(res => {
      this.myChart = Echarts.init(this.echarts)
      this.myChart.setOption(res)
      setTimeout(this.myChart.resize, 0)
    })
  }

  componentWillReceiveProps () {
    setTimeout(this.myChart.resize, 0)
  }

  componentWillUpdate () {
    setTimeout(this.myChart.resize, 0)
  }

  render () {
    return (
      <div className='pie-chart-wrapper'>
        <div ref={dom => this.echarts = dom} className='echarts' />
      </div>
    )
  }
}

export default Utils.connect({
  component: PieChart,
  mapStateToProps: state => ({
    contentHeight: state.common.contentHeight,
    contentWidth: state.common.contentWidth
  })
})
