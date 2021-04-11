package ledong.wxapp.strategy;

import java.util.ArrayList;
import java.util.HashMap;

import javax.swing.plaf.TextUI;

import com.alibaba.fastjson.JSON;

import org.apache.http.util.TextUtils;
import org.elasticsearch.index.query.QueryBuilder;
import org.elasticsearch.index.query.QueryBuilders;

import VO.MatchPostVo;
import VO.MatchRequestVo;
import VO.SessionVo;
import ledong.wxapp.config.CustomException;
import ledong.wxapp.constant.DataSetConstant;
import ledong.wxapp.constant.enums.MatchStatusCodeEnum;
import ledong.wxapp.constant.enums.ResultCodeEnum;
import ledong.wxapp.search.SearchApi;
import ledong.wxapp.utils.DateUtil;
import ledong.wxapp.utils.StringUtil;
import org.apache.log4j.Logger;

/**
 * matching game base interface
 * 
 * @author uidq1343
 *
 */
public abstract class MatchStrategy {
    private final static Logger log = Logger.getLogger(MatchStrategy.class);

    public abstract String matchingGame(MatchRequestVo vo);


    public static String postLDMatches(String parendId, String holder, String challenger, int matchType, int clubMatch,
                                     String orderTime, String courtName, String courtGps) throws CustomException {
        MatchPostVo vo = new MatchPostVo();
        vo.setCreateTime(DateUtil.getCurrentDate(DateUtil.FORMAT_DATE_TIME));


        vo.setHolder(holder);

        vo.setChallenger(challenger);

        MatchStatusCodeEnum status = null;

        vo.setOrderTime(DateUtil.getCurrentDate(DateUtil.FORMAT_DATE_TIME));
        status = MatchStatusCodeEnum.MATCH_PLAYING_MATCHING;
        vo.setStatus(status.getCode());
        vo.setMatchType(MatchStatusCodeEnum.MATCH_TYPE_INTENTIONAL.getCode());
        if (!StringUtil.isEmpty(courtName)) {
            vo.setCourtName(courtName);
        }
        if (!StringUtil.isEmpty(courtGps)) {
            vo.setCourtGPS(courtGps);
        }
        String id = DateUtil.getCurrentDate(DateUtil.FORMAT_DATETIME_NUM);
        id = String.format("%s-%s-%s", id, holder, StringUtil.isEmpty(challenger) ? "" : challenger);
        id = SearchApi.insertDocument(DataSetConstant.LD_GAME_MATCH_INFORMATION, JSON.toJSONString(vo), id);
        return id;
    }

