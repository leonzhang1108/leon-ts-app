
import * as React from 'react'
import Vector from './Vector'

interface IProps { 
  ventorList: number[][],
  editable: boolean,
  top: number,
  left: number,
  opacity: number,
  rotate: boolean,
  transformCol: any,
  onInput(e): void
}

class Vector2 extends React.Component<IProps> {
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
