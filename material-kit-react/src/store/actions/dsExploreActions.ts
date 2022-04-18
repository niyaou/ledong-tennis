/*
 * @Descripttion: pangoo-dm
 * @version: 1.0
 * @Author: uidq1343
 * @Date: 2021-12-02 17:00:46
 * @LastEditors: uidq1343
 * @LastEditTime: 2022-03-23 13:41:05
 * @content: dataset explore
 */
import { DatasetExploreActionType } from '../types'
import Axios from '../../common/axios/axios'
import {PageableParmas} from '../../common/interface'




export const datasetImg = async (id) => {
    try {
        const res = await Axios.get(`/api/pangoo-data-set/dataSet/${id}/coverImage`)
        return res
    }
    catch (e) {
        console.log(e)
    }
}


export const exploreDatasets = (params:PageableParmas<number>) => async dispatch => {
    dispatch({
        type: DatasetExploreActionType.GET_HOLE_DATASET,
    })
    try {
        const res = await Axios.get(`/api/pangoo-data-set/dataSet`,{
            params: params})
        
        if (res.data.code === 0) {
            dispatch({
                type: DatasetExploreActionType.GET_HOLE_DATASET_SUCCESS,
                payload: res.data.data
            })
        }
    }
    catch (e) {

        dispatch({
            type: DatasetExploreActionType.GET_HOLE_DATASET_ERROR,
            payload:  'get dataSet list error',
        })
    }
}

export const exploreAuditDatasets = (params,auditStatus) => async dispatch => {
    dispatch({
        type: DatasetExploreActionType.GET_HOLE_DATASET,
    })
    try {
        // params = Object.assign(params, {auditStatus})
        const res = await Axios.get(`/api/pangoo-data-set/dataSet/audit?auditStatus=${auditStatus}`,{
            params: params})
        
        if (res.data.code === 0) {
            dispatch({
                type: DatasetExploreActionType.GET_HOLE_DATASET_SUCCESS,
                payload: res.data.data
            })
        }
    }
    catch (e) {

        dispatch({
            type: DatasetExploreActionType.GET_HOLE_DATASET_ERROR,
            payload:  'get dataSet list error',
        })
    }
}

export const datasetById = (id) => async dispatch => {
    dispatch({
        type: DatasetExploreActionType.GET_SINGLE_DATASET,
    })
    try {
        const res = await Axios.get(`/api/pangoo-data-set/dataSet/${id}`,)
        if (res.data.code === 0) {
            dispatch({
                type: DatasetExploreActionType.GET_SINGLE_DATASET_SUCCESS,
                payload: [res.data.data]
            })
        }
    }
    catch (e) {
        dispatch({
            type: DatasetExploreActionType.GET_SINGLE_DATASET_ERROR,
            payload: 'get dataSet information error',
        })
    }

}




export const datasetFavorate = (id,favorate) => async dispatch => {
    dispatch({
        type: DatasetExploreActionType.POST_FAVORATE_DATASET,
    })
    try {
        const request= favorate?Axios.post(`/api/pangoo-data-set/dataSetFavourite?datasetId=${id}`):Axios.delete(`/api/pangoo-data-set/dataSetFavourite?datasetId=${id}`)
        const res = await request
        if (res.data.code === 0) {
            dispatch({
                type: DatasetExploreActionType.POST_FAVORATE_DATASET_SUCCESS,
                payload: {id,favorate}
            })
        }else{
            dispatch({
                type: DatasetExploreActionType.POST_FAVORATE_DATASET_ERROR,
                payload: [res.data.data]
            })
        }
    }
    catch (e) {
        dispatch({
            type: DatasetExploreActionType.POST_FAVORATE_DATASET_ERROR,
            payload:  'get favorate list error',
        })
    }

}