import Utils from '@utils'
import React from 'react'
import './index.less'
import initWebGL from './webGL'

interface IProps {
  height: number;
  width: number;
  isMobile: boolean;
}

class Painting extends React.Component<IProps> {
  canvas
  cancel
  componentDidMount() {
    this.cancel = initWebGL(this.canvas, this.props.isMobile)
  }
  componentWillUnmount() {
    this.cancel && this.cancel()
  }

  render() {
    const { height, width } = this.props
    return (
      <canvas ref={el => (this.canvas = el)} height={height} width={width} />
    )
  }
}

export default Utils.connect({
  component: Painting,
  mapStateToProps: state => ({
    isMobile: state.common.isMobile,
    height: state.common.contentHeight,
    width: state.common.contentWidth
  })
})
