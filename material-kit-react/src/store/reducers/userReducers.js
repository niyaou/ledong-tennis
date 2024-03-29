/*
 * @Descripttion: pangoo-dm
 * @version: 1.0
 * @Author: uidq1343
 * @Date: 2021-12-01 16:05:10
 * @LastEditors: uidq1343
 * @LastEditTime: 2022-03-28 16:48:05
 * @content: user reducer
 */
import { UserActionTypes } from '../types'
import { fetching } from '../../common/interface'
const initialState = {
    userInfo: {number:"15008292881",name:"席老师"},
    appliesList: [],
    publickey: '',
    isDirectToDomanitaion: false,
    success:false,
    loginError:false,
    ...fetching,
}

export default function (state = initialState, action) {
    state.loading = false
    state.errorMsg = ''
    state.loadError = false
    state.success = false
    // console.log("🚀 ~ file: userReducers.js ~ line 27 ~ state", state)
    switch (action.type) {
        case UserActionTypes.GET_USERS:
            return {
                ...state,
                loading: true,
                loadError: false,
                errorMsg: '',
            }
        case UserActionTypes.GET_USERS_SUCCESS:
            return {
                ...state,
                userInfo: action.payload,
                loadError: false,
                errorMsg: '',
                loading: false,
                loginError: false,
            }
        case UserActionTypes.USERS_ERROR:
            return {
                ...state,
                loadError: true,
                errorMsg: action.payload,
                loading: false,
                loginError: true,
            }



            case UserActionTypes.GET_USERS_INFO:
                return {
                    ...state,
                    loading: true,
                    loadError: false,
                    errorMsg: '',
                }
            case UserActionTypes.GET_USERS_INFO_SUCCESS:
                return {
                    ...state,
                    loadError: false,
                    errorMsg: '',
                    loading: false,
                    loginError: false,
                }
            case UserActionTypes.GET_USERS_INFO_ERROR:
                return {
                    ...state,
                    loadError: true,
                    errorMsg: action.payload,
                    loading: false,
                    loginError: true,
                }




            case UserActionTypes.APPLY_PERMISSION:
                return {
                    ...state,
                    loading: true,
                    loadError: false,
                    errorMsg: '',
                }
            case UserActionTypes.APPLY_PERMISSION_SUCCESS:
                return {
                    ...state,
                    userInfo: action.payload,
                    loadError: false,
                    errorMsg: '',
                    success:true,
                    loading: false
                }
            case UserActionTypes.APPLY_PERMISSION_ERROR:
                return {
                    ...state,
                    loadError: true,
                    errorMsg: action.payload,
                    loading: false
                }



                

            case UserActionTypes.GET_APPLY_PERMISSION_LIST:
                return {
                    ...state,
                    loading: true,
                    loadError: false,
                    errorMsg: '',
                }
            case UserActionTypes.GET_APPLY_PERMISSION_LIST_SUCCESS:
                return {
                    ...state,
                    appliesList: action.payload,
                    loadError: false,
                    errorMsg: '',
                    loading: false
                }
            case UserActionTypes.GET_APPLY_PERMISSION_LIST_ERROR:
                return {
                    ...state,
                    loadError: true,
                    errorMsg: action.payload,
                    loading: false
                }







                

            case UserActionTypes.CREATE_USERS:
                return {
                    ...state,
                    loading: true,
                    loadError: false,
                    errorMsg: '',
                }
            case UserActionTypes.CREATE_USERS_SUCCESS:
                return {
                    ...state,
                    loadError: false,
                    errorMsg: '',
                    success:true,
                    loading: false
                }
            case UserActionTypes.CREATE_USERS_ERROR:
                return {
                    ...state,
                    loadError: true,
                    errorMsg: action.payload,
                    loading: false
                }










        case UserActionTypes.DIRECT_TO_DOMINATION:
            return {
                ...state,
                loadError: false,
                errorMsg: '',
                isDirectToDomanitaion: true,
            }
        case UserActionTypes.LOG_OUT:
            return {
                ...state,
                loadError: false,
                errorMsg: '',
                isDirectToDomanitaion: false,
                userInfo: [],
            }
        default: return {
            ...state,
        }
    }

}