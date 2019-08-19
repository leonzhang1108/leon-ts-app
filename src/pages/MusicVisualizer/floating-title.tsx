import React from 'react'
interface IProps {
  musicName: string
}

interface IState {
  wrapperWidth: number,
  width: number,
  offset: number,
  onOff: boolean,
  offsetWidth: number
}

class FloatingTitle extends React.Component<IProps, IState> {

  dom
  wrapper
  interval

  constructor (props) {
    super(props)
    this.state = {
      width: 0,
      offset: 0,
      onOff: false,
      offsetWidth: 0,
      wrapperWidth: 0
    }
  }

  componentDidMount () {
    this.setState({ wrapperWidth: this.wrapper.offsetWidth })
    this.doInterval()
  }

  componentWillUnmount () {
    this.clearInterval()
  }

  componentWillReceiveProps () {
    const { width } = this.state
    if (this.dom.offsetWidth !== width) {
      let offsetWidth = (this.wrapper.offsetWidth - this.dom.offsetWidth)
      offsetWidth = offsetWidth <= 0 ? offsetWidth : 0
      this.setState({
        width: this.dom.offsetWidth,
        offsetWidth,
        onOff: false
      })
    }
  }

  doInterval = () => {
    this.interval = setInterval(() => {
      this.intervalContent()
    }, 3000)
  }

  intervalContent = () => {
    const { onOff, offsetWidth } = this.state
    this.setState({
      onOff: !onOff,
      offset: onOff ? 0 : offsetWidth
    })
  }

  clearInterval = () => {
    if (this.interval) { clearInterval(this.interval) }
  }

  render () {
    const { musicName } = this.props
    const { offset, offsetWidth } = this.state

    return (
      <div className={`music-name ${offsetWidth === 0 ? 'flex' : ''}`} ref={ref => { this.wrapper = ref }}>
        <div style={{ transform: `translateX(${offset}px)` }} className='content' ref={ref => { this.dom = ref }}>{musicName}</div>
      </div>
    )
  }
}
export default FloatingTitle
