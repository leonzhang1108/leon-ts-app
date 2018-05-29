
import * as React from 'react'
import Vector from './Vector'

interface IMatrixProps { 
  ventorList: number[][] | undefined,
  hilightList: number[][] | undefined
}

class Vector3 extends React.Component<IMatrixProps> {
  render() {
    return (
      <div className='result'>
        <Vector {...this.props} result={true}/>
      </div>
    )
  }
}

export default Vector3
