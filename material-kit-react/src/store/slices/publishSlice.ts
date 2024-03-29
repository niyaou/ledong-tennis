/*
 * @Descripttion: pangoo-dm
 * @version: 1.0
 * @Author: uidq1343
 * @Date: 2022-02-14 10:54:00
 * @LastEditors: uidq1343
 * @LastEditTime: 2022-03-25 14:59:02
 * @content: edit your page content
 */
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { fetching, Fetching } from '../../common/interface'
import Axios from '../../common/axios/axios'
import { getErrorMsg } from '../../common/utils/reduxUtil'


export interface DominationState extends Fetching {
    favourite: any[];
    hot: any[];
    recommend: any[];
    trending: any[];
}

const initialState = {
    ...fetching,
    loading: false,
    isSuccess: false,
    dataSet:null,
    taskInfo:null,

}
// The function below is called a thunk and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
// will call the thunk with the `dispatch` function as the first argument. Async
// code can then be executed and other actions can be dispatched. Thunks are
// typically used to make async requests.
export const publishAction = createAsyncThunk(
    'dataSet/publish',
    async (params, { rejectWithValue }) => {
        try {
            const response = await Axios.patch(`/api/pangoo-data-set/dataSet/${params.datasetId}/publish?dataSetStatus=${params.dataSetStatus}`)
            return response.data;
        } catch (err) {
            return rejectWithValue(err)
        }
    }
);

export const auditAction = createAsyncThunk(
    'dataSet/audit',
    async (params) => {
        const response = await Axios.patch(`/api/pangoo-data-set/dataSet/${params.datasetId}/audit?auditStatus=${params.auditStatus}&auditRefusedReason=${params.auditRefusedReason || ''}`)
        return response.data;
    }
);


export const annotationAction = createAsyncThunk(
    'dataSet/file/tree/copy',
    async (params, { rejectWithValue }) => {
        try {
        const response = await Axios.put(`/api/pangoo-data-set/dataSet/file/tree/copy/${params.id}?destPath=${params.path}`)
        return response.data;
    } catch (err) {
        return rejectWithValue(err)
    }
    }
);


export const taskStatusAction = createAsyncThunk(
    'dataSet/file/tree/status',
    async (dataSet, { rejectWithValue }) => {
        try {
        const response = await Axios.put(`/api/pangoo-data-set/dataSet/file/tree/${dataSet.id}/status`)
        return response.data;
    } catch (err) {
        return rejectWithValue(err)
    }
    }
);



export const publishClearAction = createAsyncThunk(
    'clear',
    async (paras) => {
        const response = await new Promise((resolve, reject) => {
            resolve({ data: '' })
        })
        return response.data;
    }
);




export const publishSlice = createSlice({
    name: 'publish',
    initialState,
    // The `reducers` field lets us define reducers and generate associated actions
    reducers: {
    },
    // The `extraReducers` field lets the slice handle actions defined elsewhere,
    // including actions generated by createAsyncThunk or in other slices.
    extraReducers: (builder) => {
        builder
            .addCase(publishClearAction.pending, (state) => {
                state.loading = false
                state.loadError = false
                state.errorMsg = ""
                state.isSuccess = false
            })
            .addCase(publishAction.pending, (state) => {
                state.loading = true
                state.loadError = false
                state.errorMsg = ""
                state.isSuccess = false
            })
            .addCase(publishAction.rejected, (state, action) => {
                state.loadError = true
                state.loading = false
                state.errorMsg = getErrorMsg(action)
            })
            .addCase(publishAction.fulfilled, (state, action) => {
                state.loading = false
                state.isSuccess = true
            })
            .addCase(auditAction.pending, (state) => {
                state.loading = true
                state.loadError = false
                state.errorMsg = ""
                state.isSuccess = false
            })
            .addCase(auditAction.rejected, (state, action) => {
                state.loadError = true
                state.loading = false
                state.errorMsg = action.error.message
            })
            .addCase(auditAction.fulfilled, (state, action) => {
                state.loading = false
                state.isSuccess = true
            })
            .addCase(annotationAction.pending, (state) => {
                state.loading = true
                state.loadError = false
                state.errorMsg = ""
                state.isSuccess = false
                state.dataSet = null
            })
            .addCase(annotationAction.rejected, (state, action) => {
                state.loadError = true
                state.loading = false
                state.errorMsg = action.error.message
            })
            .addCase(annotationAction.fulfilled, (state, action) => {
                state.loading = false
                state.isSuccess = true
                state.dataSet = action.payload.data
            })
    },
});

// export const { increment, decrement, incrementByAmount } = exploreSlice.actions;
export default publishSlice.reducer;
