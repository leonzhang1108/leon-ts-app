import actionTypes from '@constant/actionTypes'
const initState = {
  breadcrumb: ''
}

const common = (state = initState, action:any) => {
  switch (action.type) {
    case actionTypes.UPDATE_BREADCRUMB:
      console.log(action.payload)
      return {
        ...state,
        breadcrumb: action.payload
      }
    default:
      return state
  }
}

export default common