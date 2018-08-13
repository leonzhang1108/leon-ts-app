import actionTypes from '@constant/actionTypes'
import Utils from '@utils'

interface IProp {
  breadcrumb: any[],
  openKeys: string[],
  route: string,
  collapsed: boolean,
  contentHeight: number,
  contentWidth: number,
  width: number,
  isMobile: boolean
}

const initState = {
  breadcrumb: [],
  openKeys: [],
  route: '',
  collapsed: false,
  contentHeight: 0,
  contentWidth: 0,
  width: 0,
  isMobile: document.body.clientWidth < 900
}

const toggleOpenKeys = (state, action) => {
  const { key } = action.payload
  const index = state.openKeys.indexOf(key)
  let openKeys: string[] = []

  if (index >= 0) {
    state.openKeys.splice(index, 1)
    openKeys = state.openKeys
  } else {
    openKeys = state.openKeys
    openKeys.push(key)
  }

  return openKeys
}

const initOpenKeys = (state, action) => {
  const { breadcrumb } = action.payload
  const openKeys: string[] = []

  if (breadcrumb.length <= 1) {
    return []
  }

  breadcrumb.forEach((bc, i) => {
    if (i !== breadcrumb.length - 1) {
      openKeys.push(bc.key)
    }
  })

  return openKeys
}

const common = (state: IProp = initState, action: any) => {
  switch (action.type) {
    case actionTypes.UPDATE_BREADCRUMB:
      const { breadcrumb, route } = action.payload
      Utils.changeTitle(breadcrumb)
      return {
        ...state,
        breadcrumb,
        route
      }

    case actionTypes.ON_RESIZE:
      const { width } = action.payload
      const isMobile = width < 900
      return {
        ...state,
        ...action.payload,
        isMobile
      }

    case actionTypes.TOGGLE_COLLAPSE:
      return {
        ...state,
        collapsed: !state.collapsed
      }

    case actionTypes.TOGGLE_OPENKEYS:
      return {
        ...state,
        openKeys: action.payload.isInit
          ? initOpenKeys(state, action)
          : toggleOpenKeys(state, action)
      }

    default:
      return state
  }
}

export default common
