import actionTypes from '@constant/actionTypes'

export default {
  changeBreadcrumb: (title: string) => {
    return {
      type: actionTypes.UPDATE_BREADCRUMB,
      payload: title
    }
  },
  onResize: size => {
    return {
      type: actionTypes.ON_RESIZE,
      payload: size
    }
  },
  toggleCollapse: () => {
    return {
      type: actionTypes.TOGGLE_COLLAPSE
    }
  }
}