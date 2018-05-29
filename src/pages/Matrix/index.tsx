
import * as React from 'react'
import * as ReactDOM from 'react-dom'
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
  height1: number,
  width1: number,
  height2: number,
  width2: number,
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
        [7, 8, 9, 1],
        [7, 8, 9, 1],
        [7, 8, 9, 1]
      ],
      v2: [
        [1, 2, 5, 6, 1],
        [4, 5, 5, 6, 1],
        [7, 8, 5, 6, 1],
        [10, 11, 5, 6, 1]
      ],
      top: 0,
      left: 0,
      rotate: false,
      bottomVisible: true,
      height1: 0,
      width1: 0,
      height2: 0,
      width2: 0,
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
    const { level, height1, width1, height2, width2 } = this.state
    const left = height1 / 2 + width1 / 2 + (width2 - height2) / 2
    const total = this.state.v1.length + this.state.v2[0].length - 1

    if (level) {
      const currentLevel = level - 1
      this.setState({
        left: left - 48 * (total - currentLevel),
        level: currentLevel
      })
    }
  }

  doMultiply = () => {

    const dom = ReactDOM.findDOMNode(this.dom) as HTMLElement
    const height1 = dom.offsetHeight
    const width1 = dom.offsetWidth

    const dom2 = ReactDOM.findDOMNode(this.dom2) as HTMLElement
    const height2 = dom2.offsetHeight
    const width2 = dom2.offsetWidth

    this.setState({
      top: height1 / 2 + width1 / 2 + this.state.offset,
      editable: false,
      bottomVisible: false,
      height1, width1, height2, width2
    })

    setTimeout(() => {
      this.setState({
        top: width1 + (width2 - height2) / 2 + 50,
        left: height1 / 2 + width1 / 2 + (width2 - height2) / 2 + this.state.offset,
        rotate: true,
        step: 1,
        level: this.state.v1.length + this.state.v2[0].length - 1,
        bottomVisible: true
      })
    }, 600)
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
