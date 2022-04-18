/*
 * @Descripttion: pangoo-dm
 * @version: 1.0
 * @Author: uidq1343
 * @Date: 2021-12-02 16:54:51
 * @LastEditors: uidq1343
 * @LastEditTime: 2022-03-31 09:44:29
 * @content: dataset list and classes reducer
 */
import { DataDictionaryActionType } from '../types'
import { fetching, FileTree } from '../../common/interface'
import { remove } from 'lodash'
import moment from 'moment'
const initialState = {
    dsDictionary: {},
    datasetInfo: {},
    datasetFolders: [],
    cacheTree: [],
    selectFileTree: {},
    createDsSuccess: false,
    deleteDsSuccess: false,
    postFilesSuccess: false,
    uploadSuccess: false,
    currentSelectFolderTree: undefined,
    folderAsyncStatus:undefined,
    ...fetching,
}



const removeFolderLeafs = (cacheTree, pathId) => {
    function loopLeafs(tree, pathId) {
        if (tree.root.id === parseInt(pathId)) {
            return true
        } else
            if (tree.leaf && tree.leaf.length > 0) {//寻找叶节点是否包含id
                let findLeafs = false
                for (let i = 0; i < tree.leaf.length; i++) {
                    findLeafs = loopLeafs(tree.leaf[i], pathId)
                    if (findLeafs) {
                        remove(tree.leaf, (n) => {
                            return n.root.id === pathId
                        })
                        return false
                    }
                }
            }
        return false
    }

    for (let i = 0; i < cacheTree.length; i++) {
        let findLeafs = false
        findLeafs = loopLeafs(cacheTree[i], pathId)
        if (findLeafs) {
            remove(cacheTree, (n) => {
                return n.root.id === pathId
            })
            return cacheTree
        }

    }

    return cacheTree
}


const createDsLeafsAppend = (cacheTree, files, currentIndex, parentId?, restNodes?) => {
    function loopLeafs(tree, pathId, files, currentIndex, restNodes) {
       let selected=true
        files = files.filter((f)=>{
            selected= f.root?f.root.id!==tree.root.id:f.id!==tree.root.id
            return f.root?f.root.id!==tree.root.id:f.id!==tree.root.id
        })
        tree.choicen = false
        if (tree.root.isDir && tree.root.id === parseInt(pathId)) { //更新节点
            tree.expanded = selected
            tree.initialed = selected
            // tree.choicen = tree.expanded
            tree.choicen = selected
            tree.currentIndex = currentIndex
            if (Array.isArray(files)) {
                files = files.map((file) => {
                    return {
                        root: file, leaf: [], initialed: false, expanded: false, restNodes: 0, currentIndex: tree.currentIndex,
                        pageSize: tree.pageSize
                    }
                })
                tree.leaf = tree.leaf.concat(files)
            }
            tree.restNodes = restNodes
            return true
        }
        else if (tree.leaf && tree.leaf.length > 0) {//寻找叶节点是否包含id
            let findLeafs = false
            for (let i = 0; i < tree.leaf.length; i++) {
                findLeafs = loopLeafs(tree.leaf[i], pathId, files, currentIndex, restNodes)
                if (findLeafs) {
                    return findLeafs
                }
            }
        }
        return false
    }

 
    if (cacheTree.length === 0|| typeof parentId==='undefined') {
        cacheTree=[]
        files.map((file) => {
            let leaf: FileTree = { root: file, leaf: [], pageSize: 15, currentIndex: 1 }
            cacheTree.push(leaf)
        })
    } else if (Array.isArray(files)) {
        for (let i = 0; i < cacheTree.length; i++) {
            let findLeafs = false
            findLeafs = loopLeafs(cacheTree[i], parentId || cacheTree[i].root.id, files, currentIndex, restNodes)
            if (findLeafs) {
                return cacheTree
            }
        }
    }
    return cacheTree
}



