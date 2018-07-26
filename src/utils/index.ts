import { connect } from 'react-redux'
import * as Loadable from 'react-loadable'
import PageLoading from '@components/PageLoading'
import menus from '@constant/menus'
import request from './fetch'
import Storage from './storage'

export default {
  request,
  Storage,
  connect: ({
    component,
    mapStateToProps,
    mapDispatchToProps
  }: IConnectProps) => connect(
    mapStateToProps,
    mapDispatchToProps
  )(component),

  load: component => Loadable({
    loader: () => import(`../pages/${component}`),
    loading: PageLoading
  }),

  toCamelCase: str => {
    // toCamelCase
    const [first, ...rest] = str.replace(/-(\w)/g, (_, x) => x.toUpperCase())
    return first.toUpperCase() + rest
  },
  
  findBreadcrumb: (route, f) => {
    const innerFindBreadcrumb = (innerMenus: any[] = [], parents: any[] = []) => 
      innerMenus.forEach(menu => 
        menu.childs 
          ? innerFindBreadcrumb(menu.childs, parents.concat(menu))
          : menu.route === route 
            ? f({
                breadcrumb: parents.concat(menu),
                route: menu.route
              })
            : true
    )
    innerFindBreadcrumb(menus)
  },

  debounce: (action, idle) => {
    let last
    return () => {
      clearTimeout(last)
      last = setTimeout(action, idle)
    }
  },

  random: (lower, upper) => Math.floor(Math.random() * (upper - lower)) + lower,

  handle: (func, ...args) => () => func(...args),

  changeTitle: breadcrumb => document.title = breadcrumb[breadcrumb.length - 1].title,

  clone: v => JSON.parse(JSON.stringify(v))
}

interface IConnectProps {
  component,
  mapStateToProps?,
  mapDispatchToProps?
}
