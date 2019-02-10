import * as React from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import Utils from '@utils'
import menus from '@constant/menus'
const NotFound = Utils.load('NotFound')

const renderRouter = (menu, i) =>
  <Route key={i} path={`/${menu.route}`} exact component={Utils.load(Utils.toCamelCase(menu.route))} />

const redirectToHome = () => <Redirect to='/home'/>

const allMenus: any[] = []

const initRoute = (currMenus: any[]) => {
  currMenus.forEach(menu => {
    menu.childs
      ? initRoute(menu.childs)
      : allMenus.push(menu)
  })
}

initRoute(menus)

const Router = () => (
  <Switch>
    {/* index */}
    <Route path='/' exact render={redirectToHome} />

    {/* menus */}
    { allMenus.map(renderRouter) }

    {/* 404 */}
    <Route component={NotFound} />
  </Switch>
)

export default Router
