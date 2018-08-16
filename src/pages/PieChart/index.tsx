
import * as React from 'react'
import './index.less'
import Echarts from 'echarts'
import Utils from '@utils'
import Api from '@utils/fetch.js'

interface IProps {
  contentHeight: number,
  contentWidth: number
}

interface IState {
  loaded: boolean
}

class PieChart extends React.Component<IProps, IState> {

  echarts: HTMLDivElement | null
  myChart: any

  componentWillMount () {
    this.setState({ loaded: false })
  }

  componentDidMount () {
    Api.get('data/echarts.json').then(res => {
      this.setState({ loaded: true })
      this.myChart = Echarts.init(this.echarts)
      this.myChart.setOption(res)
      this.resize()
    })
  }

  componentWillReceiveProps () {
    this.resize()
  }

  componentWillUpdate () {
    this.resize()
  }

  resize = () => {
    if (this.myChart) { setTimeout(this.myChart.resize, 0) }
  }

  render () {
    return (
      <div className='pie-chart-wrapper'>
      {
        this.state.loaded ? (
          <div ref={dom => this.echarts = dom} className='echarts' />
        ) : (
          <div className='loader'/>
        )
      }
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
