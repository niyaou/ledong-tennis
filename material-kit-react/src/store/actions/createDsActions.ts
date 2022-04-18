/*
 * @Descripttion: pangoo-dm
 * @version: 1.0
 * @Author: uidq1343
 * @Date: 2021-12-02 17:00:46
 * @LastEditors: uidq1343
 * @LastEditTime: 2022-02-23 14:46:56
 * @content: dataset explore
 */
import { DataDictionaryActionType } from '../types'
import Axios from '../../common/axios/axios'
import {ManifestInfoFormValues} from "../common/interface"
const qs = require('qs');

export const dictionary = () => async dispatch => {
    dispatch({
        type: DataDictionaryActionType.GET_DATA_DICTIONARY,
    })
    try {
        const url = `/api/pangoo-data-set/dataDictionary`
        const res = await Axios.get(url, {
            params: {
                classIds: ['dataType','labelType','taskType','usedScene']
            }, paramsSerializer: function (params) {
                return qs.stringify(params, { arrayFormat: 'brackets' })
            }
        })  
     
        if (res.data.code === 0) {
            dispatch({
                type: DataDictionaryActionType.GET_DATA_DICTIONARY_SUCCESS,
                payload: res.data.data,
            })
            return
        }

        dispatch({
            type: DataDictionaryActionType.GET_DATA_DICTIONARY_ERROR,
            payload: res.data.message
        })
    }
    catch (e) {
        dispatch({
            type: DataDictionaryActionType.CREATE_DATASET_ERROR,
            payload: e.toString()
        })

    }

}


export const createDataSet = (manifest:ManifestInfoFormValues,type:string) => async dispatch => {
    dispatch({
        type: DataDictionaryActionType.CREATE_DATASET,
    })
    try {
        const url = type ==='tag'? `/api/pangoo-data-set/dataSet/${manifest.id}/tag?tag=${manifest.tag}`:`/api/pangoo-data-set/dataSet`
        const res = type ==='create'? await Axios.post(url,manifest)  : type ==='edit'? await Axios.put(url,manifest):await Axios.patch(url,manifest)
        if (res.data.code === 0) {
            dispatch({
                type: DataDictionaryActionType.CREATE_DATASET_SUCCESS,
                payload: res.data.data,
            })
            return
        }
        dispatch({
            type: DataDictionaryActionType.CREATE_DATASET_ERROR,
            payload: res.data.message
        })
    }
    catch (e) {
        dispatch({
            type: DataDictionaryActionType.CREATE_DATASET_ERROR,
            payload: e.response.data.message
        })

    }
}

export const deleteDataSet = (manifest:ManifestInfoFormValues) => async dispatch => {
    dispatch({
        type: DataDictionaryActionType.DELETE_DATASET,
    })
    try {
        const url = `/api/pangoo-data-set/dataSet/${manifest.id}`
        const res = await Axios.delete(url,manifest)  
        if (res.data.code === 0) {
            dispatch({
                type: DataDictionaryActionType.DELETE_DATASET_SUCCESS,
                payload: manifest.family[0],
            })
            return
        }
        dispatch({
            type: DataDictionaryActionType.DELETE_DATASET_ERROR,
            payload: res.data.message
        })
    }
    catch (e) {
        dispatch({
            type: DataDictionaryActionType.DELETE_DATASET_ERROR,
            payload: e.response.data.message
        })

    }
}