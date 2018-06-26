import { connect } from 'react-redux'
import * as Loadable from 'react-loadable'
import PageLoading from '@components/PageLoading'
import menus from '@constant/menus'
import request from './fetch.js'

export default {
  request,
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
      last = setTimeout(() => action(), idle)
    }
  },

  random: (lower, upper) => Math.floor(Math.random() * (upper - lower)) + lower,

  getMonthList: (year, month) => {
    let row = 0
    let weekDay = new Date(`${year}-${month}-1`).getDay()
    const days = new Date(year, month, 0).getDate()
    const list: any[] = [new Array(7).fill(0)]
    for(let i = 1; i <= days; i++) {
      if (list[row][weekDay] === undefined) {
        row++
        weekDay = 0
        list.push(new Array(7).fill(0))
      }
      list[row][weekDay] = i
      weekDay++
    }
    return { year, month, list }
  }
}

interface IConnectProps {
  component,
  mapStateToProps?,
  mapDispatchToProps?
}