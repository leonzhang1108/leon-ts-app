
import * as React from 'react'
import './index.less'
import Echarts from 'echarts'

class PieChart extends React.Component {

  echarts: any

  componentDidMount() {
    const myChart = Echarts.init(this.echarts)

    const option = {
      angleAxis: {
      },
      radiusAxis: {
        type: 'category',
        data: ['周一', '周二', '周三', '周四'],
        z: 10
      },
      polar: {
      },
      series: [{
        type: 'bar',
        data: [1, 2, 3, 4],
        coordinateSystem: 'polar',
        name: 'A',
        stack: 'a'
      }, {
        type: 'bar',
        data: [2, 4, 6, 8],
        coordinateSystem: 'polar',
        name: 'B',
        stack: 'a'
      }, {
        type: 'bar',
        data: [1, 2, 3, 4],
        coordinateSystem: 'polar',
        name: 'C',
        stack: 'a'
      }],
      legend: {
        show: true,
        data: ['A', 'B', 'C']
      }
    }

    myChart.setOption(option)
  }

  render() {
    return (
      <div ref={ref => this.echarts = ref} className='echarts' />
    )
  }
}


export default PieChart
