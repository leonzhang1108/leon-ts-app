
import * as React from 'react'
import Vector from './Vector'

interface IMatrixProps { 
  ventorList: number[][],
  editable: boolean,
  top: number,
  left: number,
  opacity: number,
  rotate: boolean,
  transformCol: any,
  onInput(e): void
}

class Vector2 extends React.Component<IMatrixProps> {
  render() {
    const { opacity } = this.props
    return (
      <div className='display' style={{opacity}}>
        <Vector {...this.props} ventor='v2'/>
      </div>
    )
  }
}

export default Vector2
