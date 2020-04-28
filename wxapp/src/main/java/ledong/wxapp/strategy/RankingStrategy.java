package ledong.wxapp.strategy;

import java.util.Map;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;

import VO.RankInfoVo;
import ledong.wxapp.constant.DataSetConstant;
import ledong.wxapp.search.SearchApi;

/**
 * ranking game base interface
 * 
 * @author uidq1343
 *
 */
public abstract class RankingStrategy {

    /**
     * 
     * ranking match return list which player's score
     * [holder-score,challenger-score]
     * 
     * @param matchId
     * @param holderScore
     * @param challengerScor
     * @return
     */
    public abstract int[] ranking(String matchId, int holderScore, int challengerScor);

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

}
