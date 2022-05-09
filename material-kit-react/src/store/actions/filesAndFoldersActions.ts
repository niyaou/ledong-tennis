/*
 * @Descripttion: pangoo-dm
 * @version: 1.0
 * @Author: uidq1343
 * @Date: 2021-12-02 17:00:46
 * @LastEditors: uidq1343
 * @LastEditTime: 2022-05-07 14:49:25
 * @content: dataset explore
 */
import { FilesAndFoldersActionType, InSensitiveActionType } from '../types'
import Axios from '../../common/axios/axios'
import { PageableParmas } from '../../common/interface'
import { find } from 'lodash'
import { LegendToggleOutlined } from '@mui/icons-material'
import store from '../store'
import { cloneDeep } from 'lodash'

// const rootPath='/pangoo/ids/file_warehouse'

export const rootProjects = (rootPath) => async dispatch => {
    dispatch({
        type: FilesAndFoldersActionType.GET_PROJECT_LIST,
    })
    try {
        // const res = await Axios.get(`/api/pangoo-data-factory/folders?isDelete=0&pageNo=1&pageSize=100`)
        const res = await Axios.get(`/api/pangoo-warehouse/file/warehouse?pageNo=${1}&pageSize=${100}&folderPath=${rootPath}`)

        if (res.data.code === 0) {
            let folders = res.data.data.result.map((folder) => {
                folder = Object.assign(folder, { id: folder.id, isProject: true })
                return folder
            })

            dispatch({
                type: FilesAndFoldersActionType.GET_PROJECT_LIST_SUCCESS,
                payload: folders
            })
        } else {
            dispatch({
                type: FilesAndFoldersActionType.GET_PROJECT_LIST_ERROR,
                payload: [res.data.data]
            })
        }
    }
    catch (e) {
        dispatch({
            type: FilesAndFoldersActionType.GET_PROJECT_LIST_ERROR,
            payload: 'get project list error',
        })
    }
}


export const labelsStatisticAction = () => async dispatch => {
    dispatch({
        type: FilesAndFoldersActionType.GET_LABELS_STATISTIC,
    })
    try {
        const res = await Axios.get(`/api/pangoo-warehouse/file/warehouse/statistic/atts`)

        if (res.data.code === 0) {
            // let folders = res.data.data.result.map((folder) => {
            //     folder = Object.assign(folder, { id: folder.id, isProject: true })
            //     return folder
            // })

            dispatch({
                type: FilesAndFoldersActionType.GET_LABELS_STATISTIC_SUCCESS,
                payload: res.data.data
            })
        } else {
            dispatch({
                type: FilesAndFoldersActionType.GET_LABELS_STATISTIC_ERROR,
                payload: [res.data.data]
            })
        }
    }
    catch (e) {
        dispatch({
            type: FilesAndFoldersActionType.GET_LABELS_STATISTIC_ERROR,
            payload: 'get statistic list error',
        })
    }
}




export const mergeIndexAction = (raw,label) => async dispatch => {
    dispatch({
        type: FilesAndFoldersActionType.MERGE_INDEX,
    })
    try {
        const res = await Axios.post(`/api/pangoo-warehouse/file/warehouse/relate?annotationPath=${label}&imagePath=${raw}`)

        if (res.data.code === 0) {
            // let folders = res.data.data.result.map((folder) => {
            //     folder = Object.assign(folder, { id: folder.id, isProject: true })
            //     return folder
            // })

            dispatch({
                type: FilesAndFoldersActionType.MERGE_INDEX_SUCCESS,
                payload: res.data.data
            })
        } else {
            dispatch({
                type: FilesAndFoldersActionType.MERGE_INDEX_ERROR,
                payload: res.data.message
            })
        }
    }
    catch (e) {
        dispatch({
            type: FilesAndFoldersActionType.MERGE_INDEX_ERROR,
            payload: 'got error',
        })
    }
}






