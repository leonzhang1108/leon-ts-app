import { Breadcrumb, Layout } from 'antd'
import * as React from 'react'
// import { withRouter } from 'react-router-dom'
import './App.less'

import Menu from '@components/Menu'

const { Content, Footer, Sider } = Layout

class App extends React.Component {

  state = {
    collapsed: false
  }

  onCollapse = (collapsed:boolean) => {
    this.setState({ collapsed })
  }

  render() {
    return (
      <Layout style={{ minHeight: '100vh' }} className="app">
        <Sider
          style={{ overflow: 'auto', height: '100vh', position: 'fixed', left: 0 }}
          collapsible={true}
          collapsed={this.state.collapsed}
          onCollapse={this.onCollapse}
        >
          <Menu/>
        </Sider>
  
        <Layout style={{ marginLeft: !this.state.collapsed ? 200 : 80 }}>
          <Content style={{ margin: '0 16px' }}>
            <Breadcrumb style={{ margin: '16px 0' }}>
              <Breadcrumb.Item>User</Breadcrumb.Item>
              <Breadcrumb.Item>Bill</Breadcrumb.Item>
            </Breadcrumb>
            <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
              Bill is a cat.
            </div>
          </Content>
          <Footer style={{ textAlign: 'center' }}>
            BLOG ©2018 Created by Leon
          </Footer>
        </Layout>
      </Layout>
    )
  }
}

export default App
