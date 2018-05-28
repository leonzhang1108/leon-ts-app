
import * as React from 'react'
import Ventor from './Ventor'

interface IMatrixProps { 
  ventorList: number[][],
  editable: boolean,
  top: number,
  left: number,
  rotate: boolean,
  onInput(e): void
}

class Vector2 extends React.Component<IMatrixProps> {
  render() {
    return <Ventor {...this.props} ventor='v2'/>
  }
}

export default Vector2
