import PageLoading from '@cpt/PageLoading'
import menus from '@constant/menus'
import { IConnectProps } from '@interface'
import Loadable from 'react-loadable'
import { connect } from 'react-redux'
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

  load: c => Loadable({
    loader: () => import(`../pages/${c}`),
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

  handle: (func, ...args) => v => func(...args, v),

  changeTitle: breadcrumb => document.title = breadcrumb[breadcrumb.length - 1].title,

  clone: v => JSON.parse(JSON.stringify(v)),

  transform: (() => {
    const trans = ['transform', 'webkitTransform', 'msTransform', 'mozTransform', 'oTransform']
    const body = document.body
    return trans.filter((e) => body.style[e] !== undefined)[0]
  })(),

  secondFormatToTime: s => {
    let i = 0
    if (s > 60) {
      i = parseInt(s / 60 + '', 10)
      s = parseInt(s % 60 + '', 10)
      if (i > 60) {
        i = parseInt(i % 60 + '', 10)
      }
    }

    const zero = v => v < 10 ? '0' + v : v
    return zero(i) && zero(s) ? [zero(i), zero(s)].join(':') : '00:00'
  },

  isString: v => Object.prototype.toString.call(v) === '[object String]',

  isArray: v => Object.prototype.toString.call(v) === '[object Array]',

  getReducer: (obj, type, state) => {
    const v = obj[type]
    switch (Object.prototype.toString.call(v)) {
      case '[object Object]':
        return v
      case '[object Function]':
        return v()
      default:
        return state
    }
  },

  downloadImg: (href, filename) => {
    const a = document.createElement('a')
    a.download = filename
    a.href = href
    document.body.appendChild(a)
    a.click()
    a.remove()
  }
}
