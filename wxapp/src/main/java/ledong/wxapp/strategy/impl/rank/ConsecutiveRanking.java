package ledong.wxapp.strategy.impl.rank;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.Map;
import java.util.Optional;

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

        scores[0] = consectiveVerified(holder.getId()) && holderScore > challengerScor ? scoreChanged * 3 : 0;
        scores[1] = consectiveVerified(challenger.getId()) && holderScore < challengerScor ? scoreChanged * 3 : 0;
        return scores;
    }

    private boolean consectiveVerified(String userId) {
        flag = false;
        ArrayList<QueryBuilder> params = new ArrayList<QueryBuilder>();
        if (!StringUtil.isEmpty(userId)) {
            params.add(SearchApi.createMultiFieldsWithSingleValue(userId, MatchPostVo.HOLDER, MatchPostVo.CHALLENGER));
        }
        params.add(SearchApi.createSearchByFieldSource(MatchPostVo.RANKED,
                MatchStatusCodeEnum.MATCH_RANKED_STATUS.getCode()));
        Map<String, SortOrder> sortPropertiesQueries = new HashMap<String, SortOrder>(2);
        sortPropertiesQueries.put(MatchPostVo.GAMEDTIME, SortOrder.DESC);
        QueryBuilder[] values = new QueryBuilder[8];
        LinkedList<HashMap<String, Object>> matches = SearchApi.searchByMultiQueriesAndOrders(
                DataSetConstant.GAME_MATCH_INFORMATION, sortPropertiesQueries, 1, 3, params.toArray(values));
        Optional.ofNullable(matches).ifPresent(u -> flag = u.stream()
                .filter(x -> x.get(x.get(MatchPostVo.WINNER).equals(MatchStatusCodeEnum.HOLDER_WIN_MATCH.getCode())
                        ? MatchPostVo.HOLDER
                        : MatchPostVo.CHALLENGER).equals(userId))
                .count() == 3L);

        return flag;

    }

}
