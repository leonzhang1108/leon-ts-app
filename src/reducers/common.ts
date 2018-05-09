import actionTypes from '@constant/actionTypes'

const initState = {
  breadcrumb: 'Hello'
}

const common = (state = initState, action:any) => {
  switch (action.type) {
    case actionTypes.UPDATE_BREADCRUMB:
      return {
        ...state,
        breadcrumb: action.payload
      }
    default:
      return state
  }
}

export default common