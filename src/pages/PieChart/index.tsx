
import * as React from 'react'
import './index.less'
import ReactEcharts from 'echarts-for-react'

class PieChart extends React.Component {

  getOptions() {
    return {
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
        data: ['Superman', 'WW', 'Aquaman', 'The Flash', 'Batman'],
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
            },
          },
        },
      ],
    }
  }

  render() {
    return (
      <div className='pie-chart-wrapper'>
        <ReactEcharts
          option={this.getOptions()}
          style={{ height: '100%' }}
          className="react_for_echarts"
          theme="macarons"
        />
      </div>
    )
  }
}



export default PieChart