import * as React from 'react'
import './index.less'
import Utils from '@utils'
import Tools from './tools'

const keyCode = {
  left: 37,
  up: 38,
  right: 39,
  down: 40
}

interface IPiece {
  x: number,
  y: number,
  v: number,
  id: number,
  merged?: boolean
}

interface IState {
  size: number,
  pieces: IPiece[],
  cached: {
    x: number,
    y: number
  }
}

interface IProp {
  isMobile: boolean
}

class Page2048 extends React.Component<IProp, IState> {

  gameContainer

  componentWillMount() {

    const pieces = []
    this.addRandom(pieces)
    this.addRandom(pieces)

    this.setState({
      size: 4,
      pieces,
      cached: {
        x: 0,
        y: 0
      }
    })

    document.addEventListener('keydown', this.keydown)
  }

  componentDidMount() {
    this.gameContainer.addEventListener('touchstart', this.touchstart)
    this.gameContainer.addEventListener('touchmove', this.touchmove)
    this.gameContainer.addEventListener('touchend', this.touchend)
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.keydown)
    this.gameContainer.removeEventListener('touchstart', this.touchstart)
    this.gameContainer.removeEventListener('touchmove', this.touchmove)
    this.gameContainer.removeEventListener('touchend', this.touchend)
  }

  removeMerged = f => {
    const { pieces: p } = this.state
    const pieces = p.filter(i => !i.merged)
    this.setState({ pieces }, f)
  }

  touchstart = e => {
    const { pageX, pageY } = e.changedTouches[0]
    this.setState({ cached: { x: pageX, y: pageY }})
  }

  touchmove = e => e.preventDefault()

  touchend = e => {
    const { x: sx, y: sy } = this.state.cached
    const { pageX : ex, pageY: ey } = e.changedTouches[0]
    let code = 0
    if (Math.abs(sx - ex) > Math.abs(sy - ey)) {
      code = sx - ex > 0 ? keyCode.left : keyCode.right
    } else if (Math.abs(sx - ex) < Math.abs(sy - ey)) {
      code = sy - ey > 0 ? keyCode.up : keyCode.down
    } else {
      return
    }
    this.doMove(code)
  }

  keydown = e => this.doMove(e.keyCode)

  doMove = code => {
    this.removeMerged(() => {
      const { pieces } = this.state
      let p: IPiece[] = pieces
      switch(code) {
        case keyCode.up:
          const { p: up, changed: uc } = Tools.moveUp(pieces)
          if (uc) { p = this.addRandom(up) }
          break
        case keyCode.down:
          const { p: dp, changed: dc } = Tools.moveDown(pieces)
          if (dc) { p = this.addRandom(dp) }
          break
        case keyCode.left:
          const { p: lp, changed: lc } = Tools.moveLeft(pieces)
          if (lc) { p = this.addRandom(lp) }
          break
        case keyCode.right:
          const { p: rp, changed: rc } = Tools.moveRight(pieces)
          if (rc) { p = this.addRandom(rp) }
          break
      }
      this.setState({ pieces: p })
    })
  }

  addRandom = p => {
    const i = this.doAddRandom(p)
    if (i) { p.push(i) }
    return p
  }

  doAddRandom = p => {
    if (p.length === 16) { return null}
    const x = Utils.random(0, 4)
    const y = Utils.random(0, 4)
    return p.some(i => i.x === x && i.y === y)
      ? this.doAddRandom(p)
      : { x, y, v: this.get4or2(), id: Math.random() }
  }

  get4or2 = () => Math.random() > .9 ? 4 : 2

  renderGrid = () => new Array(this.state.size).fill(null).map((v1, x) => (
    <div className='row' key={x}>
      {
        new Array(this.state.size).fill(null).map((v2, y) => (
          <div className='item' key={y}/>
        ))
      }
    </div>
  ))

  render() {
    const{ pieces } = this.state
    return (
      <div className='game2048-wrapper'>
        <div className='game2048-container' ref={dom => this.gameContainer = dom}>
          <div className='grid'>
            { this.renderGrid() }
          </div>
          <div className='piece-contanier'>
            {
              pieces.map(item => (
                <div className={`piece piece-${item.v} piece-position-${item.x}-${item.y} ${item.merged ? 'merged' : ''}`} key={item.id} >
                  <div className='item'>{item.v}</div>
                </div>
              ))
            }
          </div>
        </div>
      </div>
    )
  }
}

export default Page2048