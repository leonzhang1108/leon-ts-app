import Breadcrumb from '@cpt/Breadcrumb'
import ContentWrapper from '@cpt/ContentWrapper'
import MainContent from '@cpt/MainContent'
import Menu from '@cpt/Menu'
import Router from '@pages/router'
import { Layout } from 'antd'
import React from 'react'
import { Route, Switch } from 'react-router-dom'
import Party from '@pages/Party'
import Cena from '@pages/Cena'
import Ring from '@pages/Ring'
import './App.less'

const { Content, Footer } = Layout
const App = () => (
  <Layout className="app">
    <Menu />
    <MainContent>
      <Content className="content-wrapper">
        <Breadcrumb />
        <ContentWrapper>
          <Router />
        </ContentWrapper>
      </Content>
      <Footer style={{ textAlign: 'center', padding: '10px 50px' }}>
        BLOG © 2018 - 2025 Created by Leon
      </Footer>
    </MainContent>
  </Layout>
)

const Wrapper = () => {
  return (
    <Switch>
      <Route path="/100" exact={true} component={Party} />
      {['5cena.com', '192.168.71.118'].includes(location.hostname) && (
        <Route path="/cena" exact={true} component={Cena} />
      )}
      {['will6marry.me', '6rina.com', 'vxiiiii.com'].includes(
        location.hostname
      ) && <Route path="/ring" exact={true} component={Ring} />}
      <Route component={App} />
    </Switch>
  )
}

export default Wrapper
