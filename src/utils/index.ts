import { connect } from 'react-redux'
import * as Loadable from 'react-loadable'
import PageLoading from '@components/PageLoading'
import menus from '@constant/menus'

export default {
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
            ? !!f({
                breadcrumb: parents.concat(menu),
                route: menu.route
              })
            : true
    )
    innerFindBreadcrumb(menus)
  }
}

interface IConnectProps {
  component,
  mapStateToProps?,
  mapDispatchToProps?
}