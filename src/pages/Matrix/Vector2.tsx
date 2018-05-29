
import * as React from 'react'
import Vector from './Vector'

interface IMatrixProps { 
  ventorList: number[][],
  editable: boolean,
  top: number,
  left: number,
  rotate: boolean,
  transformCol: any,
  onInput(e): void
}

class Vector2 extends React.Component<IMatrixProps> {
  render() {
    return <Vector {...this.props} ventor='v2'/>
  }
}

export default Vector2
