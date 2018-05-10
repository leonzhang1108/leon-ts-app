import * as React from 'react'
import { Route, Switch } from 'react-router-dom'
import Utils from '@utils'
import NotFound from '@pages/NotFound'

import menus from '@constant/menus'

const renderRouter = (menu, i) => 
  <Route key={i} path={`/${menu.route}`} exact component={Utils.load(Utils.toCamelCase(menu.route))} />

const Router = () => (
  <Switch>
    <Route path="/" exact component={Utils.load('Home')} />
      { menus.map(renderRouter) }
    <Route component={NotFound} />
  </Switch>
)


export default Router
