import actionTypes from '@constant/actionTypes'
import Utils from '@utils'
const {
  UPDATE_BREADCRUMB,
  ON_RESIZE,
  TOGGLE_COLLAPSE,
  TOGGLE_OPENKEYS
} = actionTypes

interface IProp {
  breadcrumb: any[];
  openKeys: string[] | null;
  route: string;
  collapsed: boolean;
  contentHeight: number;
  contentWidth: number;
  width: number;
  isMobile: boolean;
}

const initState = {
  breadcrumb: [],
  openKeys: null,
  route: '',
  collapsed: false,
  contentHeight: 0,
  contentWidth: 0,
  width: 0,
  isMobile: document.body.clientWidth < 900
}

const initOpenKeys = (_, action) => {
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
  const { type } = action
  const obj = {
    [UPDATE_BREADCRUMB]: () => {
      const { breadcrumb, route } = action.payload
      Utils.changeTitle(breadcrumb)
      return Object.assign({}, state, {
        breadcrumb,
        route
      })
    },
    [ON_RESIZE]: () => {
      const { width } = action.payload
      const isMobile = width < 900
      return Object.assign({}, state, {
        ...action.payload,
        isMobile
      })
    },
    [TOGGLE_COLLAPSE]: Object.assign({}, state, {
      collapsed: !state.collapsed
    }),
    [TOGGLE_OPENKEYS]: () =>
      Object.assign({}, state, {
        openKeys: action.payload.isInit && initOpenKeys(state, action)
      })
  }

  return Utils.getReducer(obj, type, state)
}

export default common
