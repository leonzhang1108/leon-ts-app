
import Utils from '@utils'
import Echarts from '@cpt/echarts'
import * as React from 'react'
import './index.less'

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
    this.getOption()
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

  async getOption() {
    const res = await require('./echarts.json')
    this.setState({ loaded: true })
    this.myChart = Echarts.init(this.echarts)
    this.myChart.setOption(res)
    this.resize()
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
