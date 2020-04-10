package ledong.wxapp.service.impl;

import java.text.ParseException;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.apache.http.util.TextUtils;
import org.apache.log4j.Logger;
import org.elasticsearch.index.query.QueryBuilder;
import org.elasticsearch.search.sort.SortOrder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;

import VO.MatchPostVo;
import VO.MatchRequestVo;
import VO.SessionVo;
import ledong.wxapp.constant.DataSetConstant;
import ledong.wxapp.constant.enums.MatchStatusCodeEnum;
import ledong.wxapp.redis.RedisUtil;
import ledong.wxapp.search.SearchApi;
import ledong.wxapp.service.IMatchService;
import ledong.wxapp.service.IRankService;
import ledong.wxapp.strategy.MatchStrategy;
import ledong.wxapp.strategy.context.MatchContext;
import ledong.wxapp.strategy.impl.PickIntentionalMatch;
import ledong.wxapp.strategy.impl.PickRandomMatch;
import ledong.wxapp.strategy.impl.PostRandomMatch;
import ledong.wxapp.utils.DateUtil;
import ledong.wxapp.utils.StringUtil;

@Service
public class MatchServiceImpl implements IMatchService {
    private final static Logger log = Logger.getLogger(MatchServiceImpl.class);

    @Autowired
    private RedisUtil redis;

    @Autowired
    private IRankService iRankService;

    @Override
    public String requestMatching(String user, String courtGps) {

        MatchRequestVo vo = new MatchRequestVo();
        vo.setCreateTime(DateUtil.getCurrentDate(DateUtil.FORMAT_DATE_TIME));
        vo.setLocation(courtGps);
        vo.setUserName(user);
        MatchContext strategy = null;
        String matchId = null;

        strategy = new MatchContext(new PickRandomMatch(redis, iRankService));
        matchId = strategy.getMatchId(vo);
        if (!TextUtils.isEmpty(matchId)) {
            return matchId;
        }

        strategy = new MatchContext(new PickIntentionalMatch());
        matchId = strategy.getMatchId(vo);
        if (!TextUtils.isEmpty(matchId)) {
            return matchId;
        }

        strategy = new MatchContext(new PostRandomMatch(redis));
        matchId = strategy.getMatchId(vo);
        if (!TextUtils.isEmpty(matchId)) {
            return matchId;
        }

        return null;
    }

    @Override
    public String postMatches(String parendId, String holder, String challenger, int matchType, int clubMatch,
            String orderTime, String courtName, String courtGps) {
        return MatchStrategy.postMatches(parendId, holder, challenger, matchType, clubMatch, orderTime, courtName,
                courtGps);
    }

    @Override
    public String attachedMatchSession(String matchId, String holderId, String challengerId) {
        return MatchStrategy.attachedMatchSession(matchId, holderId, challengerId);
    }

    @Override
    public String postIntentionalMatch(String user, String orderTime, String courtName, String courtGps) {
        return postMatches(null, user, null, MatchStatusCodeEnum.MATCH_TYPE_PICK.getCode(),
                MatchStatusCodeEnum.NON_CLUB_MATCH.getCode(), orderTime, courtName, courtGps);
    }

    @Override
    public String postChallengeMatch(String holder, String challenger) {
        String matchId = postMatches(null, holder, challenger, MatchStatusCodeEnum.MATCH_TYPE_PICK.getCode(),
                MatchStatusCodeEnum.NON_CLUB_MATCH.getCode(), null, null, null);
        attachedMatchSession(matchId, holder, challenger);
        return matchId;
    }

    @Override
    public String acceptIntentionalMatch(String parentId, String challenger) {
        HashMap<String, Object> match = SearchApi.searchById(DataSetConstant.GAME_MATCH_INFORMATION, parentId);
        if (match == null) {
            return null;
        }
        String holder = (String) match.get(MatchPostVo.HOLDER);
        String matchId = postMatches((String) match.get(MatchPostVo.ID), holder, challenger,
                MatchStatusCodeEnum.MATCH_TYPE_PICK.getCode(), MatchStatusCodeEnum.NON_CLUB_MATCH.getCode(),
                (String) match.get(MatchPostVo.ORDERTIME), (String) match.get(MatchPostVo.COURTNAME),
                (String) match.get(MatchPostVo.COURTGPS));
        attachedMatchSession(matchId, holder, challenger);
        return matchId;
    }

