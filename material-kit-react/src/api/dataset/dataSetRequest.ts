import Axios from '../../common/axios/axios'
// const qs = require('qs');
import qs from 'qs'


// 数据范围的检查
export interface GetDataSetParams {
    auditStatus?: number;
    dataSetProperty?: number;
    dataSetStatus?: number;
    dataTypeIds?: number[];
    labelTypeIds?: number[];
    onlyParent?: boolean;
    page?: number;
    searchContent?: string;
    size?: number;
    taskTypeIds?: number[];
    usedSceneIds?: number[];
}

export const getDataSet = async (params: GetDataSetParams) => {
    const result = await Axios.get(`/api/pangoo-data-set/dataSet`, {
        params: params,
        paramsSerializer: function (params) {
            return qs.stringify(params, { arrayFormat: 'brackets' })
        }
    })
    return result.data;
}

export interface GetDataSetByTopicParams {
    type: string;
    page: number;
    size: number;
}

export const getDataSetByTopic = async (params: GetDataSetByTopicParams) => {
    const result = await Axios.get(`/api/pangoo-data-set/dataSet/topic`, {
        params: params
    })
    return result.data;
}