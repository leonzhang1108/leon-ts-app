
import * as React from 'react'
import Vector from './Vector'

const Vector2Display = props => (
  <div className='display' style={{
    width: props.step === 2 ? props.width : 0, 
    opacity: props.step === 2 ? 1 : 0
  }}>
    <Vector ventorList={props.ventorList}/>
  </div>
)

export default Vector2Display
