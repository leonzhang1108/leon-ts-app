import actionTypes from '@constant/actionTypes'
const initState = {
  breadcrumb: '',
  contentHeight: 0,
  contentWidth: 0
}

const common = (state = initState, action:any) => {
  switch (action.type) {
    case actionTypes.UPDATE_BREADCRUMB:
      return {
        ...state,
        breadcrumb: action.payload
      }

    case actionTypes.ON_RESIZE:
      return {
        ...state,
        ...action.payload
      }
    default:
      return state
  }
}

export default common