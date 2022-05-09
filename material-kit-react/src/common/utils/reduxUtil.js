/*
 * @Descripttion: pangoo-dm
 * @version: 1.0
 * @Author: uidq1343
 * @Date: 2022-04-08 15:01:31
 * @LastEditors: uidq1343
 * @LastEditTime: 2022-04-21 15:00:10
 * @content: edit your page content
 */
/**
 * 配合reudx tool的createAsyncThunk rejectWithValue和exploreUsersAction.rejected使用
 * @param action 
 * @returns 
 */
export function getErrorMsg(action) {
    if (action.payload) {
        let payload = action.payload
        //非axios错误
        if (!payload.response) {
            return payload||payload.message
        }
        //后台错误
        else if (payload.response.data.message) {
            return payload.response.data.message
        }
        //非axios错误
        else {
            return payload.response.data
        }
    }else{
        return action.error.message
    }

}
