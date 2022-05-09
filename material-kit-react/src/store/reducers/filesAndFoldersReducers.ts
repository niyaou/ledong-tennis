/*
 * @Descripttion: pangoo-dm
 * @version: 1.0
 * @Author: uidq1343
 * @Date: 2021-12-02 16:54:51
 * @LastEditors: uidq1343
 * @LastEditTime: 2022-05-07 13:41:04
 * @content: dataset list and classes reducer
 */
import { FilesAndFoldersActionType } from '../types'
import { fetching, FileTree, cacheFileTree } from '../../common/interface'
import { uniqWith, isEqual } from 'lodash'


const initialState: cacheFileTree = {
    ...fetching,
    pathId: '',
    exploreMode:false,
    rootPath: undefined,
    searchActive: false,
    successed: false,
    searchMoveStatus:undefined,
    mergeActive: false,
    labelStatistic: [],
    searchParams: {},
    files: [],
    folders: [],
    cacheTree: [],
    restNodes: 0,
    currentIndex: 1,
    currentNode: undefined,
    labelPoints:[],
    labelFilter:[],
    fileStatistic:[],
    
}

const createRootFolder = (folders) => {
    if (folders && folders.length > 0) {
        return folders.map((folder) => {
            return {
                root: folder, leaf: [], initialed: false, restNodes: 0, expanded: false, currentIndex: 1,
                pageSize: 15
            }
        })
    }
    return []
}

const folderLeafsAppend = (cacheTree, pathId, folders, files, currentIndex, restNodes) => {

    function loopLeafs(tree, pathId, folders, files, currentIndex, restNodes) {
        if (tree.root.isDir && tree.root.filePath === pathId) { //更新节点
            tree.expanded = true
            tree.initialed = true
            tree.currentIndex = currentIndex
            folders = folders.map((folder) => {
                return {
                    root: folder, leaf: [], initialed: false, expanded: false, restNodes: 0, currentIndex: tree.currentIndex,
                    pageSize: tree.pageSize
                }
            })
            files = files.map((file) => {
                return {
                    root: file, leaf: [], initialed: false, expanded: false, restNodes: 0, currentIndex: tree.currentIndex,
                    pageSize: tree.pageSize
                }
            })
            tree.restNodes = restNodes
            tree.leaf = tree.leaf.concat(files)

            tree.leaf = uniqWith(tree.leaf, (value, other) => {
                return value.root.id === other.root.id
            })
            tree.leaf = tree.leaf.concat(folders)

            return true
        }
        else if (tree.leaf && tree.leaf.length > 0) {//寻找叶节点是否包含id
            let findLeafs = false
            for (let i = 0; i < tree.leaf.length; i++) {
                findLeafs = loopLeafs(tree.leaf[i], pathId, folders, files, currentIndex, restNodes)
                if (findLeafs) {
                    return findLeafs
                }
            }
        }
        return false
    }
    for (let i = 0; i < cacheTree.length; i++) {
        let findLeafs = false
        findLeafs = loopLeafs(cacheTree[i], pathId, folders, files, currentIndex, restNodes)
        if (findLeafs) {
            return cacheTree
        }
    }
    return cacheTree
}


const expand = (cacheTree, tree) => {
    function loopLeafs(cache, tree) {
        let pathId = tree.root.filePath
        if (cache.root.isDir && cache.root.filePath === pathId) { //更新节点
            cache.expanded = !cache.expanded
            return true
        }
        else if (cache.leaf && cache.leaf.length > 0) {//寻找叶节点是否包含id
            let findLeafs = false
            for (let i = 0; i < cache.leaf.length; i++) {
                findLeafs = loopLeafs(cache.leaf[i], tree)
                if (findLeafs) {
                    return findLeafs
                }
            }
        }
        return false
    }
    for (let i = 0; i < cacheTree.length; i++) {
        let findLeafs = false
        findLeafs = loopLeafs(cacheTree[i], tree)
        if (findLeafs) {
            return cacheTree
        }
    }
    return cacheTree
}

