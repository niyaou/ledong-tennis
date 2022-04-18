/*
 * @Descripttion: pangoo-dm
 * @version: 1.0
 * @Author: uidq1343
 * @Date: 2021-12-01 16:05:10
 * @LastEditors: uidq1343
 * @LastEditTime: 2022-03-28 16:48:05
 * @content: user reducer
 */
/* eslint-disable */
import { UserActionTypes } from '../types'
const initialState = {
    userInfo: {},
    appliesList: [],
    publickey: '123132',
    isDirectToDomanitaion: false,
    success:false,
}

export default function (state = initialState, action) {
    state.loading = false
    state.errorMsg = ''
    state.loadError = false
    state.success = false
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
                loading: false
            }
        case UserActionTypes.USERS_ERROR:
            return {
                ...state,
                loadError: true,
                errorMsg: action.payload,
                loading: false
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







                

            case UserActionTypes.APPLY_PERMISSION_OPERATE:
                return {
                    ...state,
                    loading: true,
                    loadError: false,
                    errorMsg: '',
                }
            case UserActionTypes.APPLY_PERMISSION_OPERATE_SUCCESS:
                return {
                    ...state,
                    loadError: false,
                    errorMsg: '',
                    success:true,
                    loading: false
                }
            case UserActionTypes.APPLY_PERMISSION_OPERATE_ERROR:
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