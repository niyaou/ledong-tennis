/*
 * @Descripttion: pangoo-dm
 * @version: 1.0
 * @Author: uidq1343
 * @Date: 2021-12-01 16:10:54
 * @LastEditors: uidq1343
 * @LastEditTime: 2022-04-15 10:48:26
 * @content: edit your page content
 */
/* eslint-disable */
import { JSEncrypt } from 'jsencrypt'
import Axios from '../../common/axios'
import { UserActionTypes } from '../types'
export const USER_INFO_KEY = 'USER_INFO_KEY'



export const initUser = () => async dispatch => {
    const userStr = localStorage.getItem(USER_INFO_KEY)
    if (userStr && userStr !== 'null') {
        const user = JSON.parse(userStr)
        dispatch({
            type: UserActionTypes.GET_USERS_SUCCESS,
            payload: user
        })
    }
}


export const directToPage = () => async dispatch => {
    dispatch({
        type: UserActionTypes.DIRECT_TO_DOMINATION,
    })
}

export const directDown = () => async dispatch => {
    dispatch({
        type: UserActionTypes.DIRECT_DOWN,
    })
}

export const logOut = () => async dispatch => {
    dispatch({
        type: UserActionTypes.LOG_OUT,
    })
    localStorage.removeItem(USER_INFO_KEY)
}






export const applyPermission = (type, effectiveDayNum) => async dispatch => {
    dispatch({
        type: UserActionTypes.APPLY_PERMISSION,
    })
    try {
        //  0-下载权限,1-脱敏权限

        let params = {
            "effectiveDayNum": effectiveDayNum,
            "type": type
        }
        const user = await Axios.post(`/api/pangoo-data-set/rightApplication`, params)
            if (user.data.code !== 200 && user.data.code !== 0) {
                dispatch({
                    type: UserActionTypes.APPLY_PERMISSION_ERROR,
                    payload: user.data.msg,
                })
                return
            }
            
            let account = localStorage.getItem(USER_INFO_KEY)
            account = Object.assign(JSON.parse(account),{...user.data.data})
            localStorage.setItem(USER_INFO_KEY, JSON.stringify(account))
        dispatch({
            type: UserActionTypes.APPLY_PERMISSION_SUCCESS,
            payload: account
        })
    }
    catch (e) {
        dispatch({
            type: UserActionTypes.APPLY_PERMISSION_ERROR,
            payload: e.response.data.message,
        })
    }

}


export const appliesListAction = (pageNo,size ) => async dispatch => {
    dispatch({
        type: UserActionTypes.GET_APPLY_PERMISSION_LIST,
    })
    try {
        //  0-下载权限,1-脱敏权限

  
        const res = await Axios.get(`/api/pangoo-data-set/rightApplication?page=${pageNo}&size=${size}&status=0`)
            if (res.data.code !== 200 && res.data.code !== 0) {
                dispatch({
                    type: UserActionTypes.GET_APPLY_PERMISSION_LIST_ERROR,
                    payload: res.data.message,
                })
                return
            }
    
        dispatch({
            type: UserActionTypes.GET_APPLY_PERMISSION_LIST_SUCCESS,
            payload: res.data.data.content
        })
    }
    catch (e) {
        dispatch({
            type: UserActionTypes.GET_APPLY_PERMISSION_LIST_ERROR,
            payload: e.response.data.message,
        })
    }

}



export const appliesOperateAction = (applyId,status ) => async dispatch => {
    dispatch({
        type: UserActionTypes.APPLY_PERMISSION_OPERATE,
    })
    try {
        //  0-下载权限,1-脱敏权限
        const res = await Axios.patch(`/api/pangoo-data-set/rightApplication/${applyId}/audit?status=${status}`)
            if (res.data.code !== 200 && res.data.code !== 0) {
                dispatch({
                    type: UserActionTypes.APPLY_PERMISSION_OPERATE_ERROR,
                    payload: res.data.message,
                })
                return
            }
    
        dispatch({
            type: UserActionTypes.APPLY_PERMISSION_OPERATE_SUCCESS,
        
        })
    }
    catch (e) {
        dispatch({
            type: UserActionTypes.APPLY_PERMISSION_OPERATE_ERROR,
            payload: e.response.data.message,
        })
    }

}
