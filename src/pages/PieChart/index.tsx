
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
      title: {
        text: '某站点用户访问来源',
        subtext: '纯属虚构',
        x: 'center',
      },
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c} ({d}%)',
      },
      legend: {
        orient: 'vertical',
        left: 'left',
        data: ['直接访问', '邮件营销', '联盟广告', '视频广告', '搜索引擎'],
      },
      series: [
        {
          name: '访问来源',
          type: 'pie',
          radius: '55%',
          center: ['50%', '60%'],
          data: [
            { value: 335, name: '直接访问' },
            { value: 310, name: '邮件营销' },
            { value: 234, name: '联盟广告' },
            { value: 135, name: '视频广告' },
            { value: 1548, name: '搜索引擎' },
          ],
          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
        },
      ],
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
