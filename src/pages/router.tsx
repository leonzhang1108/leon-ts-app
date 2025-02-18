import menus from '@constant/menus'
import Utils from '@utils'
import React from 'react'
import loadable from '@loadable/component'
import { RouteComponentProps } from 'react-router'
import { Redirect, Route, Switch, withRouter } from 'react-router-dom'
import { common } from '@actions'
import { bindActionCreators } from 'redux'
import Loader from '@cpt/Loader'

const load = (c) =>
  loadable(() => import(/* webpackChunkName: `[request]` */ `../pages/${c}`), {
    fallback: (
      <div className="loading-center">
        <Loader />
      </div>
    ),
  })

const NotFound = load('NotFound')

const renderRouter = (menu, i) => (
  <Route
    key={i}
    path={`/${menu.route}`}
    exact={true}
    component={load(Utils.toCamelCase(menu.route))}
  />
)

const allMenus: any[] = []

const initRoute = (currMenus: any[]) => {
  currMenus.forEach((menu) => {
    menu.childs ? initRoute(menu.childs) : allMenus.push(menu)
  })
}

initRoute(menus)

interface IProps extends RouteComponentProps<any> {
  actions: {
    toggleOpenKeys(v: any): void
  }
}

class Router extends React.Component<IProps> {
  shouldComponentUpdate(props) {
    return false
  }

  redirectToHome = () => {
    this.props.actions.toggleOpenKeys({
      breadcrumb: [
        {
          route: 'deshi-basara',
          icon: 'ts-app icon-home',
          title: 'Deshi Basara',
        },
      ],
      isInit: true,
    })

    let redirect = '/deshi-basara'

    if (['5cena.com', '192.168.71.118'].includes(location.hostname)) {
      redirect = '/cena'
    }

    if (
      ['will6marry.me', '6rina.com', 'vxiiiii.com'].includes(location.hostname)
    ) {
      redirect = '/ring'
    }

    return <Redirect to={redirect} />
  }

  render() {
    return (
      <Switch>
        {/* index */}
        <Route path="/" exact={true} render={this.redirectToHome.bind(this)} />

        {/* menus */}
        {allMenus.map(renderRouter)}

        {/* 404 */}
        <Route component={NotFound} />
      </Switch>
    )
  }
}

export default Utils.connect({
  component: withRouter(Router),
  mapDispatchToProps: (dispatch) => ({
    actions: bindActionCreators(
      {
        toggleOpenKeys: common.toggleOpenKeys,
      },
      dispatch
    ),
  }),
})
