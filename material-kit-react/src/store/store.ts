/*
 * @Descripttion: pangoo-dm
 * @version: 1.0
 * @Author: uidq1343
 * @Date: 2021-11-23 11:44:46
 * @LastEditors: uidq1343
 * @LastEditTime: 2021-12-02 10:08:12
 * @content: edit your page content
 */

import {createStore, applyMiddleware} from 'redux'
import thunk from 'redux-thunk'
import rootReducer from './reducers'
import {composeWithDevTools} from 'redux-devtools-extension'
import createLogger from 'redux-logger';
const initalState = {
}

const middleware = [thunk,createLogger]

const store = createStore(rootReducer, initalState, composeWithDevTools(applyMiddleware(...middleware)))

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch


export default store;