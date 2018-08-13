
import * as React from 'react'
import Vector from './Vector'

interface IProps {
  ventorList: number[][],
  editable: boolean,
  top: number,
  left: number,
  opacity: number,
  v2Opacity: number,
  rotate: boolean,
  transformCol: any,
  btnEdit (e): void,
  onBlur (e): void,
  onInput (e): void
}

class Vector2 extends React.Component<IProps> {
  render () {
    const { opacity, btnEdit, v2Opacity } = this.props
    return (
      <div className='v-wrapper'>
        <div className='v-inner'>
          <div className='display' style={{ opacity: v2Opacity }}>
            <Vector {...this.props} ventor='v2'/>
          </div>
          <div className='btn-wrapper horizontal' style={{ opacity }}>
            <div className='btn' data-id='5' onClick={btnEdit}>-</div>
            <div className='btn' data-id='6' onClick={btnEdit}>+</div>
          </div>
        </div>
        <div className='btn-wrapper vertical right' style={{ opacity }}>
          <div className='btn' data-id='3' onClick={btnEdit}>-</div>
          <div className='btn' data-id='4' onClick={btnEdit}>+</div>
        </div>
      </div>
    )
  }
}

export default Vector2
