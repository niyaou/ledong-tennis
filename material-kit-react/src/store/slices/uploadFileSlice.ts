/*
 * @Descripttion: pangoo-dm
 * @version: 1.0
 * @Author: uidq1343
 * @Date: 2022-02-14 10:54:00
 * @LastEditors: uidq1343
 * @LastEditTime: 2022-04-22 14:23:27
 * @content: edit your page content
 */
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { fetching, Fetching } from '../../common/interface'
import Axios from '../../common/axios/axios'
import { getErrorMsg } from '../../common/utils/reduxUtil'



const initialState = {
    ...fetching,
    loading: false,
    isSuccess: false,
    dataSet:null,
    taskInfo:null,

}

function parseArrStr(arrs){
    return arrs.map(str => str.replace('&','%26'))
}
// The function below is called a thunk and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
// will call the thunk with the `dispatch` function as the first argument. Async
// code can then be executed and other actions can be dispatched. Thunks are
// typically used to make async requests.
export const uploadFileTagsAndScenesAction = createAsyncThunk(
    'uploadFile/tagsAndScenes',
    async (params, { rejectWithValue }) => {
        try {
            let url = `/api/pangoo-warehouse/file/warehouse/atts?attsArray=${parseArrStr(params.tags)}&senceAttsArray=${parseArrStr(params.scenes)}&fileIds=${params.fileId}`
            const response = await Axios.put(url)
            if(response.data.data.processCode === 0){
                return response.data;
            }else{
                return rejectWithValue(response.data.data.processMsg)
            }
        } catch (err) {
            return rejectWithValue(err)
        }
    }
);




export const uploadFileFolderIndexAction = createAsyncThunk(
    'uploadFile/fileFolderIndex',
    async (params, { rejectWithValue }) => {
        try {
            let url = `/api/pangoo-warehouse/file/warehouse/manual/index?path=${params}`
            const response = await Axios.post(url)
            if(response.data.data.processCode === 0){
                return response.data;
            }else{
                return rejectWithValue(response.data.data.processMsg)
            }
        } catch (err) {
            return rejectWithValue(err)
        }
    }
);







export const uploadFileSlice = createSlice({
    name: 'uploadFile',
    initialState,
    // The `reducers` field lets us define reducers and generate associated actions
    reducers: {
    },
    // The `extraReducers` field lets the slice handle actions defined elsewhere,
    // including actions generated by createAsyncThunk or in other slices.
    extraReducers: (builder) => {
        builder
           
            .addCase(uploadFileTagsAndScenesAction.pending, (state) => {
                state.loading = true
                state.loadError = false
                state.errorMsg = ""
                state.isSuccess = false
            })
            .addCase(uploadFileTagsAndScenesAction.rejected, (state, action) => {
                state.loadError = true
                state.loading = false
                state.errorMsg = getErrorMsg(action)
            })
            .addCase(uploadFileTagsAndScenesAction.fulfilled, (state, action) => {
                state.loading = false
                state.isSuccess = true
            })
            .addCase(uploadFileFolderIndexAction.pending, (state) => {
                state.loading = true
                state.loadError = false
                state.errorMsg = ""
                state.isSuccess = false
            })
            .addCase(uploadFileFolderIndexAction.rejected, (state, action) => {
                state.loadError = true
                state.loading = false
                state.errorMsg = getErrorMsg(action)
            })
            .addCase(uploadFileFolderIndexAction.fulfilled, (state, action) => {
                state.loading = false
                state.isSuccess = true
            })


    },
});

// export const { increment, decrement, incrementByAmount } = exploreSlice.actions;
export default uploadFileSlice.reducer;
