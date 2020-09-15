package ledong.wxapp.strategy;

import java.util.ArrayList;
import java.util.HashMap;

import javax.swing.plaf.TextUI;

import com.alibaba.fastjson.JSON;

import org.apache.http.util.TextUtils;
import org.elasticsearch.index.query.QueryBuilder;
import org.elasticsearch.index.query.QueryBuilders;

import VO.DoubleMatchPostVo;
import VO.DoubleMatchRequestVo;
import VO.MatchRequestVo;
import ledong.wxapp.config.CustomException;
import ledong.wxapp.constant.DataSetConstant;
import ledong.wxapp.constant.enums.MatchStatusCodeEnum;
import ledong.wxapp.constant.enums.ResultCodeEnum;
import ledong.wxapp.search.SearchApi;
import ledong.wxapp.utils.DateUtil;
import ledong.wxapp.utils.StringUtil;

/**
 * matching game base interface
 * 
 * @author uidq1343
 *
 */
public abstract class DoubleMatchStrategy {

    public abstract String matchingGame(DoubleMatchRequestVo vo);

    public static String postDoubleMatches(String parendId, String holder1, String holder2, String challenger1,String challenger2, int matchType, int clubMatch,
            String orderTime, String courtName, String courtGps) throws CustomException {
        DoubleMatchPostVo vo = new DoubleMatchPostVo();
        vo.setCreateTime(DateUtil.getCurrentDate(DateUtil.FORMAT_DATE_TIME));

        if (MatchStatusCodeEnum.MATCH_TYPE_INTENTIONAL.getCode().equals(matchType)) {
            HashMap<String, Object> queries = new HashMap<String, Object>();
            queries.put(DoubleMatchPostVo.HOLDER, holder1);
            queries.put(DoubleMatchPostVo.STATUS, MatchStatusCodeEnum.MATCH_MATCHING_STATUS.getCode());
            Object intentional = SearchApi.searchByMultiField(DataSetConstant.GAME_DOUBLE_MATCH_INFORMATION, queries, null,
                    null, null, null);
            if (intentional != null) {
                throw new CustomException(ResultCodeEnum.ONLY_ONE_INTENTIONAL_MATCH);
            }
        }

        if (MatchStatusCodeEnum.MATCH_TYPE_RANDOM.getCode().equals(matchType)) {
            HashMap<String, Object> queries = new HashMap<String, Object>();
            queries.put(DoubleMatchPostVo.HOLDER, holder1);
            queries.put(DoubleMatchPostVo.CHALLENGER, challenger1);
            queries.put(DoubleMatchPostVo.STATUS, MatchStatusCodeEnum.MATCH_ACKNOWLEDGED_MATCHING.getCode());
            Object intentional = SearchApi.searchByMultiField(DataSetConstant.GAME_DOUBLE_MATCH_INFORMATION, queries, null,
                    null, null, null);
            if (intentional != null) {
                throw new CustomException(ResultCodeEnum.ALREADY_POSTED_CHALLENGE);
            }
        }

        if (!TextUtils.isEmpty(holder1) && !TextUtils.isEmpty(challenger1)) {
            ArrayList<QueryBuilder> params = new ArrayList<QueryBuilder>();
            params.add(SearchApi.createMultiFieldsWithSingleValue(holder1, DoubleMatchPostVo.HOLDER, DoubleMatchPostVo.CHALLENGER));
            params.add(
                    SearchApi.createMultiFieldsWithSingleValue(challenger1, DoubleMatchPostVo.HOLDER, DoubleMatchPostVo.CHALLENGER));
            params.add(QueryBuilders.termsQuery(DoubleMatchPostVo.STATUS,
                    String.valueOf(MatchStatusCodeEnum.MATCH_ACKNOWLEDGED_MATCHING.getCode()),
                    String.valueOf(MatchStatusCodeEnum.MATCH_PLAYING_MATCHING.getCode())));
            QueryBuilder[] values = new QueryBuilder[8];
            Object intentional = SearchApi.searchByMultiQueriesAndOrders(DataSetConstant.GAME_DOUBLE_MATCH_INFORMATION, null,
                    0, 50, params.toArray(values));
            if (intentional != null) {
                throw new CustomException(ResultCodeEnum.ALREADY_POSTED_CHALLENGE);
            }
        }

        if (!StringUtil.isEmpty(parendId)) {
            vo.setParendId(parendId);
        }
        vo.setHolder(holder1);
        if (!StringUtil.isEmpty(challenger1)) {
            vo.setChallenger(challenger1);
        }
        MatchStatusCodeEnum status = null;
        if (!StringUtil.isEmpty(challenger1) && !StringUtil.isEmpty(holder1)) {
            status = MatchStatusCodeEnum.MATCH_TYPE_RANDOM.getCode().equals(matchType) ? 
            MatchStatusCodeEnum.MATCH_PLAYING_MATCHING: MatchStatusCodeEnum.MATCH_ACKNOWLEDGED_MATCHING;
            if(MatchStatusCodeEnum.MATCH_TYPE_RANDOM.getCode().equals(matchType)){
                vo.setOrderTime(DateUtil.getCurrentDate(DateUtil.FORMAT_DATE_TIME));
            }
        } else {
            status = MatchStatusCodeEnum.MATCH_MATCHING_STATUS;
        }
        vo.setStatus(status.getCode());
        vo.setMatchType(matchType);
        vo.setClubMatch(clubMatch);

        if (!StringUtil.isEmpty(orderTime)) {
            vo.setOrderTime(orderTime);
        }
        if (!StringUtil.isEmpty(courtName)) {
            vo.setCourtName(courtName);
        }
        if (!StringUtil.isEmpty(courtGps)) {
            vo.setCourtGPS(courtGps);
        }

        String id = DateUtil.getCurrentDate(DateUtil.FORMAT_DATETIME_NUM);
        id = String.format("%s-%s-%s", id, holder1, StringUtil.isEmpty(challenger1) ? "" : challenger1);
        id = SearchApi.insertDocument(DataSetConstant.GAME_DOUBLE_MATCH_INFORMATION, JSON.toJSONString(vo), id);
        return id;
    }



}
