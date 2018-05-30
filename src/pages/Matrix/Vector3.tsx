
import * as React from 'react'
import Vector from './Vector'

interface IProps { 
  ventorList: number[][] | undefined,
  hilightList: number[][] | undefined
}

class Vector3 extends React.Component<IProps> {
  render() {
    return (
      <div className='result'>
        <Vector {...this.props}/>
      </div>
    )
  }
}

export default Vector3
