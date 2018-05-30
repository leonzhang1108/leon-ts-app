
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import './index.less'
import Vector1 from './Vector1'
import Vector2 from './Vector2'
import Vector2Display from './Vector2Display'
import Vector3 from './Vector3'
import { Button } from 'antd'

interface IMatrixState { 
  v1: number[][],
  v2: number[][],
  v3?: number[][],
  v3Hilight?: number[][],
  editable: boolean,
  step: number,
  offset: number,
  cubeSize: number,
  top: number,
  left: number,
  level: number,
  height1: number,
  width1: number,
  height2: number,
  width2: number,
  rotate: boolean,
  v2Opacity: number,
  bottomDisable: boolean,
  transformRow?: {
    start: number,
    end: number
  },
  transformCol?: {
    start: number,
    end: number
  }
}

class Matrix extends React.Component<{}, IMatrixState> {

  dom
  dom2
  span

  constructor(props) {
    super(props)
    this.reset(true)
  }

  reset(isInit?) {
    const initObj = {
      offset: 10,
      cubeSize: 50,
      step: 0,
      level: 0, 
      editable: true,
      v1: [
        [1, 2, 3],  
        [1, 2, 3],
        [1, 2, 3]
      ],
      v2: [
        [1, 0, 0],
        [0, 1, 0],
        [0, 0, 1]
      ],
      v3: undefined,
      v3Hilight: undefined,
      top: 0,
      left: 0,
      rotate: false,
      bottomDisable: false,
      height1: 0,
      width1: 0,
      height2: 0,
      width2: 0,
      v2Opacity: 1
    }
    if (isInit) {
      this.state = initObj
    } else {
      const { v1, v2 } = this.state
      this.setState({
        ...initObj,
        v1, v2
      })
    }
  }

  onInput = e => {
    const { v, col, row } = this.getInputValue(e)
    v[row][col] = e.target.value
    this.setState({ [v]: v })
  }

  onBlur = e => {
    const { v, col, row } = this.getInputValue(e)
    if (this.isNumber(e.target.value)) {
      v[row][col] = e.target.value !== '0' 
        ? e.target.value.replace(/\b(0+)/gi,"") 
        : e.target.value
    } else {
      v[row][col] = 1
    }
    this.setState({ [v]: v })
  }

  getInputValue = e => {
    const col = e.target.getAttribute('data-col')
    const row = e.target.getAttribute('data-row')
    const ventor = e.target.getAttribute('data-ventor')
    const v = this.state[ventor]
    return { v, col, row }
  }

  isNumber = v => !(/^(-)?\d+(\.\d+)?$/.exec(v) === null || v === "")

  doClick = () => {
    switch(this.state.step) {
      case 0:
        this.doMultiply()
        break
      case 1: 
        this.doStep()
        break
      case 2: 
        this.reset()
        break
      default: 
        this.doMultiply()
    }
  }

  doAutoComplete = async() => {
    const { level, step } = this.state
    if (level >= 0 && step === 1) {
      await this.doStep()
      this.doAutoComplete()
    }
  }

  doStep = async() => {
    await new Promise(resolve => {
      const { level, height1, width1, height2, width2, cubeSize } = this.state
      const left = height1 / 2 + width1 / 2 + (width2 - height2) / 2 - 2
      const total = this.state.v1.length + this.state.v2[0].length - 1
      const currentLevel = level - 1
      const rowStart = total - currentLevel - (width2 - 2) / cubeSize
      const colStart = total - currentLevel - (height1 - 2) / cubeSize
      const end = total - currentLevel - 1
  
      if (level) {
        this.setState({
          left: left - cubeSize * (total - currentLevel),
          level: currentLevel,
          transformRow: { start: rowStart, end },
          transformCol: { start: colStart, end },
          bottomDisable: true
        })
        this.doCalculate(total - currentLevel)
        setTimeout(() => {
          this.setState({ bottomDisable: false })
          resolve()
        }, 300)
      } else {
        this.setState({
          left: this.state.left - cubeSize,
          v3Hilight: this.refreshV3Hilight(),
          transformRow: { start: rowStart, end },
          transformCol: { start: colStart, end },
          v2Opacity: 0,
          bottomDisable: true
        })
        setTimeout(() => {
          this.setState({
            step: 2,
            transformRow: undefined,
            transformCol: undefined,
            rotate: false,
            top: 0,
            left: 0,
            bottomDisable: false
          })
          resolve()
        }, 600)
      }
    })
    
  }

  doMultiply = () => {
    const dom = ReactDOM.findDOMNode(this.dom) as HTMLElement
    const height1 = dom.offsetHeight
    const width1 = dom.offsetWidth
    const dom2 = ReactDOM.findDOMNode(this.dom2) as HTMLElement
    const height2 = dom2.offsetHeight
    const width2 = dom2.offsetWidth
    const span = ReactDOM.findDOMNode(this.span) as HTMLElement
    const spanWidth = span.offsetWidth

    this.setState({
      top: height1 / 2 + width1 / 2 + this.state.offset,
      editable: false,
      bottomDisable: true,
      step: 1,
      height1, width1, height2, width2
    })

    setTimeout(() => {
      this.setState({
        top: width1 + (width2 - height2) / 2 + spanWidth,
        left: height1 / 2 + width1 / 2 + (width2 - height2) / 2 + this.state.offset,
        rotate: true,
        level: this.state.v1.length + this.state.v2[0].length - 1,
        bottomDisable: false
      })
      this.doCalculateV3Size()
    }, 600)
  }

