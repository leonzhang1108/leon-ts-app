
import * as React from 'react'
import './index.less'
import * as d3 from 'd3'
import * as flubber from 'flubber'
import Utils from '@utils'

interface IProps {
  h: number,
  w: number
}

class BatLogo extends React.Component<IProps> {

  componentDidMount () {
    const pathStrings = Array.from(document.querySelectorAll('path')).map(d => d.getAttribute('d'))
    const animate = sel => {
      const start = pathStrings.shift() || ''
      const end = pathStrings[0]
      pathStrings.push(start)
      sel
        .datum({ start, end })
        .transition()
        .duration(1500)
        .attrTween('d', d => flubber.interpolate(d.start, d.end, { maxSegmentLength: 0.1 }))
        .on('end', () => sel.call(animate))
    }

    d3.selectAll('path')
      .filter((d, i) => i)
      .remove()

    d3.select('path')
      .style('display', 'block')
      .call(animate)
  }

  componentWillUnmount () {
    d3.selectAll('path').transition()
  }

  render () {
    const { h, w } = this.props
    return (
      <div className='bat-logo-wrapper'>
        <svg xmlns='http://www.w3.org/2000/svg' width={w} height={h}>
          <g transform={`translate(${w / 2 - 115} ${h / 2 - 100}) scale(10)`}>
            <path d='M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z'/>
            <path d='M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z'/>
            <path d='M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z'/>
          </g>
        </svg>
      </div>
    )
  }
}

export default Utils.connect({
  component: BatLogo,
  mapStateToProps: state => ({
    w: state.common.contentWidth,
    h: state.common.contentHeight
  })
})
