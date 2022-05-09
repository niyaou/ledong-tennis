import Axios from '../../common/axios/axios'
// const qs = require('qs');
import qs from 'qs'

/**
 * 
 * @param classIds 
 * dataType,数据格式;
 * labelType,标注类型;
 * taskType,任务类型;
 * usedScene,应用场景;
 * 
 */
export const getDataDictionary = async (classIds: string[]) => {
    const result = await Axios.get(`/api/pangoo-data-set/dataDictionary`, {
        params: {
            classIds: classIds
        },
        paramsSerializer: function (params) {
            return qs.stringify(params, { arrayFormat: 'brackets' })
            // return new URLSearchParams(params).toString()
        }
    })
    return result.data;
}