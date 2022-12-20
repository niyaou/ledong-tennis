/*
 * @Descripttion: pangoo-dm
 * @version: 1.0
 * @Author: uidq1343
 * @Date: 2022-03-08 17:35:13
 * @LastEditors: uidq1343
 * @LastEditTime: 2022-05-11 15:08:51
 * @content: edit your page content
 */
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { fetching, Fetching } from '../../common/interface'
import Axios from '../../common/axios/axios'
import { getErrorMsg } from '../../common/utils/reduxUtil'
import moment from 'moment'
export interface DominationState extends Fetching {
    favourite: any[];
    hot: any[];
    recommend: any[];
    trending: any[];
    areas: any[];
}

const initialState = {
    ...fetching,
    loading: false,
    users: [],
    course: [],
    areas: ['音乐花园校区', '雅居乐校区', '英郡校区', '银泰城校区', '麓坊校区', '领馆国际城校区', '一品天下校区', '天府环宇坊校区', '其他'],
    sortValue: ['年卡', '次卡', '充值卡'],
    selectCourse: null,
    recentPrepayedCard: null,
    createSuccess:false,
    coach:[],
    court:[],


}
// The function below is called a thunk and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
// will call the thunk with the `dispatch` function as the first argument. Async
// code can then be executed and other actions can be dispatched. Thunks are
// typically used to make async requests.
export const exploreUsersAction = createAsyncThunk(
    'lduser/explore',
    async (params, { rejectWithValue }) => {
        try {
            // throw new Error('Something bad happened');
            const response = await Axios.get(`/api/user/`)
            console.log("🚀 ~ file: dominationSlice.ts ~ line 40 ~ response", response)
            if (response.status !== 200) {
                return rejectWithValue(response.data.message)
            }
            return response.data;
        } catch (err) {
            return rejectWithValue(err)
        }
    }
);







export const exploreCoachAction = createAsyncThunk(
    'lduser/coach',
    async (params, { rejectWithValue }) => {
        try {
            // throw new Error('Something bad happened');
            const response = await Axios.get(`/api/user/coach/`)
            console.log("🚀 ~ file: dominationSlice.ts ~ line 40 ~ response", response)
            if (response.status !== 200) {
                return rejectWithValue(response.data.message)
            }
            return response.data;
        } catch (err) {
            return rejectWithValue(err)
        }
    }
);

export const exploreCourtAction = createAsyncThunk(
    'lduser/court',
    async (params, { rejectWithValue }) => {
        try {
            // throw new Error('Something bad happened');
            const response = await Axios.get(`/api/user/court/`)
            console.log("🚀 ~ file: dominationSlice.ts ~ line 40 ~ response", response)
            if (response.status !== 200) {
                return rejectWithValue(response.data.message)
            }
            return response.data;
        } catch (err) {
            return rejectWithValue(err)
        }
    }
);







export const exploreRecentCourse = createAsyncThunk(
    'lduser/course',
    async (params, { rejectWithValue }) => {
        try {
            // throw new Error('Something bad happened');
            let formdata = new FormData()
    
       


            // payload.isExperience=0
            // payload.isDealing=0
            var startTime=moment().subtract(180,'days').format('YYYY-MM-DD HH:mm:ss')
            formdata.append('startTime',startTime)

            const response = await Axios.get(`/api/prepaidCard/course/total?startTime=${startTime}`)
            return response.data;
        } catch (err) {
            return rejectWithValue(err)
        }
    }
);

export const exploreRecentCard = createAsyncThunk(
    'lduser/cardLog',
    async (cardId, { rejectWithValue }) => {
        try {
            // throw new Error('Something bad happened');
            const response = await Axios.get(`/api/prepaidCard/ld/finacialLogs?cardId=${cardId}`)
            if (response.data.code !== 0) {
                return rejectWithValue(response.data.message)
            }
            return response.data.data;
        } catch (err) {
            return rejectWithValue(err)
        }
    }
);



export const retreatRecentCourse = createAsyncThunk(
    'lduser/course/retreat',
    async (params, { rejectWithValue }) => {
        try {
            // throw new Error('Something bad happened');
           if(params.spendingTime>3){
      
            if (params.spendingTime <= 60) {
                params.spendingTime = 1
              } else if (params.spendingTime <= 90) {
                params.spendingTime = 1.5
              } else if (params.spendingTime <= 120) {
                params.spendingTime = 2
              } else if (params.spendingTime <= 180) {
                params.spendingTime = 2.5
              }else{
                params.spendingTime=3
              }
            }
            const response = await Axios.post(`/api/prepaidCard/ld/chargeLogRetreat?cardId=${params.cardId}&time=${params.time}`)
            return response.data;
        } catch (err) {
            return rejectWithValue(err)
        }
    }
);