const filter=(label,labelFilter) =>{
    if(labelFilter.indexOf(label)>-1){
        labelFilter.splice(labelFilter.indexOf(label), 1) 

    }else{
        labelFilter.push(label)
    }
    
    return labelFilter.concat()
}

export default function (state = initialState, action) {
    switch (action.type) {
        case FilesAndFoldersActionType.GET_PROJECT_LIST:
            return {
                ...state,
                loading: true,
                errorMsg: '',
            }
        case FilesAndFoldersActionType.GET_PROJECT_LIST_SUCCESS:
            let trees = {
                ...state,
                loading: false,
                errorMsg: '',
                loadError: false,
                folders: action.payload,
            }
            trees.cacheTree = createRootFolder(trees.folders)
            return trees
        case FilesAndFoldersActionType.GET_PROJECT_LIST_ERROR:
            return {
                ...state,
                loading: false,
                errorMsg: action.payload,
                loadError: true,
            }





            case FilesAndFoldersActionType.EXPLORE_MODE_UPDATE:
                return {
                    ...state,
                    exploreMode:action.payload,
                }




            case FilesAndFoldersActionType.GET_LABELS_STATISTIC:
                return {
                    ...state,
                    loading: true,
                    errorMsg: '',
                }
            case FilesAndFoldersActionType.GET_LABELS_STATISTIC_SUCCESS:
             
                return {
                    ...state,
                    loading: false,
                    errorMsg: '',
                    loadError: false,
                    labelStatistic: action.payload,
                }
            case FilesAndFoldersActionType.GET_LABELS_STATISTIC_ERROR:
                return {
                    ...state,
                    loading: false,
                    errorMsg: action.payload,
                    loadError: true,
                }



                
            case FilesAndFoldersActionType.MERGE_INDEX:
                return {
                    ...state,
                    loading: true,
                    successed:false,
                    errorMsg: '',
                }
            case FilesAndFoldersActionType.MERGE_INDEX_SUCCESS:
             
                return {
                    ...state,
                    loading: false,
                    errorMsg: '',
                    loadError: false,
                    successed:true,
                }
            case FilesAndFoldersActionType.MERGE_INDEX_ERROR:
                return {
                    ...state,
                    loading: false,
                    errorMsg: action.payload,
                    loadError: true,
                    successed:false,
                }





    
                case FilesAndFoldersActionType.FILESANDFOLDERS_TOTAL:
                    return {
                        ...state,
                        loading: true,
                        successed:false,
                        errorMsg: '',
                    }
                case FilesAndFoldersActionType.FILESANDFOLDERS_TOTAL_SUCCESS:
                    return {
                        ...state,
                        loading: false,
                        errorMsg: '',
                        loadError: false,
                        fileStatistic: action.payload,
                      
                    }
                case FilesAndFoldersActionType.FILESANDFOLDERS_TOTAL_ERROR:
                    return {
                        ...state,
                        loading: false,
                        errorMsg: action.payload,
                        loadError: true,
                        successed:false,
                    }
    







        case FilesAndFoldersActionType.GET_SELECT_FOLDER_CONTENT_LIST:
            return {
                ...state,
                loading: true,
                errorMsg: '',
            }
        case FilesAndFoldersActionType.GET_SELECT_FOLDER_CONTENT_LIST_SUCCESS:
            let content = {
                ...state,
                pathId: action.payload.pathId,
                loading: false,
                errorMsg: '',
                loadError: false,
                folders: action.payload.folders,
                files: action.payload.files,
                currentIndex: action.payload.currentIndex,
                restNodes: action.payload.restNodes,
            }
            content.cacheTree = folderLeafsAppend(content.cacheTree, content.pathId, content.folders, content.files, action.payload.currentIndex, action.payload.restNodes)
            return content
        case FilesAndFoldersActionType.GET_SELECT_FOLDER_CONTENT_LIST_ERROR:
            return {
                ...state,
                loading: false,
                errorMsg: action.payload,
                loadError: true,
            }






            case FilesAndFoldersActionType.UPDATE_SEARCH_WITH_PARAMS:
                return {
                    ...state,
                    searchParams: action.payload,
                }
            case FilesAndFoldersActionType.SEARCH_WITH_PARAMS:
                return {
                    ...state,
                    loading: true,
                    errorMsg: '',
                }
            case FilesAndFoldersActionType.SEARCH_WITH_PARAMS_SUCCESS:
                let searchContent = {
                    ...state,
                    pathId: action.payload.pathId,
                    searchParams: action.payload.searchParams,
                    loading: false,
                    errorMsg: '',
                    loadError: false,
                    folders: action.payload.folders,
                    files: action.payload.files,
                    currentIndex: action.payload.currentIndex,
                    restNodes: action.payload.restNodes,
                }
                searchContent.cacheTree = folderLeafsAppend(searchContent.cacheTree, searchContent.pathId,
                    searchContent.folders, searchContent.files, action.payload.currentIndex, action.payload.restNodes)
                return searchContent
            case FilesAndFoldersActionType.SEARCH_WITH_PARAMS_ERROR:
                return {
                    ...state,
                    loading: false,
                    errorMsg: action.payload,
                    loadError: true,
                }
    







        case FilesAndFoldersActionType.FOLDER_FILE_TREE_TOGGLE:
            let toggleContent = {
                ...state,
            }
            toggleContent.cacheTree = expand(toggleContent.cacheTree, action.payload)
            return toggleContent
        case FilesAndFoldersActionType.GET_ROOT_PATH:
            return {
                ...state,
                loading: true,
                errorMsg: '',
            }
        case FilesAndFoldersActionType.GET_ROOT_PATH_SUCCESS:
            return {
                ...state,
                loading: false,
                errorMsg: '',
                loadError: false,
                rootPath: action.payload,
            }
        case FilesAndFoldersActionType.GET_ROOT_PATH_ERROR:
            return {
                ...state,
                loading: false,
                errorMsg: action.payload,
                loadError: true,
            }


            


            case FilesAndFoldersActionType.SEARCH_AND_MOVE_WITH_PARAMS:
                return {
                    ...state,
                    loading: true,
                    errorMsg: '',
                    searchMoveStatus:undefined,
                }
            case FilesAndFoldersActionType.SEARCH_AND_MOVE_WITH_PARAMS_SUCCESS:
                return {
                    ...state,
                    loading: false,
                    errorMsg: '',
                    loadError: false,
                    searchMoveStatus: action.payload,
                   
                }
            case FilesAndFoldersActionType.SEARCH_AND_MOVE_WITH_PARAMS_ERROR:
                return {
                    ...state,
                    loading: false,
                    errorMsg: action.payload,
                    loadError: true,
                }
    




        case FilesAndFoldersActionType.SEARCH_ACTIVE:
            return {
                ...state,
                cacheTree:[],
                folders: [],
                files: [],
                searchActive: true,
                searchMoveStatus:undefined
            }
        case FilesAndFoldersActionType.SEARCH_DEACTIVE:
            return {
                ...state,
                searchActive: false,
                currentIndex:1,
                searchMoveStatus:undefined
            }


            case FilesAndFoldersActionType.MERGE_ACTIVE:
                return {
                    ...state,
                    mergeActive: true
                }
            case FilesAndFoldersActionType.MERGE_DEACTIVE:
                return {
                    ...state,
                    mergeActive: false
                }


        case FilesAndFoldersActionType.FILE_NODE_SELECTED:
            return {
                ...state,
                nodeSelected:  action.payload
            }




            
        case FilesAndFoldersActionType.LABEL_POINT_ARRAYS:
            return {
                ...state,
                labelPoints:  action.payload
            }
            
        case FilesAndFoldersActionType.LABEL_POINT_ARRAYS_FILTER:
            return {
                ...state,
                labelFilter:filter(action.payload,state.labelFilter)
            }         
        case FilesAndFoldersActionType.LABEL_POINT_ARRAYS_FILTER_CLEAR:
            return {
                ...state,
                labelFilter:[]
            }

        default: return {
            ...state,
        }
    }
}