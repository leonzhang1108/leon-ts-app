import * as React from 'react'
import Utils from '@utils'
import './index.less'

interface IProps {
  isMobile: boolean
}

interface IState {
  blocksKey: string | number | undefined
}

class MondrianArt extends React.Component<IProps, IState> {
  interval
  colorMap = {
    0: 'rgb(248, 217, 45)',
    1: 'rgb(248, 217, 45)',
    2: 'rgb(242, 245, 241)',
    3: 'rgb(11, 84, 164)',
    4: 'rgb(214, 0, 20)',
    5: 'rgb(11, 84, 164)'
  }
  constructor (props) {
    super(props)
    this.state = {
      blocksKey: 1
    }
  }

  componentDidMount () {
    this.interval = setInterval(
      () =>
        this.setState({
          blocksKey: this.state.blocksKey ? 0 : 1
        }),
      5000
    )
  }

  componentWillUnmount () {
    clearInterval(this.interval)
  }

  generateBlocks = () => {
    return Array.from(Array(20).keys()).map(i => (
      <div
        key={i}
        className={`block-${i}`}
        style={{
          animationDelay: `${i * 0.15}s`,
          gridColumn: `span ${Math.floor(Math.random() * 3 + 1)}`,
          gridRow: `span ${Math.floor(Math.random() * 3 + 1)}`,
          backgroundColor: this.colorMap[Math.floor(Math.random() * 5)]
        }}
      />
    ))
  }
  render () {
    const { blocksKey } = this.state
    const { isMobile } = this.props
    return (
      <div className='mondrian-wrapper'>
        <div className='mondrian-inner-wrapper'>
          <div
            key={blocksKey}
            className='mondrian-art'
            style={{
              height: isMobile ? '310px' : '310px',
              width: isMobile ? '250px' : '790px'
            }}
          >
            {this.generateBlocks()}
          </div>
        </div>
      </div>
    )
  }
}

export default Utils.connect({
  component: MondrianArt,
  mapStateToProps: state => ({
    isMobile: state.common.isMobile
  })
})