  doCalculateV3Size = () => {
    const { v1, v2 } = this.state
    const v3: number[][] = []
    const v3Hilight: number[][] = []
    v1.forEach(() => {
      const res:any[] = []
      v2[0].forEach(() => res.push(''))
      v3.push(res)
      v3Hilight.push(res.map(() => 0))
    })
    this.setState({ v3, v3Hilight })
  }

  doCalculate = index => {
    const { v1, v2, v3 } = this.state
    const forIndex = --index
    const v3Hilight = this.refreshV3Hilight()
    for (let i = 0; i <= forIndex; i++) {
      let res = 0
      if (!v3 || index < v3.length) {
        v1[index].forEach((v, idx) => 
          res += v * v2[idx][i]
        )
        if (v3 && index < v3.length && i < v3[0].length) {
          this.setResult(res, index, i)
          if (v3Hilight) {
            v3Hilight[index][i] = 1
          }
        }
      }
      index--
    }
    this.setState({ v3Hilight })
  }

  refreshV3Hilight = () => this.state.v3Hilight && this.state.v3Hilight.map(list => list.map(() => 0))

  setResult = (v, x, y) => {
    const { v3 } = this.state
    if (v3) { 
      v3[x][y] = v 
    }
    this.setState({ v3 })
  }

  btnEdit = e => {
    const id = e.target.getAttribute('data-id')
    const { v1, v2, step } = this.state
    if (step !== 0) {
      return
    }
    switch(Number(id)) {
      case 1: 
        this.setState({ v1: this.deleteRow(v1) })
        break
      case 2: 
        this.setState({ v1: this.addRow(v1) })
        break
      case 3:
        this.setState({ 
          v1: this.deleteCol(v1), 
          v2: this.deleteRow(v2)
        })
        break
      case 4:
        this.setState({ 
          v1: this.addCol(v1), 
          v2: this.addRow(v2)
        })
        break
      case 5: 
        this.setState({ v2: this.deleteCol(v2) })
        break
      case 6: 
        this.setState({ v2: this.addCol(v2) })
        break
      default:
    }
  }

  addRow = v => {
    v.push(v[0].map(() => 1))
    return v
  }

  deleteRow = v => {
    if (v.length > 1) {
      v.splice(v.length - 1, 1)
    }
    return v
  }

  addCol = v => {
    v.map(list => list.push(1))
    return v
  }

  deleteCol = v => {
    v.map(list => list.length > 1 && list.splice(list.length - 1, 1))
    return v
  }

  render() {
    let text = ''
    let symbol = ''
    let opacity = 0
    switch(this.state.step) {
      case 0:
        text = 'Multiply'
        symbol = '×'
        opacity = 1
        break;
      case 1: 
        text = 'Next'
        symbol = '='
        opacity = 0
        break
      case 2: 
        text = 'Reset'
        symbol = '×'
        opacity = 0
        break
      default: 
        text = 'Multiply'
        symbol = '×'
        opacity = 1
    }

    return (
      <div className='matrix-wrapper'>
        <div className='matrix-content'>
          <Vector1 
            ref={el => this.dom = el} 
            ventorList={this.state.v1} editable={this.state.editable} 
            onInput={this.onInput}
            onBlur={this.onBlur} 
            transformRow={this.state.transformRow}
            opacity={opacity}
            btnEdit={this.btnEdit}
          />
          <span ref={el => this.span = el}>{symbol}</span>
          <Vector2Display 
            ventorList={this.state.v2}
            step={this.state.step}
            width={this.state.width2}
          />
          <Vector2 
            ref={el => this.dom2 = el} 
            ventorList={this.state.v2} 
            editable={this.state.editable} 
            onInput={this.onInput} 
            onBlur={this.onBlur} 
            top={this.state.top} 
            left={this.state.left} 
            rotate={this.state.rotate}
            opacity={opacity}
            v2Opacity={this.state.v2Opacity}
            btnEdit={this.btnEdit}
            transformCol={this.state.transformCol}
          />
          {
            this.state.step === 2
              ? <span style={{transform: `translateX(${-this.state.width2}px)`}}>=</span>
              : ''
          }
          <Vector3 ventorList={this.state.v3} hilightList={this.state.v3Hilight}/>
        </div>
        <div className='matrix-bottom'>
          <Button disabled={this.state.bottomDisable} type="primary" size='large' onClick={this.doClick}>{text}</Button>
          {
            this.state.step === 1 
              ? <Button disabled={this.state.bottomDisable} type="primary" size='large' onClick={this.doAutoComplete}>Auto Complete</Button>
              : ''
          }
        </div>
      </div>
    )
  }
}

export default Matrix
