import menus from '@constant/menus'
import Utils from '@utils'
import React from 'react'
import { RouteComponentProps } from 'react-router'
import { Redirect, Route, Switch, withRouter } from 'react-router-dom'
import CacheRoute, { CacheSwitch } from 'react-router-cache-route'
const NotFound = Utils.load('NotFound')

const renderRouter = (menu, i) =>
  menu.keepAlive 
    ? (
      <CacheRoute
        key={i}
        path={`/${menu.route}`}
        exact={true}
        component={Utils.load(Utils.toCamelCase(menu.route))}
      />
    )
    : (
      <Route
        key={i}
        path={`/${menu.route}`}
        exact={true}
        component={Utils.load(Utils.toCamelCase(menu.route))}
      />
    )

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

class Router extends React.Component<RouteComponentProps<any>> {
  shouldComponentUpdate (props) {
    // pathname没改变 页面不重新渲染
    return props.location.pathname !== this.props.location.pathname
  }
  render () {
    return (
      <CacheSwitch>
        {/* index */}
        <Route path='/' exact={true} render={redirectToHome} />

        {/* menus */}
        { allMenus.map(renderRouter) }

        {/* 404 */}
        <Route component={NotFound} />
      </CacheSwitch>
    )
  }
}

export default withRouter(Router)