export const createCard = createAsyncThunk(
    'lduser/createCard',
    async (payload, { rejectWithValue }) => {
        try {

            let formdata = new FormData()
    
       


            // payload.isExperience=0
            // payload.isDealing=0
            payload.startTime=moment(payload.startTime).format('YYYY-MM-DD HH:mm')
            payload.endTime=moment(payload.endTime).format('YYYY-MM-DD HH:mm')

            formdata.append("startTime",    payload.startTime)
            formdata.append("endTime",    payload.endTime)
            formdata.append("coachName",  payload.coach)
            formdata.append("spendingTime", payload.spendingTime  )
            formdata.append("courtName",  payload.court )
            formdata.append("descript",  payload.descript )
            formdata.append("membersObj", JSON.stringify( payload. membersObj))


            const response = await Axios.post(`/api/prepaidCard/course/create`,formdata)
            console.log("🚀 ~ file: dominationSlice.ts ~ line 109 ~ response", response)
            if (response.status !== 200) {
                return rejectWithValue(response.data.message)
            }
            return response.data;
            // return {};
        } catch (err) {
            return rejectWithValue(err)
        }
    }
);


export const updateCourese= createAsyncThunk(
    'lduser/updateCourse',
    async (payload, { rejectWithValue }) => {
        try {
            // payload.isExperience=0
            // payload.isDealing=0
            payload.startTime=moment(payload.startTime).format('YYYY-MM-DD HH:mm')
            payload.endTime=moment(payload.endTime).format('YYYY-MM-DD HH:mm')

      
            // throw new Error('Something bad happened');
            const response = await Axios.request({method:'post',url:`/api/course/ld/uploadCourse`,params:payload})
            console.log("🚀 ~ file: dominationSlice.ts ~ line 109 ~ response", response)
            if (response.data.code !== 0) {
                return rejectWithValue(response.data.message)
            }
            return response.data.data;
        } catch (err) {
            return rejectWithValue(err)
        }
    }
);




export const updateExpiredTime = createAsyncThunk(
    'lduser/updateExpiredTime',
    async (payload, { rejectWithValue }) => {
        try {

        

            // throw new Error('Something bad happened');
            const response = await Axios.request({method:'post',url:`/api/prepaidCard/ld/updateExpireTime`,params:payload})
            console.log("🚀 ~ file: dominationSlice.ts ~ line 109 ~ response", response)
            if (response.data.code !== 0) {
                return rejectWithValue(response.data.message)
            }
            return response.data.data;
        } catch (err) {
            return rejectWithValue(err)
        }
    }
);


export const updateChargeAnnotation = createAsyncThunk(
    'lduser/chargeAnnotation',
    async (payload, { rejectWithValue }) => {
        try {

      

            // throw new Error('Something bad happened');
            const response = await Axios.request({method:'post',url:`/api/prepaidCard/ld/chargeAnnotation`,params:payload})
            console.log("🚀 ~ file: dominationSlice.ts ~ line 109 ~ response", response)
            if (response.data.code !== 0) {
                return rejectWithValue(response.data.message)
            }
            return response.data.data;
        } catch (err) {
            return rejectWithValue(err)
        }
    }
);




export const selectCourse = createAsyncThunk(
    'lduser/course/select',
    async (params, { rejectWithValue }) => {
        try {
            // throw new Error('Something bad happened');

            return params;
        } catch (err) {
            return rejectWithValue(err)
        }
    }
);

