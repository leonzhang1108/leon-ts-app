
import * as React from 'react'
import Vector from './Vector'

interface IMatrixProps { 
  ventorList: number[][],
  step: number,
  width: number
}

class Vector2Display extends React.Component<IMatrixProps> {
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
