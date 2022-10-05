import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { fetching, Fetching, Response, Pager } from '../../common/interface'
import Axios from '../../common/axios/axios'

export interface EditListState extends Fetching {
    sortList: any[];
    searchList: Pager<any>;
}

const initialState = {
    ...fetching,
    loading: false,
    sortList: [],
    open: false,
    searchPager: {
        content: [],
        empty: true,
        first: true,
        last: true,
        number: 0,
        numberOfElements: 0,
        size: 0,
        totalElements: 0,
        totalPages: 0,
    }
}

export const searchDataSetAction = createAsyncThunk(
    'editList/dataSet/search',
    async (fun_params: {
        page: number,
        size: number,
    }) => {
        const result = await Axios.get(`/api/pangoo-data-set/dataSet`, {
            params: {
                ...fun_params,
                auditStatus: 1
            }
        })
        return result.data;
    }
);

export const getRecommandDataSetAction = createAsyncThunk(
    'editList/dataSet/recommand',
    async () => {
        const result = await Axios.get(`/api/pangoo-data-set/dataSet/topic`, {
            params: {
                type: 'recommend',
                page: 0,
                size: 999
            }
        })
        return result.data;
    }
);

export const sortDataSetAction = createAsyncThunk(
    'editList/dataSet/sort',
    async (fun_params: {
        datSetId: number,
        sortIndex: number,
    }[]) => {
        const result = await Axios.post(`/api/pangoo-data-set/dataSet/sort`, fun_params)
        return result.data;
    }
);

function swapArrayElementByIndex(arr: any[], first: number, second: number) {
    const tmp = arr[first]
    arr[first] = arr[second]
    arr[second] = tmp
}

interface elementCompareInterface {
    (element1: any, element2: any): boolean;
}
function isElementInArray(list: any[], compareElement: any, callback: elementCompareInterface) {
    list.map((element: any) => {
        if (callback(element, compareElement) === true) {
            return true;
        }
    })
    return false;
}

export const editListSlice = createSlice({
    name: 'editList',
    initialState,
    // The `reducers` field lets us define reducers and generate associated actions
    reducers: {
        openAddDataSetDialog: (state, action: PayloadAction<boolean>) => {
            state.open = action.payload;
        },
        add2SortList: (state, action: PayloadAction<any>) => {
            state.open = false
            let isIn = false
            state.sortList.map((element: any) => {
                if (element.id === action.payload.id) {
                    isIn = true
                }
            })
            if (isIn === false) {
                state.sortList.push(action.payload);
            }
        },
        upSortOrder: (state, action: PayloadAction<number>) => {
            swapArrayElementByIndex(state.sortList, action.payload, action.payload - 1)
        },
        topSortOrder: (state, action: PayloadAction<number>) => {
            swapArrayElementByIndex(state.sortList, action.payload, 0)
        },
        removeSortOrder: (state, action: PayloadAction<number>) => {
            state.sortList.splice(action.payload, 1)
        },
    },
    // The `extraReducers` field lets the slice handle actions defined elsewhere,
    // including actions generated by createAsyncThunk or in other slices.
    extraReducers: (builder) => {
        // searchDataSetAction
        builder
            .addCase(searchDataSetAction.pending, (state) => {
                state.loading = true
            })
            .addCase(searchDataSetAction.rejected, (state, action) => {
                state.loadError = true
                state.loading = false
                state.errorMsg = action.error.message
            })
            .addCase(searchDataSetAction.fulfilled, (state, action) => {
                state.loading = false
                let response = action.payload as Response<Pager<any>>
                state.searchPager = response.data
            })
        // getRecommandDataSetAction
        builder
            .addCase(getRecommandDataSetAction.pending, (state) => {
                state.loading = true
            })
            .addCase(getRecommandDataSetAction.rejected, (state, action) => {
                state.loadError = true
                state.loading = false
                state.errorMsg = action.error.message
            })
            .addCase(getRecommandDataSetAction.fulfilled, (state, action) => {
                state.loading = false
                let response = action.payload as Response<Pager<any>>
                state.sortList = response.data.content
            })
        // sortDataSetAction
        builder
            .addCase(sortDataSetAction.pending, (state) => {
                state.loading = true
            })
            .addCase(sortDataSetAction.rejected, (state, action) => {
                state.loadError = true
                state.loading = false
                state.errorMsg = action.error.message
            })
            .addCase(sortDataSetAction.fulfilled, (state, action) => {
                state.loading = false
                // let response = action.payload as Response<Pager<any>>
                // state.sortList = response.data.content
            })

    },
});

export const { add2SortList, openAddDataSetDialog, upSortOrder, topSortOrder, removeSortOrder } = editListSlice.actions;
export default editListSlice.reducer;