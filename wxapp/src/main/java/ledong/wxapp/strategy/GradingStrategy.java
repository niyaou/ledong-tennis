package ledong.wxapp.strategy;

import java.util.Map;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;

import VO.RankInfoVo;
import ledong.wxapp.constant.DataSetConstant;
import ledong.wxapp.search.SearchApi;

/**
 * grade player base interface
 * 
 * @author uidq1343
 *
 */
public abstract class GradingStrategy {

    /**
     * 
     * grading player ,with score and win rate of it.
     * 
     * @param user
     * @return
     */
    public abstract RankInfoVo ranking(RankInfoVo user);

    /**
     * get user rank info
     * 
     * @param userId
     * @return
     */
    public static RankInfoVo getUserRank(String userId) {
        Map<String, Object> match = SearchApi.searchById(DataSetConstant.USER_RANK_INFORMATION, userId);
        RankInfoVo vo = JSONObject.parseObject(JSONObject.toJSONString(match), RankInfoVo.class);
        return vo;
    }

    public static String updateRankInfo(RankInfoVo vo) {
        return SearchApi.updateDocument(DataSetConstant.USER_RANK_INFORMATION, JSON.toJSONString(vo), vo.getOpenId());
    }

    public static String createRankInfo(RankInfoVo vo) {
        return SearchApi.insertDocument(DataSetConstant.USER_RANK_INFORMATION, JSON.toJSONString(vo), vo.getOpenId());
    }

    public static String getRankGradeInfo(String id){
        Map<String, Object> match = SearchApi.searchById(DataSetConstant.USER_RANK_INFORMATION, id);
        return null;
    }

}
