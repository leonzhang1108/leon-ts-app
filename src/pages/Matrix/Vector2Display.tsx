
import * as React from 'react'
import Vector from './Vector'

interface IProps { 
  ventorList: number[][],
  step: number,
  width: number
}

class Vector2Display extends React.Component<IProps> {
  render() {
    const { step, ventorList, width } = this.props
    return (
      <div className='display' style={{width: step === 2 ? width : 0, opacity: step === 2 ? 1 : 0}}>
        <Vector ventorList={ventorList}/>
      </div>
    )
  }
}

export default Vector2Display
