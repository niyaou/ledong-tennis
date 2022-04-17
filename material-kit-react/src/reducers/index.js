import { combineReducers } from 'redux'
import login from './login'


const storeApp = combineReducers({
    login,
})

export default storeApp
