
import * as React from 'react'
import './index.less'
import Vector1 from './Ventor1'
import Vector2 from './Ventor2'
import { Button } from 'antd'

interface IMatrixState { 
  v1: number[][],
  v2: number[][],
  editable: boolean,
  top: number,
  left: number,
  rotate: boolean
}

class Matrix extends React.Component<{}, IMatrixState> {
  

  dom

  constructor(props) {
    super(props)
    this.state = {
      editable: true,
      v1: [
        [1, 2, 3, 1],
        [4, 5, 6, 1],
        [7, 8, 9, 1]
      ],
      v2: [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
        [10, 11, 12]
      ],
      top: 0,
      left: 0,
      rotate: false
    }
  }

  onInput = e => {
    const col = e.target.getAttribute('data-col')
    const row = e.target.getAttribute('data-row')
    const ventor = e.target.getAttribute('data-ventor')
    const v = this.state[ventor]
    v[row][col] = e.target.value
    this.setState({ [v]: v })
  }

  doMultiply = () => {
    console.log(this)
  }

  render() {
    return (
      <div className='matrix-wrapper'>
        <div className='matrix-content'>
          <Vector1 ventorList={this.state.v1} editable={this.state.editable} onInput={this.onInput}/>
          <span>×</span>
          <Vector2 ventorList={this.state.v2} editable={this.state.editable} onInput={this.onInput}/>
        </div>
        <div className='matrix-bottom'>
          <Button type="primary" size='large' onClick={this.doMultiply}>Multiply</Button>
        </div>
      </div>
    )
  }
}


export default Matrix