export const pathConfig = () => async dispatch => {
    dispatch({
        type: FilesAndFoldersActionType.GET_ROOT_PATH,
    })
    try {
        // const res = await Axios.get(`/api/pangoo-data-factory/folders?isDelete=0&pageNo=1&pageSize=100`)
        const res = await Axios.get(`/api/pangoo-data-set/config`)

        if (res.data.code === 0) {


            dispatch({
                type: FilesAndFoldersActionType.GET_ROOT_PATH_SUCCESS,
                payload: res.data.data
            })
        } else {
            dispatch({
                type: FilesAndFoldersActionType.GET_ROOT_PATH_ERROR,
                payload: res.data.message
            })
        }
    }
    catch (e) {
        dispatch({
            type: FilesAndFoldersActionType.GET_ROOT_PATH_ERROR,
            payload: e.response.data.message,
        })
    }
}


export const selectedFolderContent = (folderPath, currentIndex, pageSize, restNodes: number = 0) => async dispatch => {
    dispatch({
        type: FilesAndFoldersActionType.GET_SELECT_FOLDER_CONTENT_LIST,
    })
    try {
        const res = await Axios.get(`/api/pangoo-warehouse/file/warehouse?pageNo=${currentIndex}&pageSize=${pageSize}&folderPath=${folderPath}`)
        let total = 0
        if (res.data.code === 0) {

            const payload = { 'files': [], currentIndex, pageSize }
            total += res.data.data.totalResults
            // if (restNodes > 0) {
            //     total = restNodes
            // }

            payload['files'] = res.data.data.result.filter((i) => !i.isDir).map((folder) => {
                folder = Object.assign(folder, { id: folder.id, isProject: false })
                return folder
            })
            payload['folders'] = res.data.data.result.filter((i) => i.isDir).map((folder) => {
                folder = Object.assign(folder, { id: folder.id, isProject: false })
                return folder
            })
            payload['pathId'] = folderPath
            payload['currentIndex'] = currentIndex
            payload['pageSize'] = pageSize
            const rest = res.data.data.totalResults - pageSize * res.data.data.pageNo - res.data.data.result.length
            // (total -  payload['files'].length - pageSize * Math.max((currentIndex - 2), 0))
            payload['restNodes'] = rest > 0 ? rest : 0
            dispatch({
                type: FilesAndFoldersActionType.GET_SELECT_FOLDER_CONTENT_LIST_SUCCESS,
                payload: payload
            })
        } else {
            dispatch({
                type: FilesAndFoldersActionType.GET_SELECT_FOLDER_CONTENT_LIST_ERROR,
                payload: [res.data.message]
            })
        }
    }
    catch (e) {
        dispatch({
            type: FilesAndFoldersActionType.GET_SELECT_FOLDER_CONTENT_LIST_ERROR,
            payload: 'get folder list error',
        })
    }

}



export const updateSelectedParams = (params) => async dispatch => {
    dispatch({
        type: FilesAndFoldersActionType.UPDATE_SEARCH_WITH_PARAMS,
        payload: params,

    })
}

export const selectedByParams = (params,  pageSize,) => async dispatch => {
    dispatch({
        type: FilesAndFoldersActionType.SEARCH_WITH_PARAMS,
    })
    try {
        let searchStr = ''
        for (let key in params) {
            if(key==='labelArray'){
                params[key]=encodeURIComponent(params[key])
            }
            searchStr = `${searchStr}${key}=${params[key]}&`
        }
        // searchStr=encodeURIComponent(searchStr)
        console.log("🚀 ~ file: filesAndFoldersActions.ts ~ line 229 ~ searchStr", searchStr)
        const res = await Axios.get(`/api/pangoo-warehouse/file/warehouse/files/search?${searchStr}`)
        let total = 0
        if (res.data.code === 0) {
            if(!res.data.data){
                dispatch({
                    type: FilesAndFoldersActionType.SEARCH_WITH_PARAMS_SUCCESS,
                    payload:{folders:[],files:[],restNodes:0,currentIndex:params.pageNo, pageSize,}
                })  
                return
            }
            const payload = { 'files': [], currentIndex:params.pageNo, pageSize }
            total += res.data.data[0] && res.data.data[0].totalRlt || 0
            // if (restNodes > 0) {
            //     total = restNodes
            // }

            payload['files'] = res.data.data.filter((i) => !i.isDir).map((folder) => {
                folder = Object.assign(folder, { id: folder.id, isProject: false })
                return folder
            })
            payload['folders'] = res.data.data.filter((i) => i.isDir).map((folder) => {
                folder = Object.assign(folder, { id: folder.id, isProject: false })
                return folder
            })
            payload['searchParams'] = params
            payload['currentIndex'] = params.pageNo
            payload['pageSize'] = pageSize
            const rest = total - pageSize * params.pageNo - res.data.data.length
            // (total -  payload['files'].length - pageSize * Math.max((currentIndex - 2), 0))
            payload['restNodes'] = rest > 0 ? rest : 0
            dispatch({
                type: FilesAndFoldersActionType.SEARCH_WITH_PARAMS_SUCCESS,
                payload: payload
            })
        } else {
            dispatch({
                type: FilesAndFoldersActionType.SEARCH_WITH_PARAMS_ERROR,
                payload: [res.data.message]
            })
        }
    }
    catch (e) {
        dispatch({
            type: FilesAndFoldersActionType.SEARCH_WITH_PARAMS_ERROR,
            payload: 'get folder list error',
        })
    }

}



