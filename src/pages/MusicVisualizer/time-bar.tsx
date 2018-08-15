
import * as React from 'react'
import { Slider } from 'antd'

interface IProps {
  totalTime: number,
  slideDuration: number | null,
  durationOffset: number,
  curr: number,
  durationChanging: (v: number) => void,
  durationChanged: (v: number) => void,
  formatTime: () => string
}

class Time extends React.Component<IProps> {
  render () {
    const { totalTime, slideDuration, durationOffset, curr, durationChanging, durationChanged, formatTime } = this.props
    return (
      <div className='time-zone'>
        <Slider className='duration-slider'
          value={totalTime ? (parseInt((slideDuration || durationOffset) + '', 10) + curr) % 100 : 0}
          onChange={durationChanging}
          onAfterChange={durationChanged}
          tipFormatter={null}
        />
        <div>{formatTime()}</div>
      </div>
    )
  }
}
export default Time