    @Override
    public LinkedList<HashMap<String, Object>> getIntentionalMatchs(String postUser, String exclusiveUser) {
        try {
            ArrayList<QueryBuilder> params = new ArrayList<QueryBuilder>();
            if (!StringUtil.isEmpty(postUser)) {
                params.add(SearchApi.createSearchByFieldSource(MatchPostVo.HOLDER, postUser));
            }
            if (!StringUtil.isEmpty(exclusiveUser)) {
                params.add(SearchApi.createNotSearchSource(MatchPostVo.HOLDER, exclusiveUser));
            }
            if (params.size() == 0) {
                params.add(SearchApi.createSearchAll());
            }
            String endTime = DateUtil.getDate(DateUtil.getSundayOfThisWeek(), DateUtil.FORMAT_DATE_TIME);

            String startTime = DateUtil.getDate(DateUtil.getMondayOfThisWeek(), DateUtil.FORMAT_DATE_TIME);
            params.add(SearchApi.createSearchByFieldRangeSource(MatchPostVo.ORDERTIME, startTime, endTime));
            Map<String, SortOrder> sortPropertiesQueries = new HashMap<String, SortOrder>(16);
            sortPropertiesQueries.put(MatchPostVo.ORDERTIME, SortOrder.ASC);
            QueryBuilder[] values = new QueryBuilder[8];
            LinkedList<HashMap<String, Object>> searchResponse = SearchApi.searchByMultiQueriesAndOrders(
                    DataSetConstant.GAME_MATCH_INFORMATION, sortPropertiesQueries, 0, 50, params.toArray(values));
            return searchResponse;
        } catch (ParseException e) {
            e.printStackTrace();
        }
        return null;
    }

    @Override
    @SuppressWarnings("unchecked")
    public Object getSessionContext(String sessionId, int seconds) {
        HashMap<String, Object> session = SearchApi.searchById(DataSetConstant.SESSION_INFORMATION, sessionId);

        LinkedList<HashMap<String, Object>> challengerContext = null;
        LinkedList<HashMap<String, Object>> holderContext = null;
        if (session == null) {
            return null;
        } else if (Integer.valueOf(0).equals(seconds)) {
            // challengerContext = (List<HashMap<String, Object>>)
            // session.get(SessionVo.CHALLENGERCONTEXT);
            challengerContext = ((List<HashMap<String, Object>>) session.get(SessionVo.CHALLENGERCONTEXT)).stream()
                    .collect(Collectors.toCollection(LinkedList::new));
            holderContext = ((List<HashMap<String, Object>>) session.get(SessionVo.HOLDERCONTEXT)).stream()
                    .collect(Collectors.toCollection(LinkedList::new));

        } else {
            challengerContext = ((List<HashMap<String, Object>>) session.get(SessionVo.CHALLENGERCONTEXT)).stream()
                    .collect(Collectors.toCollection(LinkedList::new));
            holderContext = ((List<HashMap<String, Object>>) session.get(SessionVo.HOLDERCONTEXT)).stream()
                    .collect(Collectors.toCollection(LinkedList::new));
            challengerContext = challengerContext.stream()
                    .sorted(Comparator.comparing(SessionVo::comparingByTime).reversed())
                    .collect(Collectors.toCollection(LinkedList::new));
            holderContext = holderContext.stream().sorted(Comparator.comparing(SessionVo::comparingByTime).reversed())
                    .collect(Collectors.toCollection(LinkedList::new));
            while (seconds > 0) {
                challengerContext.pollLast();
                holderContext.pollLast();
                seconds--;
            }

        }
        HashMap<String, Object> content = new HashMap<String, Object>();
        content.put(SessionVo.CHALLENGERCONTEXT, challengerContext);
        content.put(SessionVo.HOLDERCONTEXT, holderContext);
        return content;
    }

