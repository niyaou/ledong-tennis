/**
 * 配合reudx tool的createAsyncThunk rejectWithValue和exploreDataSetAction.rejected使用
 * @param action 
 * @returns 
 */
/* eslint-disable */
export function getErrorMsg(action) {
    if (action.payload) {
        let payload = action.payload
        //非axios错误
        if (!payload.response) {
            return payload.message
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