const expand = (cacheTree, tree) => {
    function loopLeafs(cache, tree) {
        let pathId = tree.root.id
        cache.choicen = false
        if (cache.root.id === parseInt(pathId)) { //更新节点
            cache.expanded = !cache.expanded
            // cache.choicen = cache.expanded
            cache.choicen = true
            // return true
        }
        // else 
        if (cache.leaf && cache.leaf.length > 0) {//寻找叶节点是否包含id
            let findLeafs = false
            for (let i = 0; i < cache.leaf.length; i++) {
                findLeafs = loopLeafs(cache.leaf[i], tree)
                // if (findLeafs) {
                //     return findLeafs
                // }
            }
        }
        return false
    }
    for (let i = 0; i < cacheTree.length; i++) {
        let findLeafs = false
        findLeafs = loopLeafs(cacheTree[i], tree)
        // if (findLeafs) {
        //     return cacheTree
        // }
    }
    return cacheTree
}




export default function (state = initialState, action) {
    state.createDsSuccess = false
    state.deleteDsSuccess = false
    state.postFilesSuccess = false
    state.uploadSuccess = false
    state.loading = false
    state.errorMsg = ''
    state.loadError = false
    // state.folderAsyncStatus= undefined
    switch (action.type) {
        case DataDictionaryActionType.GET_DATA_DICTIONARY:
            return {
                ...state,
                loading: true,
            }
        case DataDictionaryActionType.GET_DATA_DICTIONARY_SUCCESS:
            return {
                ...state,
                dsDictionary: action.payload,
            }
        case DataDictionaryActionType.GET_DATA_DICTIONARY_ERROR:
            return {
                ...state,
                errorMsg: action.payload,
            }
        case DataDictionaryActionType.CREATE_DATASET:
            return {
                ...state,
                cacheTree: [],
                loading: true,
            }
        case DataDictionaryActionType.CREATE_DATASET_SUCCESS:
            return {
                ...state,
                datasetInfo: action.payload,
                createDsSuccess: true,
            }
        case DataDictionaryActionType.CREATE_DATASET_ERROR:
            return {
                ...state,
                errorMsg: action.payload,
            }
        case DataDictionaryActionType.DELETE_DATASET:
            return {
                ...state,
                cacheTree: [],
                loading: true,
            }
        case DataDictionaryActionType.DELETE_DATASET_SUCCESS:
            return {
                ...state,
                datasetInfo: action.payload,
                deleteDsSuccess: true,
            }
        case DataDictionaryActionType.DELETE_DATASET_ERROR:
            return {
                ...state,
                errorMsg: action.payload,
            }
        case DataDictionaryActionType.GET_DATASET_FOLDER_LIST:
            return {
                ...state,
                loading: true,
            }
        case DataDictionaryActionType.GET_DATASET_FOLDER_LIST_SUCCESS:
            let trees = {
                ...state,
                datasetFolders: action.payload.files,
                pageSize: action.payload.pageSize,
            }
            trees.cacheTree = createDsLeafsAppend(trees.cacheTree, trees.datasetFolders, action.payload.currentIndex, action.payload.parentId, action.payload.restNodes)
            return trees
        case DataDictionaryActionType.GET_DATASET_FOLDER_LIST_ERROR:
            return {
                ...state,
                errorMsg: action.payload,
            }
        case DataDictionaryActionType.DATASET_SELECT_FILE_VIEW:
            let select = {
                ...state,
            }
            select.selectFileTree = action.payload
            select.currentSelectFolderTree = action.payload

            return select
        case DataDictionaryActionType.DATASET_FOLDER_FILE_TREE_TOGGLE:
            let toggleContent = {
                ...state,
            }
            toggleContent.cacheTree = expand(toggleContent.cacheTree, action.payload)
            return toggleContent

        case DataDictionaryActionType.DATASET_SELECT_FOLDER_TOGGLE:
            return state
        case DataDictionaryActionType.DATASET_SELECT_FOLDER_CLEAR:
            let clear = {
                ...state,
            }
            clear.currentSelectFolderTree = action.payload
            return clear
        case DataDictionaryActionType.DATASET_SELECT_FOLDER_TOGGLE_SUCCESS:
            let selectContent = {
                ...state,
            }
            selectContent.currentSelectFolderTree = action.payload
            return selectContent

        case DataDictionaryActionType.ADD_IDS_FILES_TO_DATASET_SUCCESS:
            let mergeTrees = {
                ...state,
            }
            // datasetFolders: action.payload.files,
            // mergeTrees.cacheTree = createDsLeafsAppend(mergeTrees.cacheTree, mergeTrees.datasetFolders, 1, action.payload.parentId)
            return mergeTrees
        case DataDictionaryActionType.ADD_IDS_FILES_TO_DATASET_ERROR:
            return {
                ...state,
                errorMsg: action.payload,
            }
        case DataDictionaryActionType.UPDATE_DATASET_FOLDER_LIST:
            return {
                ...state,
                datasetFolders: [],
                cacheTree: [],
                loading: true,
            }
        case DataDictionaryActionType.UPDATE_DATASET_FOLDER_LIST_SUCCESS:
            let updateTrees = {
                ...state,
                loading: false,
            }
            // datasetFolders: action.payload.files,
            // updateTrees.cacheTree = createDsLeafsAppend(updateTrees.cacheTree, updateTrees.datasetFolders, action.payload.parentId, action.payload.parentId)
            return updateTrees
        case DataDictionaryActionType.UPDATE_DATASET_FOLDER_LIST_ERROR:
            return {
                ...state,
                loading: false,
                errorMsg: action.payload,
            }

        case DataDictionaryActionType.GET_CREATE_DATASET_STATUS:
            let status = {
                ...state,
                loading: true,
            }
            if(action.payload){
                status=Object.assign(status,{folderAsyncStatus:action.payload})
            }else if(state.folderAsyncStatus&& state.folderAsyncStatus.processMsg.indexOf('处理')>-1){
                status=Object.assign(status,{folderAsyncStatus:{processCode:0,processMsg:"processing",warningMsg:''}})
            }
            // else{
            //     status=Object.assign(status,{folderAsyncStatus:{processCode:0,processMsg:"processing",warningMsg:''}})
            // }
            return status
        case DataDictionaryActionType.GET_CREATE_DATASET_STATUS_SUCCESS:
            return {
                ...state,
                loading: false,
                uploadSuccess:true,
                folderAsyncStatus:action.payload
            }
        case DataDictionaryActionType.GET_CREATE_DATASET_STATUS_ERROR:
            return {
                ...state,
                loading: false,
                errorMsg: action.payload,
            }



            
        case DataDictionaryActionType.UPLOAD_DATASET_FILES:
            return {
                ...state,
                loading: true,

            }
        case DataDictionaryActionType.UPLOAD_DATASET_FILES_SUCCESS:
            return {
                ...state,
                loading: false,
                
            }
        case DataDictionaryActionType.UPLOAD_DATASET_FILES_ERROR:
            return {
                ...state,
                loading: false,
                errorMsg: action.payload,
            }


        case DataDictionaryActionType.DELETE_DATASET_FOLDER_LIST:
            return {
                ...state,
                loading: true,
            }
        case DataDictionaryActionType.DELETE_DATASET_FOLDER_LIST_SUCCESS:
            let deleteedTrees = {
                ...state,
                loading: false,
            }
            deleteedTrees.cacheTree = removeFolderLeafs(deleteedTrees.cacheTree, action.payload.pathId)
            if (deleteedTrees.currentSelectFolderTree && deleteedTrees.currentSelectFolderTree.root.id === action.payload.pathId) {
                deleteedTrees.currentSelectFolderTree = undefined
            }
            return deleteedTrees
        case DataDictionaryActionType.DELETE_DATASET_FOLDER_LIST_ERROR:
            return {
                ...state,
                loading: false,
                errorMsg: action.payload,
            }


        case DataDictionaryActionType.CLEAR_DATASET_FILES_CACHE:
            let clearCache = {
                ...state,
                datasetFolders: [],
                cacheTree: [],
                currentSelectFolderTree: undefined
            }
            return clearCache
        case DataDictionaryActionType.SUBMIT_DATASET_FILES:
            return {
                ...state,
                loading: true,
            }
        case DataDictionaryActionType.SUBMIT_DATASET_FILES_SUCCESS:
            return {
                ...state,
                loading: false,
                postFilesSuccess: true,
            }
        case DataDictionaryActionType.SUBMIT_DATASET_FILES_ERROR:
            return {
                ...state,
                loading: false,
                errorMsg: action.payload,
            }
        default: return {
            ...state,
        }
    }
}