export const toggleFolderTreeExpand = (tree) => async dispatch => {
    dispatch({
        type: FilesAndFoldersActionType.FOLDER_FILE_TREE_TOGGLE,
        payload: tree
    })
}

export const toggleDsTreeExpand = (tree) => async dispatch => {
    dispatch({
        type: InSensitiveActionType.DATASET_FOLDER_FILE_TREE_TOGGLE,
        payload: tree
    })
}

export const fileSelectedViews = (tree) => async dispatch => {

    dispatch({
        type: InSensitiveActionType.DATASET_SELECT_FILE_VIEW,
        payload: tree,

    })
}


export const nodeSelected = (node) => async dispatch => {

    dispatch({
        type: FilesAndFoldersActionType.FILE_NODE_SELECTED,
        payload: node,

    })
}



export const exploreModeAction = (mode) => async dispatch => {

    dispatch({
        type: FilesAndFoldersActionType.EXPLORE_MODE_UPDATE,
        payload: mode,

    })
}

export const selectInsensitivePath = (tree) => async dispatch => {
    dispatch({
        type: InSensitiveActionType.DATASET_SELECT_FOLDER_TOGGLE,

    })
    // const { createDs: { currentSelectFolderTree } } = store.getState()
    // let treeLoad = tree
    // try {
    //     if (typeof currentSelectFolderTree === 'undefined' || tree.root.id !== currentSelectFolderTree.root.id) {
    //         treeLoad = tree
    //         let url = `/api/pangoo-data-set/dataSet/file/tree/${tree.root.id}/relativePath`
    //         const res = await Axios.get(url)
    //         if (res.data.code === 0) {
    //             treeLoad.root.srcFilePath = res.data.data
                dispatch({
                    type: InSensitiveActionType.DATASET_SELECT_FOLDER_TOGGLE_SUCCESS,
                    payload: tree
                })
    //         } else {
    //             dispatch({
    //                 type: InSensitiveActionType.DATASET_SELECT_FOLDER_TOGGLE_ERROR,
    //             })
    //         }

    //     } else {
    //         if (treeLoad.root.isDir) {
    //             dispatch({
    //                 type: InSensitiveActionType.DATASET_SELECT_FOLDER_TOGGLE_SUCCESS,
    //                 payload: treeLoad
    //             })
    //         }
    //     }
    // } catch (e) {
    //     dispatch({
    //         type: InSensitiveActionType.DATASET_SELECT_FOLDER_TOGGLE_ERROR,
    //         payload: 'get folder information error',
    //     })
    // }
}


