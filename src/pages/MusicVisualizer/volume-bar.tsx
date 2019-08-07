
import { Slider } from 'antd'
import React from 'react'

interface IProps {
  pause: boolean,
  mute: boolean,
  setMute: () => void,
  changeVolume: (v: number) => void,
  togglePause: () => void
}

class Volume extends React.Component<IProps> {
  render () {
    const { changeVolume, togglePause, pause, setMute, mute } = this.props
    return (
      <div className='volume-zone'>
        <div className={`icon anticon anticon-ts-app icon-${mute ? 'mute' : 'volume'}`} onClick={setMute}/>
        <Slider className='slider' defaultValue={77} onChange={changeVolume} tipFormatter={null} disabled={mute}/>
        <div onClick={togglePause} className={`icon anticon anticon-ts-app icon-${pause ? 'play' : 'pause'}`} />
      </div>
    )
  }
}
export default Volume
