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

interface IProps {
  route: string,
  isMobile: boolean,
  loading: boolean
}
class Router extends React.Component<IProps> {

  shouldComponentUpdate (props) {
    return this.props.route !== props.route
      || this.props.isMobile !== props.isMobile
      || this.props.loading !== props.loading
  }

  render () {
    return (
      <Switch>
        {/* index */}
        <Route path='/' exact render={redirectToHome} />

        {/* menus */}
        { allMenus.map(renderRouter) }

        {/* 404 */}
        <Route component={NotFound} />
      </Switch>
    )
  }
}

export default Utils.connect({
  component: Router,
  mapStateToProps: state => ({
    route: state.common.route,
    isMobile: state.common.isMobile,
    loading: state.common.loading
  })
})