export const datasetFolderContent = (filePath, currentIndex, pageSize, pathId?) => async dispatch => {

    dispatch({
        type: InSensitiveActionType.GET_DATASET_FOLDER_LIST,
    })
    try {
        let url = `/api/pangoo-warehouse/file/warehouse?folderPath=${encodeURIComponent(filePath)}&pageNo=${currentIndex}&pageSize=${pageSize}`
        url += typeof pathId !== 'undefined' ? `&folderId=${encodeURIComponent(pathId)}` : ''
        const res = await Axios.get(url)
        let restNodes = 0
        if (res.data.code === 0) {
            console.log("🚀 ~ file: filesAndFoldersActions.ts ~ line 360 ~ res.data", res.data)
            restNodes = res.data.data.totalResults - pageSize * res.data.data.pageNo - res.data.data.result.length
            restNodes= restNodes > 0 ? restNodes : 0
            const payload = { files: res.data.data.result, parentId: pathId, restNodes, currentIndex, pageSize }
            console.log("🚀 ~ file: filesAndFoldersActions.ts ~ line 368 ~ payload", payload)
            dispatch({
                type: InSensitiveActionType.GET_DATASET_FOLDER_LIST_SUCCESS,
                payload: payload
            })
        } else {
            dispatch({
                type: InSensitiveActionType.GET_DATASET_FOLDER_LIST_ERROR,
                payload: [res.data.message]
            })
        }
    }
    catch (e) {
        dispatch({
            type: InSensitiveActionType.GET_DATASET_FOLDER_LIST_ERROR,
            payload: 'get folder information error',
        })
    }

}

export const folderAsyncStatusAction = (dataSetId) => async dispatch => {

    dispatch({
        type: InSensitiveActionType.GET_CREATE_DATASET_STATUS,
    })
    try {

        const res = await Axios.get(`/api/pangoo-data-set/dataSet/file/tree/${dataSetId}/status`)
        if (res.data.code === 0) {
            dispatch({
                type: InSensitiveActionType.GET_CREATE_DATASET_STATUS_SUCCESS,
                payload: res.data.data
            })
            // payload: {processMsg:'fddfweewfdfssdfsdf',processCode:5}
        }
    } catch (e) {
        dispatch({
            type: InSensitiveActionType.GET_CREATE_DATASET_STATUS_ERROR,
        })
    }
}





export const updateFolderStatus = (dataSetId) => async dispatch => {
    dispatch(clearDatasetFilesCache())
    dispatch({
        type: InSensitiveActionType.GET_CREATE_DATASET_STATUS,
    })
    try {

        const res = await Axios.get(`/api/pangoo-data-set/dataSet/file/tree/${dataSetId}/status`)
        if (res.data.code === 0) {
            if (parseInt(res.data.data.processCode) !== 0) {
                setTimeout(() => { dispatch(updateFolderStatus(dataSetId)) }, 1500)
                dispatch({
                    type: InSensitiveActionType.GET_CREATE_DATASET_STATUS,
                    payload: res.data.data
                })
                return
            } else {
                dispatch({
                    type: InSensitiveActionType.GET_CREATE_DATASET_STATUS_SUCCESS,
                    payload: res.data.data
                })
                dispatch(
                    datasetFolderContent(dataSetId, 1, 100)
                )
            }
        }
    } catch (e) {
        dispatch({
            type: InSensitiveActionType.GET_CREATE_DATASET_STATUS_ERROR,
        })
    }
}



export const uploadFilesAction = (dataSetId, isUnzip, files, parentFolderId?) => async dispatch => {
    dispatch({
        type: InSensitiveActionType.UPLOAD_DATASET_FILES,
    })
    try {
        let formdata = new FormData()
        for (let i = 0; i < files.length; i++) {
            let file = files[i]
            formdata.append("files", file, file.name)
        }
        let config = {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }

        const res = await Axios.post(`/api/pangoo-data-set/dataSet/file/tree/local/upload?dataSetId=${dataSetId}&isUnzip=${isUnzip}&parentFolderId=${parentFolderId}`,
            formdata, config
        )
        if (res.data.code === 0) {
            dispatch({
                type: InSensitiveActionType.UPLOAD_DATASET_FILES_SUCCESS,
            })
            dispatch(
                updateFolderStatus(dataSetId)
            )
        } else {
            dispatch({
                type: InSensitiveActionType.UPLOAD_DATASET_FILES_ERROR,
                payload: res.data.message
            })
        }
    }
    catch (e) {
        dispatch({
            type: InSensitiveActionType.UPLOAD_DATASET_FILES_ERROR,
            payload: e.response.data.message,
        })
    }

}





