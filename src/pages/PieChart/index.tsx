
import * as React from 'react'
import './index.less'
import Echarts from 'echarts'
import Utils from '@utils'

interface IProps {
  contentHeight: number,
  contentWidth: Echarts
}

class PieChart extends React.Component<IProps> {

  echarts: HTMLDivElement | null
  myChart: any

  componentWillReceiveProps() {
    setTimeout(() => this.myChart.resize(), 0)
  }

  componentDidMount() {
    this.myChart = Echarts.init(this.echarts)

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

    this.myChart.setOption(option)
  }

  render() {
    const { contentHeight: height, contentWidth: width } = this.props
    return (
      <div ref={dom => this.echarts = dom} className='echarts' style={{height: `${height}px`, width: `${width}px`}} />
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
