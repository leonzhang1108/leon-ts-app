import menus from '@constant/menus'
import Utils from '@utils'
import * as React from 'react'
import { RouteComponentProps } from 'react-router'
import { Redirect, Route, Switch, withRouter } from 'react-router-dom'
const NotFound = Utils.load('NotFound')

const renderRouter = (menu, i) =>
  <Route key={i} path={`/${menu.route}`} exact={true} component={Utils.load(Utils.toCamelCase(menu.route))} />

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
    return props.location.pathname !== this.props.location.pathname
  }
  render () {
    return (
      <Switch>
        {/* index */}
        <Route path='/' exact={true} render={redirectToHome} />

        {/* menus */}
        { allMenus.map(renderRouter) }

        {/* 404 */}
        <Route component={NotFound} />
      </Switch>
    )
  }
}

export default withRouter(Router)
