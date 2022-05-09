/*
 * @Descripttion: pangoo-dm
 * @version: 1.0
 * @Author: uidq1343
 * @Date: 2021-12-01 15:55:26
 * @LastEditors: uidq1343
 * @LastEditTime: 2022-04-21 11:17:11
 * @content: edit your page content
 */
import { combineReducers } from 'redux'
import userReducer from './userReducers'
import dsExploreReducers from './dsExploreReducers'
import inSensitiveReducers from './inSensitiveReducers'
import filesAndFoldersReducers from './filesAndFoldersReducers'
import dominationReducers from '../slices/dominationSlice'
import editListReducer from '../slices/editListSlice'
import publishReducers from '../slices/publishSlice'
import commentReducers from '../slices/commentSlice'
import exploreReducers from '../slices/exploreSlice'
import uploadFileReducers from '../slices/uploadFileSlice'
import tagsInfoReducers from '../slices/tagsSlice'


export default combineReducers({
  users: userReducer,
  dsExplore:dsExploreReducers,
  inSensitive:inSensitiveReducers,
  filesAndFolders:filesAndFoldersReducers,
  domination:dominationReducers,
  editList:editListReducer,
  publish:publishReducers,
  comment:commentReducers,
  explore:exploreReducers,
  uploadFiles:uploadFileReducers,
  tagsInfo:tagsInfoReducers,
})