
import * as React from 'react'
import './index.less'
import Echarts from 'echarts'
import Utils from '@utils'

interface IProps {
  contentHeight: number,
  contentWidth: number
}

class PieChart extends React.Component<IProps> {

  echarts: HTMLDivElement | null
  myChart: any

  getOptions = () => ({
    title: {
      text: 'DC Heros',
      subtext: 'fake data',
      x: 'center',
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b} : {c} ({d}%)',
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      data: ['Batman', 'Superman', 'WW', 'Aquaman', 'The Flash'],
    },
    series: [
      {
        name: '访问来源',
        type: 'pie',
        radius: '55%',
        center: ['50%', '60%'],
        data: [
          { value: 335, name: 'Superman' },
          { value: 310, name: 'WW' },
          { value: 234, name: 'Aquaman' },
          { value: 135, name: 'The Flash' },
          { value: 1548, name: 'Batman' },
        ],
        itemStyle: {
          emphasis: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          }
        }
      }
    ]
  })

  componentDidMount() {
    this.myChart = Echarts.init(this.echarts)
    this.myChart.setOption(this.getOptions())
    setTimeout(this.myChart.resize, 0)
  }

  componentWillUpdate() {
    setTimeout(this.myChart.resize, 0)
  }

  render() {
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
  }),
})