export const updateDatasetFolders = (dataSetId, isDir, name, parentId?, currentId?, srcFilePath?) => async dispatch => {
    dispatch({
        type: InSensitiveActionType.UPDATE_DATASET_FOLDER_LIST,
    })
    try {
        let params = { isDir, name }
        if (typeof parentId !== 'undefined') {
            params = Object.assign(params, { parentId })
        }
        if (typeof srcFilePath !== 'undefined') {
            params = Object.assign(params, { srcFilePath })
        }
        let res;
        if (typeof currentId !== 'undefined') {
            params = Object.assign(params, { id: currentId })
            res = await Axios.put(`/api/pangoo-data-set/dataSet/file/tree/${currentId}?fileName=${name}`)
        } else {
            res = await Axios.post(`/api/pangoo-data-set/dataSet/file/tree/${dataSetId}`, JSON.stringify([params]))
        }
        let total = 0
        if (res.data.code === 0) {
            dispatch({
                type: InSensitiveActionType.UPDATE_DATASET_FOLDER_LIST_SUCCESS,
            })
            dispatch(
                updateFolderStatus(dataSetId)
            )
        } else {
            dispatch({
                type: InSensitiveActionType.UPDATE_DATASET_FOLDER_LIST_ERROR,
                payload: [res.data.message]
            })
        }
    }
    catch (e) {
        dispatch({
            type: InSensitiveActionType.UPDATE_DATASET_FOLDER_LIST_ERROR,
            payload: 'update folder error',
        })
    }

}

export const deleteDatasetFolders = (dataSetId, pathId) => async dispatch => {

    dispatch({
        type: InSensitiveActionType.DELETE_DATASET_FOLDER_LIST,
    })
    try {

        const res = await Axios.delete(`/api/pangoo-data-set/dataSet/file/tree?dataSetId=${dataSetId}&ids=${pathId}`)
        if (res.data.code === 0) {

            dispatch({
                type: InSensitiveActionType.DELETE_DATASET_FOLDER_LIST_SUCCESS,
                payload: { dataSetId, pathId }
            })
        } else {
            dispatch({
                type: InSensitiveActionType.DELETE_DATASET_FOLDER_LIST_ERROR,
                payload: [res.data.message]
            })
        }
    }
    catch (e) {
        dispatch({
            type: InSensitiveActionType.DELETE_DATASET_FOLDER_LIST_ERROR,
            payload: 'delete folder error',
        })
    }

}







export const copyIDSFilesToDataSet = (dataSetId, isDir, relativePath, name, dsCacheTree) => async dispatch => {
    dispatch({
        type: InSensitiveActionType.ADD_IDS_FILES_TO_DATASET,
    })
    try {
        let srcFilePath = relativePath


        let params = { isDir, name }
        params = Object.assign(params, { parentId: dsCacheTree.root.id })
        params = Object.assign(params, { srcFilePath })
        const updateRes = await Axios.post(`/api/pangoo-data-set/dataSet/file/tree/${dataSetId}`, JSON.stringify([params]))
        if (updateRes.data.code === 0) {
            dispatch({
                type: InSensitiveActionType.ADD_IDS_FILES_TO_DATASET_SUCCESS,
                payload: { files: updateRes.data.data, parentId: dsCacheTree.root.id }
            })
            dispatch(updateFolderStatus(dataSetId))
        } else {
            dispatch({
                type: InSensitiveActionType.ADD_IDS_FILES_TO_DATASET_ERROR,
                payload: updateRes.data.message,
            })
        }

    }
    catch (e) {
        dispatch({
            type: InSensitiveActionType.ADD_IDS_FILES_TO_DATASET_ERROR,
            payload: 'copy files to dataSet error',
        })
    }
}





