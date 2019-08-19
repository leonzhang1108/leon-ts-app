
import Utils from '@utils'
import React from 'react'
import './index.less'
import initWebGL from './webGL'

interface IProps {
  height: number,
  width: number
}

class Painting extends React.Component<IProps> {
  canvas
  cancel
  componentDidMount() {
    this.cancel = initWebGL(this.canvas)
  }
  componentWillUnmount() {
    this.cancel && this.cancel()
  }

  render () {
    const { height, width } = this.props
    return <canvas ref={el => this.canvas = el} height={height} width={width}/>
  }
}

export default Utils.connect({
  component: Painting,
  mapStateToProps: state => ({
    height: state.common.contentHeight,
    width: state.common.contentWidth
  })
})
