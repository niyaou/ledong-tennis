/*
 * @Descripttion: pangoo-dm
 * @version: 1.0
 * @Author: uidq1343
 * @Date: 2021-12-02 17:00:46
 * @LastEditors: uidq1343
 * @LastEditTime: 2022-04-29 15:44:11
 * @content: dataset explore
 */
import { InSensitiveActionType } from '../types'
import Axios from '../../common/axios/axios'
import { ManifestInfoFormValues } from "../common/interface"
const qs = require('qs');

export const dictionary = () => async dispatch => {
    dispatch({
        type: InSensitiveActionType.GET_DATA_DICTIONARY,
    })
    try {
        const url = `/api/pangoo-data-set/dataDictionary`
        const res = await Axios.get(url, {
            params: {
                classIds: ['dataType', 'labelType', 'taskType', 'usedScene']
            }, paramsSerializer: function (params) {
                return qs.stringify(params, { arrayFormat: 'brackets' })
            }
        })

        if (res.data.code === 0) {
            dispatch({
                type: InSensitiveActionType.GET_DATA_DICTIONARY_SUCCESS,
                payload: res.data.data,
            })
            return
        }

        dispatch({
            type: InSensitiveActionType.GET_DATA_DICTIONARY_ERROR,
            payload: res.data.message
        })
    }
    catch (e) {
        dispatch({
            type: InSensitiveActionType.CREATE_DATASET_ERROR,
            payload: e.toString()
        })

    }

}


export const createDataSet = (manifest: ManifestInfoFormValues, type: string) => async dispatch => {
    dispatch({
        type: InSensitiveActionType.CREATE_DATASET,
    })
    try {
        const url = type === 'tag' ? `/api/pangoo-data-set/dataSet/${manifest.id}/tag?tag=${manifest.tag}` : `/api/pangoo-data-set/dataSet`
        const res = type === 'create' ? await Axios.post(url, manifest) : type === 'edit' ? await Axios.put(url, manifest) : await Axios.patch(url, manifest)
        if (res.data.code === 0) {
            dispatch({
                type: InSensitiveActionType.CREATE_DATASET_SUCCESS,
                payload: res.data.data,
            })
            return
        }
        dispatch({
            type: InSensitiveActionType.CREATE_DATASET_ERROR,
            payload: res.data.message
        })
    }
    catch (e) {
        dispatch({
            type: InSensitiveActionType.CREATE_DATASET_ERROR,
            payload: e.response.data.message
        })

    }
}

export const deleteDataSet = (manifest: ManifestInfoFormValues) => async dispatch => {
    dispatch({
        type: InSensitiveActionType.DELETE_DATASET,
    })
    try {
        const url = `/api/pangoo-data-set/dataSet/${manifest.id}`
        const res = await Axios.delete(url, manifest)
        if (res.data.code === 0) {
            dispatch({
                type: InSensitiveActionType.DELETE_DATASET_SUCCESS,
                payload: manifest.family[0],
            })
            return
        }
        dispatch({
            type: InSensitiveActionType.DELETE_DATASET_ERROR,
            payload: res.data.message
        })
    }
    catch (e) {
        dispatch({
            type: InSensitiveActionType.DELETE_DATASET_ERROR,
            payload: e.response.data.message
        })

    }
}


export const rootProjects = (rootPath) => async dispatch => {
    dispatch({
        type: InSensitiveActionType.GET_PROJECT_LIST,
    })
    try {
        // const res = await Axios.get(`/api/pangoo-data-factory/folders?isDelete=0&pageNo=1&pageSize=100`)
        const res = await Axios.get(`/api/pangoo-data-set/dataSet/file/tree/fileSystem/folder?pageNo=${1}&pageSize=${100}&folderPath=${encodeURIComponent(rootPath)}`)

        if (res.data.code === 0) {
            let folders = res.data.data.result.map((folder) => {
                folder = Object.assign(folder, { id: folder.filePath, isProject: true })
                return folder
            })

            dispatch({
                type: InSensitiveActionType.GET_PROJECT_LIST_SUCCESS,
                payload: folders
            })
        } else {
            dispatch({
                type: InSensitiveActionType.GET_PROJECT_LIST_ERROR,
                payload: [res.data.data]
            })
        }
    }
    catch (e) {
        dispatch({
            type: InSensitiveActionType.GET_PROJECT_LIST_ERROR,
            payload: 'get project list error',
        })
    }
}



