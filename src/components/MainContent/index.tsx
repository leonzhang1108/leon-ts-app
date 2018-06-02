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
    return (
      <Layout style={{ marginLeft: isMobile ? !collapsed ? 200 : 80 : 0, height: '100%' }}>
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