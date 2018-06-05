import * as React from 'react'
import './index.less'
import { Layout } from 'antd'
import Utils from '@utils'

interface IProps {
  collapsed: boolean,
  isMobile: boolean,
  actions: {
    toggleCollapse(): void
  }
}

class MainContent extends React.Component<IProps> {
  render() {
    const { children, collapsed, isMobile } = this.props
    console.log(isMobile)
    return (
      <Layout style={{ marginLeft: isMobile ? 0 : !collapsed ? 200 : 80, height: '100%', transform: `translateX(${ isMobile ? collapsed ? 100 : 0 : 0 }px)` }}>
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
  })
})