package ledong.wxapp.strategy.impl.match;

import java.text.ParseException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.Map;

import org.elasticsearch.index.query.QueryBuilder;
import org.elasticsearch.search.sort.SortOrder;

import VO.MatchPostVo;
import VO.MatchRequestVo;
import ledong.wxapp.constant.DataSetConstant;
import ledong.wxapp.constant.enums.MatchStatusCodeEnum;
import ledong.wxapp.search.SearchApi;
import ledong.wxapp.strategy.MatchStrategy;
import ledong.wxapp.utils.DateUtil;
import ledong.wxapp.utils.StringUtil;

public class PickIntentionalMatch extends MatchStrategy {

    @Override
    public String matchingGame(MatchRequestVo vo) {
        String exclusiveUser = vo.getUserName();
        String pickMatchId = null;
        try {
            ArrayList<QueryBuilder> params = new ArrayList<QueryBuilder>();

            if (!StringUtil.isEmpty(exclusiveUser)) {
                params.add(SearchApi.createNotSearchSource(MatchPostVo.HOLDER, exclusiveUser));
            }
            if (params.size() == 0) {
                params.add(SearchApi.createSearchAll());
            }
            String endTime = DateUtil.getDate(DateUtil.getSundayOfThisWeek(), DateUtil.FORMAT_DATE_TIME);

            String startTime = DateUtil.getDate(DateUtil.getMondayOfThisWeek(), DateUtil.FORMAT_DATE_TIME);
            params.add(SearchApi.createSearchByFieldRangeSource(MatchPostVo.ORDERTIME, startTime, endTime));
            params.add(SearchApi.createSearchByFieldSource(MatchPostVo.STATUS, MatchStatusCodeEnum.MATCH_MATCHING_STATUS.getCode()) );
            Map<String, SortOrder> sortPropertiesQueries = new HashMap<String, SortOrder>(16);
            sortPropertiesQueries.put(MatchPostVo.ORDERTIME, SortOrder.ASC);
            QueryBuilder[] values = new QueryBuilder[8];
            LinkedList<HashMap<String, Object>> matches = SearchApi.searchByMultiQueriesAndOrders(
                    DataSetConstant.GAME_MATCH_INFORMATION, sortPropertiesQueries, 0, 50, params.toArray(values));
            if (matches != null) {
                pickMatchId = (String) matches.get(0).get(SearchApi.ID);
                System.out.println(String.format(" create pick match post : %s", exclusiveUser));
            }
            return pickMatchId;
        } catch (ParseException e) {
            e.printStackTrace();
        }

        return null;
    }

}
