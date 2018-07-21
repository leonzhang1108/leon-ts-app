import * as React from 'react'
import './index.less'

const keyCode = {
  left: 37,
  up: 38,
  right: 39,
  down: 40
}

interface IState {
  size: number,
  x: number,
  y: number,
  cached: {
    x: number,
    y: number
  }
}

interface IProp {
  isMobile: boolean
}

class Page2048 extends React.Component<IProp, IState> {

  grid

  componentWillMount() {
    this.setState({
      size: 4,
      x: 0,
      y: 0,
      cached: {
        x: 0,
        y: 0
      }
    })

    document.addEventListener('keydown', this.keydown)
  }

  componentDidMount() {
    this.grid.addEventListener('touchstart', this.touchstart)
    this.grid.addEventListener('touchmove', this.touchmove)
    this.grid.addEventListener('touchend', this.touchend)
  }

  touchstart = e => {
    const { pageX, pageY } = e.changedTouches[0]
    this.setState({ cached: { x: pageX, y: pageY }})
  }

  touchmove = e => e.stopPropagation()

  touchend = e => {
    const { x: sx, y: sy } = this.state.cached
    const { pageX : ex, pageY: ey } = e.changedTouches[0]
    let { x, y } = this.state
    
    if (Math.abs(sx - ex) > Math.abs(sy - ey)) {
      x = sx - ex > 0 ? 0 : 3
    } else {
      y = sy - ey > 0 ? 0 : 3
    }
    this.setState({ x, y })
  }

  componentWillUnmount() {
    document.removeEventListener('keydown',this.keydown)
    this.grid.removeEventListener('touchstart', this.touchstart)
    this.grid.removeEventListener('touchmove', this.touchmove)
    this.grid.removeEventListener('touchend', this.touchend)
  }

  keydown = e => {
    console.log('f')
    let { x, y } = this.state
    switch(e.keyCode) {
      case keyCode.up:
        y = 0
        break
      case keyCode.down:
        y = 3
        break
      case keyCode.left:
        x = 0
        break
      case keyCode.right:
        x = 3
        break
    }

    this.setState({ x, y })
  }

  renderGrid = () => new Array(this.state.size).fill(0).map((v1, x) => (
    <div className='row' key={x}>
      {
        new Array(this.state.size).fill(null).map((v2, y) => (
          <div className='item' key={y}/>
        ))
      }
    </div>
  ))

  render() {
    const{ x, y } = this.state
    return (
      <div className='game2048-wrapper'>
        <div className='game2048-container'>
          <div className='grid' ref={dom => this.grid = dom}>
            { this.renderGrid() }
          </div>
          <div className='piece-contanier'>
            <div className={`piece piece-position-${x}-${y}`} />
          </div>
        </div>
      </div>
    )
  }
}

export default Page2048