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
    charedLog: [],
    spendLog: [],
    createSuccess:false,
    coach:[],
    court:[],
    analyseCourt:[],


}



export const exploreCourseAnalyse = createAsyncThunk(
    'analyse/course',
    async (params, { rejectWithValue }) => {
        try {
            // throw new Error('Something bad happened');
            let formdata = new FormData()
            // payload.isExperience=0
            // payload.isDealing=0
            var startTime=moment().startOf('month').format('YYYY-MM-DD')
            var endTime=moment().endOf('month').format('YYYY-MM-DD')
            formdata.append('startTime',startTime)
            const response = await Axios.get(`/api/prepaidCard/coach/efficient?startTime=${startTime}&endTime=${endTime}`)
            return response.data;
        } catch (err) {
            return rejectWithValue(err)
        }
    }
);



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


export const exploreMemberCourse = createAsyncThunk(
    'lduser/course/member',
    async (params, { rejectWithValue }) => {
        try {
            // throw new Error('Something bad happened');
            let formdata = new FormData()
            // payload.isExperience=0
            // payload.isDealing=0
            var startTime=moment().subtract(180,'days').format('YYYY-MM-DD HH:mm:ss')
            formdata.append('startTime',startTime)

            const response = await Axios.get(`/api/prepaidCard/course/total?startTime=${startTime}&number=${params}`)
            return response.data;
        } catch (err) {
            return rejectWithValue(err)
        }
    }
);


export const exploreRecentCharge = createAsyncThunk(
    'lduser/cardLog',
    async (cardId, { rejectWithValue }) => {
        try {
            // throw new Error('Something bad happened');
            const response = await Axios.get(`/api/user/charged/${cardId}`)
            // if (response.status !== 0) {
            //     return rejectWithValue(response.data.message)
            // }
            return response.data;
        } catch (err) {
            return rejectWithValue(err)
        }
    }
);

export const exploreRecentSpend = createAsyncThunk(
    'lduser/spend',
    async (cardId, { rejectWithValue }) => {
        try {
            // throw new Error('Something bad happened');
            const response = await Axios.get(`/api/prepaidCard/spend?number=${cardId}`)
            // if (response.data.code !== 0) {
            //     return rejectWithValue(response.data.message)
            // }
            return response.data;
        } catch (err) {
            return rejectWithValue(err)
        }
    }
);




export const retreatCourseMember = createAsyncThunk(
    'lduser/course/retreat',
    async (params, { rejectWithValue }) => {
        try {
            // throw new Error('Something bad happened');
           
            const response = await Axios.delete(`/api/prepaidCard/course/${params.courseId}/${params.number}`)
            return response.data;
        } catch (err) {
            return rejectWithValue(err)
        }
    }
);

