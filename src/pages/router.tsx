import * as React from 'react'
import { Route, Switch } from 'react-router-dom'
import Utils from '@utils'
import NotFound from '@pages/NotFound'

const Router = () => (
  <Switch>
    <Route path="/" exact component={Utils.load('Home')} />
    <Route path="/op1" exact component={Utils.load('Home')} />
    <Route path="/op2" exact component={Utils.load('Home')} />
    <Route path="/op3" exact component={Utils.load('Home')} />
    <Route component={NotFound} />
  </Switch>
)


export default Router