export const createInsensitiveFolder = (folderPath: string, folderName: string) => async dispatch => {
    dispatch({
        type: InSensitiveActionType.CREATE_INSENSITIVE_FOLDER,
    })
    try {
        const url = `/api/pangoo-warehouse/file/warehouse/addFolder?folderPath=${encodeURIComponent(folderPath)}&folderName=${encodeURIComponent(folderName)}`
        const res = await Axios.put(url)
        if (res.data.code === 0) {
            dispatch({
                type: InSensitiveActionType.CREATE_INSENSITIVE_FOLDER_SUCCESS,
                payload: res.data.data,
            })
            return
        }
        dispatch({
            type: InSensitiveActionType.CREATE_INSENSITIVE_FOLDER_ERROR,
            payload: res.data.message
        })
    }
    catch (e) {
        dispatch({
            type: InSensitiveActionType.CREATE_INSENSITIVE_FOLDER_ERROR,
            payload: e.response.data.message
        })

    }
}


export const deleteInsensitiveFolder = (folderPath: string) => async dispatch => {
    dispatch({
        type: InSensitiveActionType.DELETE_INSENSITIVE_FOLDER,
    })
    try {
        const url = `/api/pangoo-warehouse/file/warehouse?folderPath=${encodeURIComponent(folderPath)}`
        const res = await Axios.delete(url)
        if (res.data.code === 0) {
            dispatch({
                type: InSensitiveActionType.DELETE_INSENSITIVE_FOLDER_SUCCESS,
                payload: res.data.data,
            })
            return
        }
        dispatch({
            type: InSensitiveActionType.DELETE_INSENSITIVE_FOLDER_ERROR,
            payload: res.data.message
        })
    }
    catch (e) {
        dispatch({
            type: InSensitiveActionType.DELETE_INSENSITIVE_FOLDER_ERROR,
            payload: e.response.data.message
        })

    }
}



export const selectedAndMoveTaskAction = () => async dispatch => {
    dispatch({
        type: InSensitiveActionType.GET_SEARCH_MOVE_TASK,
    })
    try {
        // let searchStr = ''
        // for (let key in params) {
        //     if(key==='labelArray'){
        //         params[key]=encodeURIComponent(params[key])
        //     }
        //     searchStr = `${searchStr}${key}=${params[key]}&`
        // }
        // searchStr=encodeURIComponent(searchStr)
        // console.log("🚀 ~ file: filesAndFoldersActions.ts ~ line 229 ~ searchStr", searchStr)
        const res = await Axios.get(`/api/pangoo-warehouse/file/warehouse/taskQueue`)
        // let total = 0
        if (res.data.code === 0) {
            console.log("🚀 ~ file: inSensitiveActions.ts ~ line 221 ~ res.data", res.data)
            dispatch({
                type: InSensitiveActionType.GET_SEARCH_MOVE_TASK_SUCCESS,
                payload: res.data.data
            })
        } else {
            dispatch({
                type: InSensitiveActionType.GET_SEARCH_MOVE_TASK_ERROR,
                payload: res.data.message
            })
        }
    }
    catch (e) {
        dispatch({
            type: InSensitiveActionType.GET_SEARCH_MOVE_TASK_ERROR,
            payload: 'move file error',
        })
    }

}



export const deleteSelectedAndMoveTaskAction = (taskId) => async dispatch => {
    dispatch({
        type: InSensitiveActionType.DELETE_SEARCH_MOVE_TASK,
    })
    try {
     
        const res = await Axios.delete(`/api/pangoo-warehouse/file/warehouse/taskQueue?taskId=${encodeURIComponent(taskId)}`)
        // let total = 0
        if (res.data.code === 0) {
            dispatch({
                type: InSensitiveActionType.DELETE_SEARCH_MOVE_TASK_SUCCESS,
               
            })
        } else {
            dispatch({
                type: InSensitiveActionType.DELETE_SEARCH_MOVE_TASK_ERROR,
                payload:  'delete task error'
            })
        }
    }
    catch (e) {
        dispatch({
            type: InSensitiveActionType.DELETE_SEARCH_MOVE_TASK_ERROR,
            payload: 'delete task error',
        })
    }

}