export const exploreSlice = createSlice({
    name: 'domination',
    initialState,
    // The `reducers` field lets us define reducers and generate associated actions
    reducers: {
        // increment: (state) => {
        //     state.value += 1;
        // },
    },
    // The `extraReducers` field lets the slice handle actions defined elsewhere,
    // including actions generated by createAsyncThunk or in other slices.
    extraReducers: (builder) => {
        builder
            .addCase(exploreUsersAction.pending, (state) => {
                state.loading = true
            })
            .addCase(exploreUsersAction.rejected, (state, action) => {
                state.loadError = true
                state.loading = false

                state.errorMsg = getErrorMsg(action)
            })
            .addCase(exploreUsersAction.fulfilled, (state, action) => {
                state.loading = false
                state.users = action.payload
                // state.favourite = action.payload.data.favourite
                // state.hot = action.payload.data.hot
                // state.recommend = action.payload.data.recommend
                // state.trending = action.payload.data.trending
            });
        builder
            .addCase(exploreRecentCourse.pending, (state) => {
                state.loading = true
                state.loadError = false
            })
            .addCase(exploreRecentCourse.rejected, (state, action) => {
                state.loadError = true
                state.loading = false
                state.errorMsg = getErrorMsg(action)
            })
            .addCase(exploreRecentCourse.fulfilled, (state, action) => {
                state.loading = false
                state.course = action.payload.content

            });
        builder
            .addCase(selectCourse.pending, (state) => {
                state.loading = true

            })
            .addCase(selectCourse.rejected, (state, action) => {
                state.loadError = true
                state.loading = false

                state.errorMsg = getErrorMsg(action)
            })
            .addCase(selectCourse.fulfilled, (state, action) => {
                state.loading = false
                state.selectCourse = action.payload

            });
        builder
            .addCase(exploreRecentCard.pending, (state) => {
                state.createSuccess=false
                state.loading = true
                state.recentPrepayedCard = null

            })
            .addCase(exploreRecentCard.rejected, (state, action) => {
                state.loadError = true
                state.loading = false

                state.errorMsg = getErrorMsg(action)
            })
            .addCase(exploreRecentCard.fulfilled, (state, action) => {
                console.log(  state.recentPrepayedCard )
                state.loading = false
                state.recentPrepayedCard = JSON.parse( action.payload)
                
            });
        builder
            .addCase(createCard.pending, (state) => {
                state.loading = true
                state.createSuccess = false

            })
            .addCase(createCard.rejected, (state, action) => {
                state.loadError = true
                state.loading = false
                state.createSuccess = false
                state.errorMsg = getErrorMsg(action)
            })
            .addCase(createCard.fulfilled, (state, action) => {
                state.loading = false
                state.createSuccess = true
            });
        builder
            .addCase(updateExpiredTime.pending, (state) => {
                state.loading = true
                state.createSuccess = false

            })
            .addCase(updateExpiredTime.rejected, (state, action) => {
                state.loadError = true
                state.loading = false
                state.createSuccess = false
                state.errorMsg = getErrorMsg(action)
            })
            .addCase(updateExpiredTime.fulfilled, (state, action) => {
                state.loading = false
                state.createSuccess = true
            });
        builder
            .addCase(updateChargeAnnotation.pending, (state) => {
                state.loading = true
                state.createSuccess = false

            })
            .addCase(updateChargeAnnotation.rejected, (state, action) => {
                state.loadError = true
                state.loading = false
                state.createSuccess = false
                state.errorMsg = getErrorMsg(action)
            })
            .addCase(updateChargeAnnotation.fulfilled, (state, action) => {
                state.loading = false
                state.createSuccess = true
            });
        builder
            .addCase(updateCourese.pending, (state) => {
                state.loading = true
                state.createSuccess = false

            })
            .addCase(updateCourese.rejected, (state, action) => {
                state.loadError = true
                state.loading = false
                state.createSuccess = false
                state.errorMsg = getErrorMsg(action)
            })
            .addCase(updateCourese.fulfilled, (state, action) => {
                state.loading = false
                state.createSuccess = true
            });
    
        builder
            .addCase(retreatRecentCourse.pending, (state) => {
                state.loading = true
                state.createSuccess = false

            })
            .addCase(retreatRecentCourse.rejected, (state, action) => {
                state.loadError = true
                state.loading = false
                state.createSuccess = false
                state.errorMsg = getErrorMsg(action)
            })
            .addCase(retreatRecentCourse.fulfilled, (state, action) => {
                state.loading = false
                state.createSuccess = true
            });


        builder
            .addCase(exploreCoachAction.pending, (state) => {
                state.loading = true
                state.createSuccess = false

            })
            .addCase(exploreCoachAction.rejected, (state, action) => {
                state.loadError = true
                state.loading = false
                state.createSuccess = false
                state.errorMsg = getErrorMsg(action)
            })
            .addCase(exploreCoachAction.fulfilled, (state, action) => {
                state.loading = false
                state.coach = action.payload
            });
        builder
            .addCase(exploreCourtAction.pending, (state) => {
                state.loading = true
                state.createSuccess = false

            })
            .addCase(exploreCourtAction.rejected, (state, action) => {
                state.loadError = true
                state.loading = false
                state.createSuccess = false
                state.errorMsg = getErrorMsg(action)
            })
            .addCase(exploreCourtAction.fulfilled, (state, action) => {
                state.loading = false
                state.court = action.payload
            });
    },
});

// export const { increment, decrement, incrementByAmount } = exploreSlice.actions;
export default exploreSlice.reducer;
