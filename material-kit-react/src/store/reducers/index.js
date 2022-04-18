/*
 * @Descripttion: pangoo-dm
 * @version: 1.0
 * @Author: uidq1343
 * @Date: 2021-12-01 15:55:26
 * @LastEditors: uidq1343
 * @LastEditTime: 2022-03-17 11:27:57
 * @content: edit your page content
 */
import { combineReducers } from 'redux'
import userReducer from './userReducers'

import uploadFileReducers from '../slices/uploadFileSlice'


export default combineReducers({
  users: userReducer,
 
  uploadFiles:uploadFileReducers,
})