
import * as React from 'react'
import Vector from './Vector'

interface IProps { 
  ventorList: number[][],
  editable: boolean,
  transformRow: any,
  onInput(e): void
}

class Vector1 extends React.Component<IProps> {
  render() {
    return <Vector {...this.props} ventor='v1' hasShadow={true}/>
  }
}

export default Vector1
