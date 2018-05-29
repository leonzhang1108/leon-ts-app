
import * as React from 'react'
import Vector from './Vector'

interface IMatrixProps { 
  ventorList: number[][] | undefined
}

class Vector3 extends React.Component<IMatrixProps> {
  render() {
    return <Vector {...this.props} style={{position: 'absolute', right: '0'}}/>
  }
}

export default Vector3