    public static String postMatches(String parendId, String holder, String challenger, int matchType, int clubMatch,
            String orderTime, String courtName, String courtGps) throws CustomException {
        MatchPostVo vo = new MatchPostVo();
        vo.setCreateTime(DateUtil.getCurrentDate(DateUtil.FORMAT_DATE_TIME));

        // if (MatchStatusCodeEnum.MATCH_TYPE_INTENTIONAL.getCode().equals(matchType)) {
        // HashMap<String, Object> queries = new HashMap<String, Object>();
        // queries.put(MatchPostVo.HOLDER, holder);
        // queries.put(MatchPostVo.STATUS,
        // MatchStatusCodeEnum.MATCH_MATCHING_STATUS.getCode());
        // Object intentional =
        // SearchApi.searchByMultiField(DataSetConstant.GAME_MATCH_INFORMATION, queries,
        // null,
        // null, null, null);
        // if (intentional != null) {
        // throw new CustomException(ResultCodeEnum.ONLY_ONE_INTENTIONAL_MATCH);
        // }
        // }
        //
        // if (MatchStatusCodeEnum.MATCH_TYPE_RANDOM.getCode().equals(matchType)) {
        // HashMap<String, Object> queries = new HashMap<String, Object>();
        // queries.put(MatchPostVo.HOLDER, holder);
        // queries.put(MatchPostVo.CHALLENGER, challenger);
        // queries.put(MatchPostVo.STATUS,
        // MatchStatusCodeEnum.MATCH_ACKNOWLEDGED_MATCHING.getCode());
        // Object intentional =
        // SearchApi.searchByMultiField(DataSetConstant.GAME_MATCH_INFORMATION, queries,
        // null,
        // null, null, null);
        // if (intentional != null) {
        // throw new CustomException(ResultCodeEnum.ALREADY_POSTED_CHALLENGE);
        // }
        // }
        //
        // if (!TextUtils.isEmpty(holder) && !TextUtils.isEmpty(challenger)) {
        // ArrayList<QueryBuilder> params = new ArrayList<QueryBuilder>();
        // params.add(SearchApi.createMultiFieldsWithSingleValue(holder,
        // MatchPostVo.HOLDER, MatchPostVo.CHALLENGER));
        // params.add(
        // SearchApi.createMultiFieldsWithSingleValue(challenger, MatchPostVo.HOLDER,
        // MatchPostVo.CHALLENGER));
        // params.add(QueryBuilders.termsQuery(MatchPostVo.STATUS,
        // String.valueOf(MatchStatusCodeEnum.MATCH_ACKNOWLEDGED_MATCHING.getCode()),
        // String.valueOf(MatchStatusCodeEnum.MATCH_PLAYING_MATCHING.getCode())));
        // QueryBuilder[] values = new QueryBuilder[8];
        // Object intentional =
        // SearchApi.searchByMultiQueriesAndOrders(DataSetConstant.GAME_MATCH_INFORMATION,
        // null,
        // 0, 50, params.toArray(values));
        // if (intentional != null) {
        // throw new CustomException(ResultCodeEnum.ALREADY_POSTED_CHALLENGE);
        // }
        // }
        //
        // if (!StringUtil.isEmpty(parendId)) {
        // vo.setParendId(parendId);
        // }
        vo.setHolder(holder);
        // if (!StringUtil.isEmpty(challenger)) {
        vo.setChallenger(challenger);
        // }
        MatchStatusCodeEnum status = null;
        // if (!StringUtil.isEmpty(challenger) && !StringUtil.isEmpty(holder)) {
        // status = MatchStatusCodeEnum.MATCH_TYPE_RANDOM.getCode().equals(matchType) ?
        // MatchStatusCodeEnum.MATCH_PLAYING_MATCHING:
        // MatchStatusCodeEnum.MATCH_ACKNOWLEDGED_MATCHING;
        // if(MatchStatusCodeEnum.MATCH_TYPE_RANDOM.getCode().equals(matchType)){
        vo.setOrderTime(DateUtil.getCurrentDate(DateUtil.FORMAT_DATE_TIME));
        // }
        // } else {
        status = MatchStatusCodeEnum.MATCH_PLAYING_MATCHING;
        // }
        vo.setStatus(status.getCode());
        vo.setMatchType(MatchStatusCodeEnum.MATCH_TYPE_INTENTIONAL.getCode());
        // vo.setClubMatch(clubMatch);

        // if (!StringUtil.isEmpty(orderTime)) {
        // vo.setOrderTime(orderTime);
        // }
        if (!StringUtil.isEmpty(courtName)) {
            vo.setCourtName(courtName);
        }
        if (!StringUtil.isEmpty(courtGps)) {
            vo.setCourtGPS(courtGps);
        }

        String id = DateUtil.getCurrentDate(DateUtil.FORMAT_DATETIME_NUM);
        id = String.format("%s-%s-%s", id, holder, StringUtil.isEmpty(challenger) ? "" : challenger);
        id = SearchApi.insertDocument(DataSetConstant.GAME_MATCH_INFORMATION, JSON.toJSONString(vo), id);
        log.info("post matches   insert done     ");
        log.info(id);
        return id;
    }

    public static String attachedMatchSession(String matchId, String holderId, String challengerId) {

        SessionVo vo = new SessionVo();

        if (!StringUtil.isEmpty(matchId)) {
            vo.setMatchId(matchId);
        }
        if (!StringUtil.isEmpty(holderId)) {
            vo.setHolderId(holderId);
        }

        if (!StringUtil.isEmpty(challengerId)) {
            vo.setChallenger(challengerId);
        }
        String id = SearchApi.insertDocument(DataSetConstant.SESSION_INFORMATION, JSON.toJSONString(vo));
        matchId = SearchApi.updateFieldValueById(DataSetConstant.GAME_MATCH_INFORMATION, MatchPostVo.SESSIONID, id,
                matchId);
        return id;
    }

}
