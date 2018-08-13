
import * as React from 'react'
import Vector from './Vector'

const getStyle = props => ({
  width: props.step === 2 ? props.width : 0,
  opacity: props.step === 2 ? 1 : 0
})

const Vector2Display = props => (
  <div className='display' style={getStyle(props)}>
    <Vector ventorList={props.ventorList}/>
  </div>
)

export default Vector2Display
