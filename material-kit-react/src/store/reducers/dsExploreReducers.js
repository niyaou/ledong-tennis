/*
 * @Descripttion: pangoo-dm
 * @version: 1.0
 * @Author: uidq1343
 * @Date: 2021-12-02 16:54:51
 * @LastEditors: uidq1343
 * @LastEditTime: 2022-03-23 14:57:11
 * @content: dataset list and classes reducer
 */
import { DatasetExploreActionType } from '../types'
import { fetching } from '../../common/interface'
const initialState = {
    ...fetching,
    classes: [],
    datasets: [],
    needRefresh:false
}

export default function (state = initialState, action) {
    switch (action.type) {

        case DatasetExploreActionType.GET_HOLE_DATASET:
            return {
                ...state,
                loading: true,
                errorMsg: '',
                loadError:false,
                needRefresh:false,
            }
        case DatasetExploreActionType.GET_HOLE_DATASET_SUCCESS:
            return {
                ...state,
                loading: false,
                errorMsg: '',
                loadError: false,
                datasets: action.payload,
                needRefresh:false,
            }
        case DatasetExploreActionType.GET_HOLE_DATASET_ERROR:
            return {
                ...state,
                loading: false,
                errorMsg: action.payload,
                loadError: true,
                needRefresh:false,
            }
        case DatasetExploreActionType.GET_SINGLE_DATASET:
            return {
                ...state,
                loading: true,
                errorMsg: '',
                loadError:false,
                needRefresh:false,
            }
        case DatasetExploreActionType.GET_SINGLE_DATASET_SUCCESS:
            return {
                ...state,
                loading: false,
                errorMsg: '',
                loadError: false,
                datasets: action.payload,
                needRefresh:false,
            }
        case DatasetExploreActionType.GET_SINGLE_DATASET_ERROR:
            return {
                ...state,
                loading: false,
                errorMsg: action.payload,
                loadError: true,
                needRefresh:false,
            }

            case DatasetExploreActionType.POST_FAVORATE_DATASET:
                return {
                    ...state,
                    loading: true,
                    errorMsg: '',
                    loadError:false,
                    needRefresh:false,
                }
            case DatasetExploreActionType.POST_FAVORATE_DATASET_SUCCESS:
                return {
                    ...state,
                    loading: false,
                    errorMsg: '',
                    loadError: false,
                    datasets: action.payload,
                    needRefresh:true,
                }
            case DatasetExploreActionType.POST_FAVORATE_DATASET_ERROR:
                return {
                    ...state,
                    loading: false,
                    errorMsg: action.payload,
                    loadError: true,
                    needRefresh:false,
                }
        default: return {
            ...state,
            loadError:false,
        }
    }
}