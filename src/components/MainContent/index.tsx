import * as React from 'react'
import './index.less'
import { Layout } from 'antd'
import Utils from '@utils'
import { bindActionCreators } from 'redux'
import { common } from '@actions'

interface IProps {
  collapsed: boolean,
  isMobile: boolean,
  actions: {
    toggleCollapse (): void
  }
}

class MainContent extends React.Component<IProps> {
  toggleCollapse = () => {
    this.props.actions.toggleCollapse()
  }

  render () {
    const { children, collapsed, isMobile } = this.props
    const className = isMobile && collapsed ? 'mask' : ''
    return (
      <Layout style={{
        marginLeft: isMobile ? 0 : !collapsed ? 200 : 80,
        height: '100%',
        transform: `translateX(${ isMobile ? collapsed ? 100 : 0 : 0 }px)`
      }}>
        { isMobile ? <div className={className} onClick={this.toggleCollapse}/> : '' }
        { children }
      </Layout>
    )
  }
}

export default Utils.connect({
  component: MainContent,
  mapStateToProps: state => ({
    collapsed: state.common.collapsed,
    isMobile: state.common.isMobile
  }),
  mapDispatchToProps: dispatch => ({
    actions: bindActionCreators({
      toggleCollapse: common.toggleCollapse
    }, dispatch)
  })
})
