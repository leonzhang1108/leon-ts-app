import * as React from 'react'
import './index.less'
import { Layout } from 'antd'
import Utils from '@utils'

interface IProps {
  collapsed: boolean,
  actions: {
    toggleCollapse(): void
  }
}

class MainContent extends React.Component<IProps> {
  render() {
    const { children, collapsed } = this.props
    return (
      <Layout style={{ marginLeft: !collapsed ? 200 : 80, height: '100%' }}>
        { children }
      </Layout>
    )
  }
}

export default Utils.connect({
  component: MainContent,
  mapStateToProps: state => ({
    collapsed: state.common.collapsed
  })
})