/*
 * @Descripttion: pangoo-dm
 * @version: 1.0
 * @Author: uidq1343
 * @Date: 2022-04-18 17:11:38
 * @LastEditors: uidq1343
 * @LastEditTime: 2022-04-21 15:01:18
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
    tags:[],
    scenes:[],
}


export const tagsInfoAction = createAsyncThunk(
    'filewareHouse/tagsInfo',
    async (params, { rejectWithValue }) => {
        try {
            const response = await Axios.get(`/api/pangoo-data-factory/management/levels?isActive=1&scene=0`)
            return response.data.data;
        } catch (err) {
            return rejectWithValue(err)
        }
    }
);

export const scenceInfoAction = createAsyncThunk(
    'filewareHouse/scenceInfo',
    async (params, { rejectWithValue }) => {
        try {
            const response = await Axios.get(`/api/pangoo-data-factory/management/levels?isActive=1&scene=1`)
            return response.data.data;
        } catch (err) {
            return rejectWithValue(err)
        }
    }
);


const parseTags = (resp,type)=>{
    return resp.filter((i)=>{
        return i.scene===type
    })

}

export const tagsInfoSlice = createSlice({
    name: 'tagsInfo',
    initialState,
    // The `reducers` field lets us define reducers and generate associated actions
    reducers: {
    },
    // The `extraReducers` field lets the slice handle actions defined elsewhere,
    // including actions generated by createAsyncThunk or in other slices.
    extraReducers: (builder) => {
        builder
            .addCase(tagsInfoAction.pending, (state) => {
                state.loading = true
                state.loadError = false
                state.errorMsg = ""
                state.isSuccess = false
              
            })
            .addCase(tagsInfoAction.rejected, (state, action) => {
                state.loadError = true
                state.loading = false
                state.errorMsg = getErrorMsg(action)
            })
            .addCase(tagsInfoAction.fulfilled, (state, action) => {
                state.loading = false
                state.isSuccess = true
                state.tags=parseTags(action.payload,0)
            })
            .addCase(scenceInfoAction.pending, (state) => {
                state.loading = true
                state.loadError = false
                state.errorMsg = ""
                state.isSuccess = false
              
            })
            .addCase(scenceInfoAction.rejected, (state, action) => {
                state.loadError = true
                state.loading = false
                state.errorMsg = getErrorMsg(action)
            })
            .addCase(scenceInfoAction.fulfilled, (state, action) => {
                state.loading = false
                state.isSuccess = true
                state.scenes=parseTags(action.payload,1)
            })
    },
});


export default tagsInfoSlice.reducer;