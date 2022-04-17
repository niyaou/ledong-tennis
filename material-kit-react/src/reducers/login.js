
import {LOGIN_ACTION} from '../action'

const login = (state = {}, action) => {
  switch (action.type) {
    case LOGIN_ACTION.LOGIN:
      return {
          ...state,
        }
    case LOGIN_ACTION.LOGIN_SUCCESS:
      return {
        ...state,
      }
    case LOGIN_ACTION.LOGIN_ERROR:
      return {
        ...state,
      }
    default:
      return state
  }
}



export default login
