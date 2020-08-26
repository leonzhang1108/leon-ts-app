import actionTypes from '@constant/actionTypes'

export default {
  changeBreadcrumb: (breadcrumbs: any[]) => {
    return {
      payload: breadcrumbs,
      type: actionTypes.UPDATE_BREADCRUMB
    }
  },
  onResize: size => {
    return {
      payload: size,
      type: actionTypes.ON_RESIZE
    }
  },
  toggleCollapse: () => {
    return {
      type: actionTypes.TOGGLE_COLLAPSE
    }
  },
  toggleOpenKeys: (v: any) => {
    return {
      payload: v,
      type: actionTypes.TOGGLE_OPENKEYS
    }
  }
}
