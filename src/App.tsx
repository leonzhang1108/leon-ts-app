import { Layout } from 'antd'
import * as React from 'react'
import './App.less'
import Menu from '@components/Menu'
import Breadcrumb from '@components/Breadcrumb'
import ContentWrapper from '@components/ContentWrapper'
import Router from '@pages/router'

const { Content, Footer } = Layout

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
        <Menu collapsed={this.state.collapsed} onCollapse={this.onCollapse}/>
        <Layout style={{ marginLeft: !this.state.collapsed ? 200 : 80, height: '100%' }}>
          <Content className='content-wrapper'>
            <Breadcrumb />
            <ContentWrapper>
              <Router/>
            </ContentWrapper>
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