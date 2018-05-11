import { Layout } from 'antd'
import * as React from 'react'
import './App.less'
import Menu from '@components/Menu'
import Breadcrumb from '@components/Breadcrumb'
import Router from '@pages/router'

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
      <Layout className="app">
        <Sider
          style={{ overflow: 'auto', height: '100%', position: 'fixed', left: 0 }}
          collapsible
          collapsed={this.state.collapsed}
          onCollapse={this.onCollapse}
        >
          <Menu/>
        </Sider>
  
        <Layout style={{ marginLeft: !this.state.collapsed ? 200 : 80, height: '100%' }}>
          <Content className='content-wrapper'>
            <Breadcrumb />
            <div className='content'>
              <Router/>
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
