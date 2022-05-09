/*
 * @Descripttion: pangoo-dm
 * @version: 1.0
 * @Author: uidq1343
 * @Date: 2022-01-10 14:34:56
 * @LastEditors: uidq1343
 * @LastEditTime: 2022-05-07 13:39:07
 * @content: edit your page content
 */

export interface UserFormValues {
  username?: string;
  password?: string;
}


export interface ManifestInfoFormValues {
  coverImg?: string;
  dataSetName?: string;
  dataSetSubName?: string;
  dataSetProperty?: number;
  dataTypeIds?: number[];
  labelTypeIds?: number[];
  taskTypeIds?: number[];
  usedSceneIds?: number[];
  dataSetDescribe?: string;
}

export interface cacheFileTree {
  searchActive?:boolean;
  exploreMode?:boolean;
  searchMoveStatus?:object;
  mergeActive?:boolean;
  searchParams?:object;
  nodeSelected?:object;
  labelStatistic?:string[];
  labelPoints?:object[];
  labelFilter?:string[];
  pathId:string;
  rootPath:object;
  fileStatistic?:[];
  files: any[];
  folders: any[];
  cacheTree: FileTree[];
  loading: boolean;
  loadError: boolean;
  successed: boolean;
  errorMsg: string;
  currentIndex:number;
  currentNode:object;
  restNodes:number;
}


export interface FileTree {
  root:Object;
  leaf?:FileTree[];
  initialed:boolean;
  expanded:boolean;
  restNodes:number;
  currentIndex:number;
  pageSize:number;
  choicen?:boolean;

}

export interface Response<Type> {
  code: number;
  message: string;
  data: Type;
}

export interface Pager<Type> {
  content: Type[];
  empty: boolean;
  first: boolean;
  last: boolean;
  number: number;
  numberOfElements: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface Fetching {
  loading: boolean;
  loadError: boolean;
  errorMsg: string;
}

export const fetching:Fetching = {
  loading: true,
  loadError: false,
  errorMsg:'',
}

function withDefaults<T>() {
  return function <TDefaults extends Partial<T>>(defs: TDefaults) {
    return function (p: Pick<T, Exclude<keyof T, keyof TDefaults>> & Partial<TDefaults>) :T {
      let result: any = p;
      for (let k of Object.keys(defs)) {
        result[k] = result[k] || defs[k];
      }
      return result;
    }
  }
}
export interface PageableParmas<T>{
  page: T;
  size: T ;
}

export function getDefaultPageAble<T>(p: T,s:T): PageableParmas<T> {
  return {
    page: p,
    size:s,
  };
}
export const defaultPageAble: PageableParmas<number> = getDefaultPageAble(0,30)