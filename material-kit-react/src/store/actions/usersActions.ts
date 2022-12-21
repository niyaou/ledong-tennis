/*
 * @Descripttion: pangoo-dm
 * @version: 1.0
 * @Author: uidq1343
 * @Date: 2021-12-01 16:10:54
 * @LastEditors: uidq1343
 * @LastEditTime: 2022-05-09 14:22:40
 * @content: edit your page content
 */
import { JSEncrypt } from 'jsencrypt'
import Axios from '../../common/axios/axios'
import { dateTime } from '../../common/utils/dateUtils'
import { UserActionTypes } from '../types'
import { UserFormValues } from '../common/interface'
export const USER_INFO_KEY = 'USER_INFO_KEY'



export const initUser = () => async dispatch => {
    const userStr = localStorage.getItem(USER_INFO_KEY)
    if (userStr && userStr !== 'null') {
        dispatch({
            type: UserActionTypes.GET_USERS_SUCCESS,
            payload: userStr
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


export const login = (auth: UserFormValues) => async dispatch => {
    dispatch({
        type: UserActionTypes.GET_USERS,
    })
    try {


        let formdata = new FormData()
    
        formdata.append("keycode",  auth.password)
        const user = await Axios.post(`/api/user/ldAdminLogin?keycode=${auth.password}`)
        
        if (user.data.code !== 200 && user.data.code !== 0) {
            localStorage.removeItem(USER_INFO_KEY)
            dispatch({
                type: UserActionTypes.USERS_ERROR,
                payload: user.data.message,
            })
            return
        }

        console.log("🚀 ~ file: usersActions.ts ~ line 92 ~ user.data.data", user.data.data)
        localStorage.setItem(USER_INFO_KEY, user.data.data)
        dispatch({
            type: UserActionTypes.GET_USERS_SUCCESS,
            payload: user.data.data
        })
    }
    catch (e) {
        localStorage.removeItem(USER_INFO_KEY)
        dispatch({
            type: UserActionTypes.USERS_ERROR,
            payload: e.response.data.message,
        })

    }

}




export const createUserAccount = (name,number,court) => async dispatch => {
    dispatch({
        type: UserActionTypes.CREATE_USERS,
    })
    try {

        let formdata = new FormData()
    
        formdata.append("name",  name)
        formdata.append("number",  number)
        formdata.append("court",  court)
        const user = await Axios.post(`/api/user/register`,formdata)
  
        if (user.status!== 200 ) {
          
            dispatch({
                type: UserActionTypes.CREATE_USERS_ERROR,
                payload: user.data.message,
            })
            return
        }

       
        dispatch({
            type: UserActionTypes.CREATE_USERS_SUCCESS,
            payload: user.data.user
        })
    }
    catch (e) {
       
        dispatch({
            type: UserActionTypes.CREATE_USERS_ERROR,
            payload: e.response.data.message,
        })

    }

}





export const userAction = (key ) => async dispatch => {
    dispatch({
        type: UserActionTypes.GET_USERS_INFO,
    })
    try {
        const user = await Axios.get(`/api/user/ldUserinfo`)
        if (user.data.code !== 200 && user.data.code !== 0) {
            localStorage.removeItem(USER_INFO_KEY)
            dispatch({
                type: UserActionTypes.GET_USERS_INFO_ERROR,
                payload: user.data.message,
            })
            return
        }

        dispatch({
            type: UserActionTypes.GET_USERS_INFO_SUCCESS,
            payload: user.data.data
        })
    }
    catch (e) {
        localStorage.removeItem(USER_INFO_KEY)
        dispatch({
            type: UserActionTypes.GET_USERS_INFO_ERROR,
            payload: e.response.data.message,
        })

    }

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
        account = Object.assign(JSON.parse(account), { ...user.data.data })
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


export const appliesListAction = (pageNo, size) => async dispatch => {
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



export const appliesOperateAction = (applyId, status) => async dispatch => {
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
