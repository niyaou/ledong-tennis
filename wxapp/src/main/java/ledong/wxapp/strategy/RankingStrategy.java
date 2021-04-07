package ledong.wxapp.strategy;

import java.io.IOException;
import java.util.List;
import java.util.Map;

import VO.LdRankInfoVo;
import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;

import org.elasticsearch.action.DocWriteRequest;
import org.elasticsearch.action.bulk.BulkRequest;
import org.elasticsearch.action.bulk.BulkRequestBuilder;
import org.elasticsearch.action.index.IndexRequest;
import org.elasticsearch.common.xcontent.XContentType;

import VO.RankInfoVo;
import VO.ScoreLogVo;
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

    /**
     * get user rank info
     *
     * @param userId
     * @return
     */
    public static LdRankInfoVo getLDUserRank(String userId) {
        Map<String, Object> match = SearchApi.searchById(DataSetConstant.LD_USER_RANK_INFORMATION, userId);
        LdRankInfoVo vo = JSONObject.parseObject(JSONObject.toJSONString(match), LdRankInfoVo.class);
        return vo;
    }

    public static String updateRankInfo(RankInfoVo vo) {
        return SearchApi.updateDocument(DataSetConstant.USER_RANK_INFORMATION, JSON.toJSONString(vo), vo.getOpenId());
    }

    public static String logCreate(ScoreLogVo vo) {
        return SearchApi.insertDocument(ScoreLogVo.SCORE_CHANGED_LOG, JSON.toJSONString(vo));
    }

    public static void bulkUpdateRankInfo(List<RankInfoVo> vos) {
        BulkRequest request = new BulkRequest();

        vos.forEach(vo -> {
            // Map<String,Object> mapTypes = JSON.parseObject(JSON.toJSONString(vo));
            request.add(new IndexRequest(DataSetConstant.USER_RANK_INFORMATION).id(vo.getOpenId())
                    .source(JSON.parseObject(JSON.toJSONString(vo)), XContentType.JSON)
                    .opType(DocWriteRequest.OpType.INDEX));
        });
        try {
            SearchApi.bulkUpsert(request);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public static void bulkUpdateLdRankInfo(List<LdRankInfoVo> vos) {
        BulkRequest request = new BulkRequest();

        vos.forEach(vo -> {
            // Map<String,Object> mapTypes = JSON.parseObject(JSON.toJSONString(vo));
            request.add(new IndexRequest(DataSetConstant.LD_USER_RANK_INFORMATION).id(vo.getOpenId())
                    .source(JSON.parseObject(JSON.toJSONString(vo)), XContentType.JSON)
                    .opType(DocWriteRequest.OpType.INDEX));
        });
        try {
            SearchApi.bulkUpsert(request);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }


    public static String createRankInfo(RankInfoVo vo) {
        return SearchApi.insertDocument(DataSetConstant.USER_RANK_INFORMATION, JSON.toJSONString(vo), vo.getOpenId());
    }

    public static String createLDRankInfo(RankInfoVo vo) {
        return SearchApi.insertDocument(DataSetConstant.LD_USER_RANK_INFORMATION, JSON.toJSONString(vo), vo.getOpenId());
    }

}