export const notifyCourse = createAsyncThunk(
    'lduser/course/notify',
    async (params, { rejectWithValue }) => {
        try {
            let formdata = new FormData()
            formdata.append('courseId',params)
            const response = await Axios.post(`/api/prepaidCard/course/notify`,formdata)
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
            formdata.append("courseType",  payload.courseType )
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


export const deleteCourese= createAsyncThunk(
    'lduser/deleteCourse',
    async (payload, { rejectWithValue }) => {
        try {
           

      
            // throw new Error('Something bad happened');
            const response = await Axios.request({method:'delete',url:`/api/prepaidCard/course/${payload}`})
            console.log("🚀 ~ file: dominationSlice.ts ~ line 109 ~ response", response)
            return response.data;
        } catch (err) {
            return rejectWithValue(err)
        }
    }
);




export const updateExpiredTime = createAsyncThunk(
    'lduser/updateExpiredTime',
    async (payload, { rejectWithValue }) => {
        try {

            let formdata = new FormData()
           
            formdata.append('number',payload.number)
            formdata.append('annualTimes',payload.annualTimes)
            formdata.append('annualExpireTime',payload.annualExpireTime)
            // throw new Error('Something bad happened');
            const response = await Axios.post(`/api/user/charged`,formdata)
            console.log("🚀 ~ file: dominationSlice.ts ~ line 109 ~ response", response)
            return response.data;
        } catch (err) {
            return rejectWithValue(err)
        }
    }
);


export const updateChargeAnnotation = createAsyncThunk(
    'lduser/chargeAnnotation',
    async (payload, { rejectWithValue }) => {
        try {

      
            let formdata = new FormData()
           
            formdata.append('number',payload.number)
            formdata.append('charged',payload.charged)
            formdata.append('times',payload.times)
            formdata.append('description',payload.description)
            formdata.append('worth',payload.worth)
            formdata.append('court',payload.court)
            // throw new Error('Something bad happened');
            const response = await Axios.post(`/api/user/charged`,formdata)
            console.log("🚀 ~ file: dominationSlice.ts ~ line 109 ~ response", response)
            // if (response.data.code !== 0) {
            //     return rejectWithValue(response.data.message)
            // }
            return response.data;
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
            .addCase(exploreMemberCourse.pending, (state) => {
                state.loading = true
                state.loadError = false
            })
            .addCase(exploreMemberCourse.rejected, (state, action) => {
                state.loadError = true
                state.loading = false
                state.errorMsg = getErrorMsg(action)
            })
            .addCase(exploreMemberCourse.fulfilled, (state, action) => {
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
            .addCase(exploreCourseAnalyse.pending, (state) => {
                state.loading = true

            })
            .addCase(exploreCourseAnalyse.rejected, (state, action) => {
                state.loadError = true
                state.loading = false

                state.errorMsg = getErrorMsg(action)
            })
            .addCase(exploreCourseAnalyse.fulfilled, (state, action) => {
                state.loading = false
                state.analyseCourt = action.payload

            });
        builder
            .addCase(exploreRecentCharge.pending, (state) => {
                state.createSuccess=false
                state.loading = true
                state.charedLog = []

            })
            .addCase(exploreRecentCharge.rejected, (state, action) => {
                state.loadError = true
                state.loading = false

                state.errorMsg = getErrorMsg(action)
            })
            .addCase(exploreRecentCharge.fulfilled, (state, action) => {
                state.loading = false
                state.charedLog =  action.payload.content
                
            });
        builder
            .addCase(exploreRecentSpend.pending, (state) => {
                state.createSuccess=false
                state.loading = true
                state.spendLog = []

            })
            .addCase(exploreRecentSpend.rejected, (state, action) => {
                state.loadError = true
                state.loading = false

                state.errorMsg = getErrorMsg(action)
            })
            .addCase(exploreRecentSpend.fulfilled, (state, action) => {
                state.loading = false
                state.spendLog =  action.payload
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
            .addCase(notifyCourse.pending, (state) => {
                state.loading = true
                state.createSuccess = false

            })
            .addCase(notifyCourse.rejected, (state, action) => {
                state.loadError = true
                state.loading = false
                state.createSuccess = false
                state.errorMsg = getErrorMsg(action)
            })
            .addCase(notifyCourse.fulfilled, (state, action) => {
                state.loading = false
                state.createSuccess = true
            });
        builder
            .addCase(deleteCourese.pending, (state) => {
                state.loading = true
                state.createSuccess = false

            })
            .addCase(deleteCourese.rejected, (state, action) => {
                state.loadError = true
                state.loading = false
                state.createSuccess = false
                state.errorMsg = getErrorMsg(action)
            })
            .addCase(deleteCourese.fulfilled, (state, action) => {
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
            .addCase(retreatCourseMember.pending, (state) => {
                state.loading = true
                state.createSuccess = false

            })
            .addCase(retreatCourseMember.rejected, (state, action) => {
                state.loadError = true
                state.loading = false
                state.createSuccess = false
                state.errorMsg = getErrorMsg(action)
            })
            .addCase(retreatCourseMember.fulfilled, (state, action) => {
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