export const submitDatasetFiles = (dataSetId) => async dispatch => {
    dispatch({
        type: InSensitiveActionType.SUBMIT_DATASET_FILES,
    })
    try {
        let url = `/api/pangoo-data-set/dataSet/file/tree?dataSetId=${dataSetId}`
        const updateRes = await Axios.post(url)
        if (updateRes.data.code === 0) {
            dispatch({
                type: InSensitiveActionType.SUBMIT_DATASET_FILES_SUCCESS
            })
        } else {
            dispatch({
                type: InSensitiveActionType.SUBMIT_DATASET_FILES_ERROR,
                payload: updateRes.data.message,
            })
        }

    }
    catch (e) {
        dispatch({
            type: InSensitiveActionType.SUBMIT_DATASET_FILES_ERROR,
            payload: 'submit dataSet error',
        })
    }
}


export const folderContentStatistic = (path) => async dispatch => {
    dispatch({
        type: FilesAndFoldersActionType.FILESANDFOLDERS_TOTAL,
    })
    try {
        let url = `/api/pangoo-warehouse/file/warehouse/statistic/filetype?path=${encodeURIComponent(path)}`
        const res = await Axios.get(url)
        if (res.data.code === 0) {
            dispatch({
                type: FilesAndFoldersActionType.FILESANDFOLDERS_TOTAL_SUCCESS,
                payload:res.data.data
            })
        } else {
            dispatch({
                type: FilesAndFoldersActionType.FILESANDFOLDERS_TOTAL_ERROR,
                payload: res.data.message,
            })
        }

    }
    catch (e) {
        dispatch({
            type: FilesAndFoldersActionType.FILESANDFOLDERS_TOTAL_ERROR,
            payload: 'submit dataSet error',
        })
    }
}




export const clearDatasetFilesCache = () => async dispatch => {
    dispatch({
        type: InSensitiveActionType.CLEAR_DATASET_FILES_CACHE,
    })

}


export const searchActiveAction = () => async dispatch => {
    dispatch({
        type: FilesAndFoldersActionType.SEARCH_ACTIVE,
    })

}


export const searchDeActiveAction = () => async dispatch => {
    dispatch({
        type: FilesAndFoldersActionType.SEARCH_DEACTIVE,
    })

}


export const mergeActiveAction = () => async dispatch => {
    dispatch({
        type: FilesAndFoldersActionType.MERGE_ACTIVE,
    })

}


export const mergeDeActiveAction = () => async dispatch => {
    dispatch({
        type: FilesAndFoldersActionType.MERGE_DEACTIVE,
    })

}





export const loadLabelPoints = (points) => async dispatch => {
    dispatch({
        type: FilesAndFoldersActionType.LABEL_POINT_ARRAYS,
        payload: points,

    })
}

export const filteLabelPoints = (label) => async dispatch => {
    dispatch({
        type: FilesAndFoldersActionType.LABEL_POINT_ARRAYS_FILTER,
        payload: label,

    })
}

export const filteLabelClear = () => async dispatch => {
    dispatch({
        type: FilesAndFoldersActionType.LABEL_POINT_ARRAYS_FILTER_CLEAR,
    })
}



export const selectedAndMoveByParams = (params) => async dispatch => {
    dispatch({
        type: FilesAndFoldersActionType.SEARCH_AND_MOVE_WITH_PARAMS,
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
        if(!params.destFilePath){
            dispatch({
                type: FilesAndFoldersActionType.SEARCH_AND_MOVE_WITH_PARAMS_ERROR,
                payload: '目标路径不能为空'
            })  
        }
        const res = await Axios.put(`/api/pangoo-warehouse/file/warehouse/copyFileToDest`,params)
        // let total = 0
        if (res.data.code === 0) {
            dispatch({
                type: FilesAndFoldersActionType.SEARCH_AND_MOVE_WITH_PARAMS_SUCCESS,
                payload: {processMsg:res.data.data.processMsg,processCode:res.data.data.processCode}
            })
        } else {
            dispatch({
                type: FilesAndFoldersActionType.SEARCH_AND_MOVE_WITH_PARAMS_ERROR,
                payload: res.data.message
            })
        }
    }
    catch (e) {
        dispatch({
            type: FilesAndFoldersActionType.SEARCH_AND_MOVE_WITH_PARAMS_ERROR,
            payload: 'move file error',
        })
    }

}
