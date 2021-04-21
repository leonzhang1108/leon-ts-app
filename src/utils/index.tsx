import menus from '@constant/menus'
import { IConnectProps } from '@interface'
import { connect } from 'react-redux'
import request from './fetch'
import Storage from './storage'

function animateScrollTo({ el, from, to, isVertical = true }) {
  // 计算需要移动的距离
  const delta = to - from
  let _from = from
  let direction = isVertical ? 'scrollTop' : 'scrollLeft'

  function move() {
    // 一次调用滑动帧数，每次调用会不一样
    const dist = Math.ceil(delta / 5)
    _from += dist
    el[direction] = from
    // 如果移动幅度小于5个像素，直接移动，否则递归调用，实现动画效果
    if (Math.abs(delta) > 5) {
      animateScrollTo({ el, from: _from, to, isVertical })
    } else {
      el[direction] = to
    }
  }

  if (requestAnimationFrame) {
    requestAnimationFrame(move)
  } else {
    setTimeout(move, 10)
  }
}

function uuid() {
  let s: any = []
  const hexDigits = "0123456789abcdef"
  for (var i = 0; i < 36; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1)
  }
  s[14] = "4"  // bits 12-15 of the time_hi_and_version field to 0010
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
  s[8] = s[13] = s[18] = s[23] = "-"

  var uuid = s.join("")
  return uuid
}

export default {
  request,
  Storage,
  uuid,
  connect: ({
    component,
    mapStateToProps,
    mapDispatchToProps
  }: IConnectProps) => connect(mapStateToProps, mapDispatchToProps)(component),

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

  changeTitle: breadcrumb =>
    (document.title = breadcrumb[breadcrumb.length - 1].title),

  clone: v => JSON.parse(JSON.stringify(v)),

  transform: (() => {
    const trans = [
      'transform',
      'webkitTransform',
      'msTransform',
      'mozTransform',
      'oTransform'
    ]
    const body = document.body
    return trans.filter(e => body.style[e] !== undefined)[0]
  })(),

  secondFormatToTime: s => {
    let i = 0
    if (s > 60) {
      i = parseInt(s / 60 + '', 10)
      s = parseInt((s % 60) + '', 10)
      if (i > 60) {
        i = parseInt((i % 60) + '', 10)
      }
    }

    const zero = v => (v < 10 ? '0' + v : v)
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
  },

  animateScrollTo
}
