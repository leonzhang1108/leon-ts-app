import * as React from 'react'
import './index.less'

interface IState {
  top: number
}

class Home extends React.Component<{}, IState> {

  wrapper

  componentWillMount () {
    this.setState({ top: 0 })
  }

  componentDidMount () {
    this.wrapper.addEventListener('scroll', e => {
      this.setState({ top: e.target.scrollTop })
    })
  }
  render () {
    const { top } = this.state
    let v = 2000 - top / 3300 * 2000
    v = v > 0 ? v : 0

    const style = {
      strokeDashoffset: v
    }

    return (
      <div className='home-wrapper' ref={dom => this.wrapper = dom}>
        <div className='svg-wrapper'>
          <svg viewBox='0 0 240.7 341.2' version='1.1'>
            <g stroke='#000' strokeWidth='3' fill='none'>
              <path style={style} d='M155.4,254.1c-2.8-15,0-47.6,0.2-91.1c-42.5,3.2-83.9,15.7-83.9,15.7l-5-3.8C58.5,167,24,158.5,24,158.5
            c-1.2-4.7,4.7-32.2,4.7-32.2c1.8,27.7,17.2,30.4,17.2,30.4c12.2,0,17.2-10.1,17.2-10.1c-9.8,1.5-34.5-22.3-34.5-22.3
            s4.1-19.3,12.2-28.4c62.1-57.7,111.9,10.6,111.9,10.6S187.8,17.9,200,1.7c-25.3,327.5,40.6,301.1,40.6,301.1s-71.2,16.7-118,33.5
            c-46.8,16.8-121.4-20-121.4-20s26.6-14.7,41.1-16.8c14.5-2,9.2-36.4,9.2-36.4' />
              <path style={style} d='M95.2,149.4c0,0,51.8-18.6,55.5-24.2c0,0-18.2,29.2-24.6,30.9S108.3,160.9,95.2,149.4z' />
              <path style={style} d='M167,71.5c0,0-98.7-37.4-128.1,26c0,0-2.4-70.7,23.4-95.8c0,0,1,58.2,8.1,64.6' />
              <path style={style} d='M24,158.5l4.3,97.9c0,0,27.8,14.5,85,7.6s59.3-24,59.3-24s-6.7,65.7,28.6,64.5c0,0-31.8,23.2-83.8,23.2
            c0,0,28.2-9.4,25.8-69.3' />
              <path style={style} d='M60.5,219.7c0,0,12.8-2.6,34.7,1.3' />
              <path style={style} d='M118.8,188.1c0,0,10.6,10.9,12.6,23.2'/>
            </g>
          </svg>
        </div>
        <div className='scroll-wrapper'>
          <div className='top anticon anticon-arrow-up'/>
          <div className='bottom'>Where is Martha!!! </div>
        </div>
      </div>
    )
  }
}

export default Home
