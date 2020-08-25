import { common } from '@actions'
import Utils from '@utils'
import React from 'react'
import { bindActionCreators } from 'redux'
import ErrorBoundary from '@cpt/ErrorBoundary'
import './index.less'

interface IProps {
  actions: {
    onResize(v): void;
  };
}

class ContentWrapper extends React.Component<IProps> {
  content: HTMLDivElement | null

  onResize() {
    const root = document.getElementById('root')
    const width = root ? root.clientWidth : 0
    this.props.actions.onResize({
      contentHeight: (this.content && this.content.offsetHeight) || 0,
      contentWidth: (this.content && this.content.offsetWidth) || 0,
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
      <ErrorBoundary>
        <div className="content" ref={dom => (this.content = dom)}>
          {children}
        </div>
      </ErrorBoundary>
    )
  }
}

export default Utils.connect({
  component: ContentWrapper,
  mapDispatchToProps: dispatch => ({
    actions: bindActionCreators(
      {
        onResize: common.onResize
      },
      dispatch
    )
  })
})
