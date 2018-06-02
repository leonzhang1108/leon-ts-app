import * as React from 'react'
import './index.less'
import Utils from '@utils'
import { common } from '@actions'
import { bindActionCreators } from 'redux'

interface IProps {
  actions: {
    onResize(v): void
  }
}

class ContentWrapper extends React.Component<IProps> {

  content: HTMLDivElement | null

  onResize() {
    const root = document.getElementById('root')
    const width = root ? root.clientWidth : 0
    this.props.actions.onResize({
      contentHeight: this.content && this.content.offsetHeight || 0,
      contentWidth: this.content && this.content.offsetWidth || 0,
      width
    })
  }

  componentDidMount() {
    this.onResize()
    window.onresize = Utils.debounce(this.onResize.bind(this), 300)
  }

  render() {
    const { children } = this.props
    return (
      <div className='content' ref={dom => this.content = dom}>
        { children }
      </div>
    )
  }
}

export default Utils.connect({
  component: ContentWrapper,
  mapDispatchToProps: dispatch => ({
    actions: bindActionCreators({
      onResize: common.onResize
    }, dispatch)
  })
})