    @Override
    public String insertSessionContext(String sessionId, String context, int type) {
        HashMap<String, Object> session = SearchApi.searchById(DataSetConstant.SESSION_INFORMATION, sessionId);
        // SessionVo vo = null;
        if (session == null) {
            System.out.println("session is not existed");
            return null;
        } else {
            Map<String, String> o = new HashMap<String, String>();
            o.put(SessionVo.dialogDetail.POSTTIME, DateUtil.getCurrentDate(DateUtil.FORMAT_DATE_TIME));
            o.put(SessionVo.dialogDetail.CONTEXT, context);
            return SearchApi.updateExistListObject(DataSetConstant.SESSION_INFORMATION, sessionId, o,
                    type == 0 ? SessionVo.HOLDERCONTEXT : SessionVo.CHALLENGERCONTEXT, false);
        }

    }

    @SuppressWarnings("unchecked")
    @Override
    public Object getSessionContextWithQuantity(String sessionId, int holderCount, int challengerCount) {
        HashMap<String, Object> session = SearchApi.searchById(DataSetConstant.SESSION_INFORMATION, sessionId);

        LinkedList<HashMap<String, Object>> challengerContext = null;
        LinkedList<HashMap<String, Object>> holderContext = null;
        if (session == null) {
            return null;
        } else {
            challengerContext = ((List<HashMap<String, Object>>) session.get(SessionVo.CHALLENGERCONTEXT)).stream()
                    .collect(Collectors.toCollection(LinkedList::new));
            holderContext = ((List<HashMap<String, Object>>) session.get(SessionVo.HOLDERCONTEXT)).stream()
                    .collect(Collectors.toCollection(LinkedList::new));
            challengerContext = challengerContext.stream()
                    .sorted(Comparator.comparing(SessionVo::comparingByTime).reversed())
                    .collect(Collectors.toCollection(LinkedList::new));
            holderContext = holderContext.stream().sorted(Comparator.comparing(SessionVo::comparingByTime).reversed())
                    .collect(Collectors.toCollection(LinkedList::new));
            while (holderCount > 0) {
                holderContext.pollLast();
                holderCount--;
            }
            while (challengerCount > 0) {
                challengerContext.pollLast();
                challengerCount--;
            }
        }
        HashMap<String, Object> content = new HashMap<String, Object>();
        content.put(SessionVo.CHALLENGERCONTEXT, challengerContext);
        content.put(SessionVo.HOLDERCONTEXT, holderContext);
        return content;
    }

    @Override
    public String finishMatch(String matchId, int holderScore, int challengerScore) {
        HashMap<String, Object> match = SearchApi.searchById(DataSetConstant.GAME_MATCH_INFORMATION, matchId);
        if (match == null) {
            return null;
        }
        String score = iRankService.matchRank(matchId, holderScore, challengerScore);
        MatchPostVo vo = JSONObject.parseObject(JSONObject.toJSONString(match), MatchPostVo.class);
        vo.setWinner(holderScore > challengerScore ? MatchStatusCodeEnum.HOLDER_WIN_MATCH.getCode()
                : MatchStatusCodeEnum.HOLDER_WIN_MATCH.getCode());
        vo.setWinScore(holderScore > challengerScore ? holderScore : challengerScore);
        vo.setLoseScore(holderScore < challengerScore ? holderScore : challengerScore);
        vo.setRanked(MatchStatusCodeEnum.MATCH_RANKED_STATUS.getCode());
        vo.setGamedTime(DateUtil.getCurrentDate(DateUtil.FORMAT_DATE_TIME));
        vo.setStatus(MatchStatusCodeEnum.MATCH_RANKED_STATUS.getCode());
        return SearchApi.updateDocument(DataSetConstant.GAME_MATCH_INFORMATION, JSON.toJSONString(vo), vo.getId());
    }

    @Override
    public Object getIntentionalMatch(Integer count) {
        return SearchApi.searchByFieldSorted(DataSetConstant.GAME_MATCH_INFORMATION, MatchPostVo.STATUS,
                String.valueOf(MatchStatusCodeEnum.MATCH_MATCHING_STATUS.getCode()), MatchPostVo.CREATETIME,
                SortOrder.DESC, 1, count);
    }

}
