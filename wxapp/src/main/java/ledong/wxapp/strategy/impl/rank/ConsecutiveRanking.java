package ledong.wxapp.strategy.impl.rank;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.Map;
import java.util.Optional;

import VO.ScoreLogVo;
import ledong.wxapp.utils.DateUtil;
import org.elasticsearch.index.query.QueryBuilder;
import org.elasticsearch.search.sort.SortOrder;

import com.alibaba.fastjson.JSONObject;

import VO.MatchPostVo;
import VO.RankInfoVo;
import ledong.wxapp.constant.DataSetConstant;
import ledong.wxapp.constant.enums.MatchStatusCodeEnum;
import ledong.wxapp.search.SearchApi;
import ledong.wxapp.strategy.RankingStrategy;
import ledong.wxapp.utils.StringUtil;

public class ConsecutiveRanking extends RankingStrategy {

    private boolean flag = false;

    @Override
    public int[] ranking(String matchId, int holderScore, int challengerScor) {
        int[] scores = new int[2];
        int scoreChanged = 30;

        Map<String, Object> match = SearchApi.searchById(DataSetConstant.GAME_MATCH_INFORMATION, matchId);
        MatchPostVo vo = JSONObject.parseObject(JSONObject.toJSONString(match), MatchPostVo.class);

        RankInfoVo holder = getUserRank(vo.getHolder());
        RankInfoVo challenger = getUserRank(vo.getChallenger());

        scores[0] = consectiveVerified(holder.getOpenId()) ? scoreChanged * -1 : 0;
        scores[1] = consectiveVerified(challenger.getOpenId())  ? scoreChanged * -1 : 0;
        return scores;
    }

    private boolean consectiveVerified(String userId) {
        flag = false;
        ArrayList<QueryBuilder> params = new ArrayList<QueryBuilder>();
        if (!StringUtil.isEmpty(userId)) {
            params.add(SearchApi.createSearchByFieldSource(ScoreLogVo.OPENID,userId));
        }
        params.add(SearchApi.createSearchByFieldRangeGtSource(ScoreLogVo.RANKINGTIME,DateUtil.getZeroToday()));
        params.add(SearchApi.createSearchByFieldRangeGtSource(ScoreLogVo.SCORE,0));

//        params.add(SearchApi.createSearchByFieldRangeGtSource(MatchPostVo.GAMEDTIME,
//                DateUtil.getZeroToday()));
//
//
        QueryBuilder[] values = new QueryBuilder[8];
        LinkedList<HashMap<String, Object>> matches = SearchApi.searchByMultiQueriesAndOrders(
                DataSetConstant.SCORE_CHANGED_LOG,  null,1,200, params.toArray(values));
        Optional.ofNullable(matches).ifPresent(u ->   {flag=u.size() >=3;});

        return flag;

    }

}
