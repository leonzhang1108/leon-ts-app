import Breadcrumb from '@components/Breadcrumb'
import ContentWrapper from '@components/ContentWrapper'
import MainContent from '@components/MainContent'
import Menu from '@components/Menu'
import Router from '@pages/router'
import { Layout } from 'antd'
import * as React from 'react'
import './App.less'

const { Content, Footer } = Layout
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
