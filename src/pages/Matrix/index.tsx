
import * as React from 'react'
// import * as ReactDOM from 'react-dom'
import './index.less'
import Vector1 from './Ventor1'
import Vector2 from './Ventor2'
import { Button } from 'antd'

interface IMatrixState { 
  v1: number[][],
  v2: number[][],
  editable: boolean,
  step: number,
  offset: number,
  top: number,
  left: number,
  level: number,
  rotate: boolean,
  bottomVisible: boolean
}

class Matrix extends React.Component<{}, IMatrixState> {

  dom
  dom2

  constructor(props) {
    super(props)
    this.state = {
      offset: 10,
      step: 0,
      level: 0,
      editable: true,
      v1: [
        [1, 2, 3, 1],
        [4, 5, 6, 1],
        [7, 8, 9, 1]
      ],
      v2: [
        [1, 2, 1,1,1],
        [4, 5, 1,1,1],
        [7, 8, 1,1,1],
        [10, 11, 1,1,1]
      ],
      top: 0,
      left: 0,
      rotate: false,
      bottomVisible: true
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

  doClick = () => {
    switch(this.state.step) {
      case 0:
        this.doMultiply()
        break
      case 1: 
        this.doStep()
        break
      default: 
        this.doMultiply()
    }
  }

  doStep = () => {
    const { level, v1 } = this.state
    const length = v1.length
    
    if (level <= length && level > -length) {
      this.setState({
        left: 48 * (level - 1 ),
        level: level - 1
      })
    } else {
      console.log('complete')
    }
  }

  doMultiply = () => {

    // const dom = ReactDOM.findDOMNode(this.dom) as HTMLElement
    // const height1 = dom.offsetHeight
    // const width1 = dom.offsetWidth

    // const dom2 = ReactDOM.findDOMNode(this.dom2) as HTMLElement
    // const height2 = dom2.offsetHeight
    // const width2 = dom2.offsetWidth

    this.setState({
      // top: height1 / 2 + width1 / 2 + this.state.offset,
      // editable: false,
      bottomVisible: false
    })

    setTimeout(() => {
      this.setState({
        // top: height2 + 48 - 2,
        // left: height1 / 2 + height2 / 2 ,
        rotate: true,
        step: 1,
        level: this.state.v1.length,
        bottomVisible: true
      })
    }, 700)
  }

  render() {
    let text = ''
    switch(this.state.step) {
      case 0:
        text = 'Multiply'
        break;
      case 1: 
        text = 'Next'
        break
      default: 
        text = 'Multiply'
    }

    return (
      <div className='matrix-wrapper'>
        <div className='matrix-content'>
          <Vector1 
            ref={el => this.dom = el} 
            ventorList={this.state.v1} editable={this.state.editable} 
            onInput={this.onInput}
          />
          <span>×</span>
          <Vector2 
            ref={el => this.dom2 = el} 
            ventorList={this.state.v2} 
            editable={this.state.editable} 
            onInput={this.onInput} top={this.state.top} left={this.state.left} 
            rotate={this.state.rotate}
          />
        </div>
        <div className='matrix-bottom' style={{opacity: this.state.bottomVisible ? 1 : 0}}>
          <Button type="primary" size='large' onClick={this.doClick}>{text}</Button>
        </div>
      </div>
    )
  }
}


export default Matrix
