
import * as React from 'react'
import { Slider } from 'antd'

interface IProps {
  pause: boolean,
  changeVolumn: (v: number) => void,
  togglePause: () => void
}

class Volumn extends React.Component<IProps> {
  render () {
    return (
      <div className='volumn-zone'>
        <div className='icon anticon anticon-ts-app icon-volumn' />
        <Slider className='slider' defaultValue={77} onChange={this.props.changeVolumn} tipFormatter={null} />
        <div onClick={this.props.togglePause} className={`icon anticon anticon-ts-app icon-${this.props.pause ? 'play' : 'pause'}`} />
      </div>
    )
  }
}
export default Volumn
