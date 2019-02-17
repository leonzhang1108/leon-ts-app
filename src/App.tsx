import { Layout } from 'antd'
import * as React from 'react'
import './App.less'
import Menu from '@components/Menu'
import Breadcrumb from '@components/Breadcrumb'
import ContentWrapper from '@components/ContentWrapper'
import Router from '@pages/router'
import MainContent from '@components/MainContent'

const { Content, Footer } = Layout
debugger
const App = () => (
  <Layout className='app'>
    <Menu/>
    <MainContent>
      <Content className='content-wrapper'>
        <Breadcrumb/>
        <ContentWrapper>
          <Router/>
        </ContentWrapper>
      </Content>
      <Footer style={{ textAlign: 'center', padding: '10px 50px' }}>
        BLOG © 2018 - 2019 Created by Leon
      </Footer>
    </MainContent>
  </Layout>
)

export default App
