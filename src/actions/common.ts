import actionTypes from '@constant/actionTypes'

export default {
  changeBreadcrumb: (title: string) => {
    return {
      type: actionTypes.UPDATE_BREADCRUMB,
      payload: title
    }
  }
}