package ledong.wxapp.service.impl;

import java.text.ParseException;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.apache.http.util.TextUtils;
import org.apache.log4j.Logger;
import org.elasticsearch.index.query.QueryBuilder;
import org.elasticsearch.search.sort.SortOrder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;

import VO.CourtVo;
import VO.MatchPostVo;
import VO.MatchRequestVo;
import VO.RankInfoVo;
import VO.SessionVo;
import VO.UserVo;
import ledong.wxapp.constant.DataSetConstant;
import ledong.wxapp.constant.enums.MatchStatusCodeEnum;
import ledong.wxapp.redis.RedisUtil;
import ledong.wxapp.search.SearchApi;
import ledong.wxapp.service.IMatchService;
import ledong.wxapp.service.IRankService;
import ledong.wxapp.service.IUserService;
import ledong.wxapp.strategy.MatchStrategy;
import ledong.wxapp.strategy.context.MatchContext;
import ledong.wxapp.strategy.impl.match.PickIntentionalMatch;
import ledong.wxapp.strategy.impl.match.PickRandomMatch;
import ledong.wxapp.strategy.impl.match.PostRandomMatch;
import ledong.wxapp.utils.DateUtil;
import ledong.wxapp.utils.StringUtil;

@Service
public class MatchServiceImpl implements IMatchService {
    private final static Logger log = Logger.getLogger(MatchServiceImpl.class);

    @Autowired
    private RedisUtil redis;

    @Autowired
    private IRankService iRankService;

    @Autowired
    private IUserService iUserService;

    @Override
    public String requestMatching(String user, String courtGps) {

        MatchRequestVo vo = new MatchRequestVo();
        vo.setCreateTime(DateUtil.getCurrentDate(DateUtil.FORMAT_DATE_TIME));
        vo.setLocation(courtGps);
        vo.setUserName(user);
        MatchContext strategy = null;
        String matchId = null;
        log.info(user);
        log.info(courtGps);
        strategy = new MatchContext(new PickRandomMatch(redis, iRankService));
        matchId = strategy.getMatchId(vo);
        log.info(matchId);
        if (!TextUtils.isEmpty(matchId)) {
            return matchId;
        }

        strategy = new MatchContext(new PickIntentionalMatch());
        matchId = strategy.getMatchId(vo);
        if (!TextUtils.isEmpty(matchId)) {
            return acceptIntentionalMatch(matchId, user);
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
            params.add(SearchApi.createSearchByFieldSource(MatchPostVo.STATUS,
                    MatchStatusCodeEnum.MATCH_MATCHING_STATUS.getCode()));
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
            if (session.get(SessionVo.CHALLENGERCONTEXT) != null) {
                challengerContext = ((List<HashMap<String, Object>>) session.get(SessionVo.CHALLENGERCONTEXT)).stream()
                        .collect(Collectors.toCollection(LinkedList::new));
                challengerContext = challengerContext.stream()
                        .sorted(Comparator.comparing(SessionVo::comparingByTime).reversed())
                        .collect(Collectors.toCollection(LinkedList::new));
            }
            if (session.get(SessionVo.HOLDERCONTEXT) != null) {
                holderContext = ((List<HashMap<String, Object>>) session.get(SessionVo.HOLDERCONTEXT)).stream()
                        .collect(Collectors.toCollection(LinkedList::new));

                holderContext = holderContext.stream()
                        .sorted(Comparator.comparing(SessionVo::comparingByTime).reversed())
                        .collect(Collectors.toCollection(LinkedList::new));
            }
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
        vo.setHolderScore(holderScore);
        vo.setChallengerScore(challengerScore);
        vo.setRanked(MatchStatusCodeEnum.MATCH_RANKED_STATUS.getCode());
        vo.setGamedTime(DateUtil.getCurrentDate(DateUtil.FORMAT_DATE_TIME));
        vo.setStatus(MatchStatusCodeEnum.MATCH_GAMED_MATCHING.getCode());
        System.out.println(JSON.toJSONString(vo));
        return SearchApi.updateDocument(DataSetConstant.GAME_MATCH_INFORMATION, JSON.toJSONString(vo), vo.getId());
    }

    @Override
    public Object getIntentionalMatch(Integer count) {
        return SearchApi.searchByFieldSorted(DataSetConstant.GAME_MATCH_INFORMATION, MatchPostVo.STATUS,
                String.valueOf(MatchStatusCodeEnum.MATCH_MATCHING_STATUS.getCode()), MatchPostVo.CREATETIME,
                SortOrder.DESC, 1, count);
    }

    @Override
    public Object getMatchedList(String user, Integer count) {

        ArrayList<QueryBuilder> params = new ArrayList<QueryBuilder>();
        if (!StringUtil.isEmpty(user)) {
            params.add(SearchApi.createMultiFieldsWithSingleValue(user, MatchPostVo.HOLDER, MatchPostVo.CHALLENGER));
        }
        params.add(SearchApi.createSearchByFieldSource(MatchPostVo.STATUS,
                MatchStatusCodeEnum.MATCH_ACKNOWLEDGED_MATCHING.getCode()));
        Map<String, SortOrder> sortPropertiesQueries = new HashMap<String, SortOrder>(16);
        sortPropertiesQueries.put(MatchPostVo.ORDERTIME, SortOrder.ASC);
        QueryBuilder[] values = new QueryBuilder[8];
        List<HashMap<String, Object>> searchResponse = SearchApi.searchByMultiQueriesAndOrders(
                DataSetConstant.GAME_MATCH_INFORMATION, sortPropertiesQueries, 0, 50, params.toArray(values));
        if (searchResponse != null) {
            searchResponse = (List<HashMap<String, Object>>) searchResponse.stream().map(match -> {
                HashMap<String, Object> holder = iUserService.getUserInfo((String) match.get(MatchPostVo.HOLDER));
                RankInfoVo holderRank = iRankService.getUserRank((String) match.get(MatchPostVo.HOLDER));
                match.put(MatchPostVo.HOLDERAVATOR,holder.get(UserVo.AVATOR));
                match.put(MatchPostVo.HOLDERNAME,holder.get(UserVo.NICKNAME));
                match.put(MatchPostVo.HOLDERRANKTYPE0,holderRank.getRankType0());
                HashMap<String, Object>   challenger=   iUserService.getUserInfo((String) match.get(MatchPostVo.CHALLENGER));
                RankInfoVo challengerRank = iRankService.getUserRank((String) match.get(MatchPostVo.CHALLENGER));
                match.put(MatchPostVo.CHALLENGERAVATOR,challenger.get(UserVo.AVATOR));
                match.put(MatchPostVo.CHALLENGERNAME,challenger.get(UserVo.NICKNAME));
                match.put(MatchPostVo.CHALLENGERRANKTYPE0,challengerRank.getRankType0());
                return match;
            })
            .collect(Collectors.toList());
          }
               
                // iUserService.getUserInfo(openId);
        return searchResponse;

    }

    @Override
    public Object getMatchInfos(String matchId) {
        return SearchApi.searchById(DataSetConstant.GAME_MATCH_INFORMATION, matchId);
    }

    @Override
    public Object updateMatchInfos(String matchId, String orderTime, String courtName) {

        HashMap<String, Object> match = SearchApi.searchById(DataSetConstant.GAME_MATCH_INFORMATION, matchId);
        if (match == null) {
            return null;
        }

        MatchPostVo vo = JSONObject.parseObject(JSONObject.toJSONString(match), MatchPostVo.class);
        if (!MatchStatusCodeEnum.MATCH_ACKNOWLEDGED_MATCHING .getCode().equals(vo.getStatus())) {
            return null;
        }
        if (!TextUtils.isEmpty(orderTime)) {
            vo.setOrderTime(orderTime);
        }
        if (!TextUtils.isEmpty(courtName)) {
            vo.setCourtName(courtName);
        }
        vo.setChallengerAcknowledged(MatchStatusCodeEnum.USER_UN_ACKNOWLADGED.getCode());
        vo.setHolderAcknowledged(MatchStatusCodeEnum.USER_UN_ACKNOWLADGED.getCode());
        return SearchApi.updateDocument(DataSetConstant.GAME_MATCH_INFORMATION, JSON.toJSONString(vo), matchId);
    }

    @Override
    public Object confirmMatch(String matchId, Integer type) {
        HashMap<String, Object> match = SearchApi.searchById(DataSetConstant.GAME_MATCH_INFORMATION, matchId);
        if (match == null) {
            return null;
        }
        MatchPostVo vo = JSONObject.parseObject(JSONObject.toJSONString(match), MatchPostVo.class);
        if (type == 0) {
            vo.setHolderAcknowledged(MatchStatusCodeEnum.USER_ACKNOWLADGED.getCode());
        } else {
            vo.setChallengerAcknowledged(MatchStatusCodeEnum.USER_ACKNOWLADGED.getCode());
        }
        System.out.println(vo.getChallengerAcknowledged());
        System.out.println(vo.getHolderAcknowledged());
        System.out.println(vo.getStatus());
        if (MatchStatusCodeEnum.USER_ACKNOWLADGED.getCode().equals(vo.getChallengerAcknowledged())
                && MatchStatusCodeEnum.USER_ACKNOWLADGED.getCode().equals(vo.getHolderAcknowledged())) {

           if(!vo.getStatus().equals(MatchStatusCodeEnum.MATCH_PLAYING_MATCHING.getCode())){
            vo.setStatus(MatchStatusCodeEnum.MATCH_PLAYING_MATCHING.getCode());
            vo.setChallengerAcknowledged(MatchStatusCodeEnum.USER_UN_ACKNOWLADGED.getCode());
            vo.setHolderAcknowledged(MatchStatusCodeEnum.USER_UN_ACKNOWLADGED.getCode());
            System.out.println("update acknowledged");
           }else{
               vo.setStatus(MatchStatusCodeEnum.MATCH_GAMED_MATCHING.getCode());
               finishMatch(matchId, vo.getHolderScore(), vo.getChallengerScore());
               System.out.println("finished game");
           }     
        }
        return SearchApi.updateDocument(DataSetConstant.GAME_MATCH_INFORMATION, JSON.toJSONString(vo), matchId);
    }

    @Override
    public Object playingMatchInfo(String user) {
        ArrayList<QueryBuilder> params = new ArrayList<QueryBuilder>();
        if (!StringUtil.isEmpty(user)) {
            params.add(SearchApi.createMultiFieldsWithSingleValue(user, MatchPostVo.HOLDER, MatchPostVo.CHALLENGER));
        }
        params.add(SearchApi.createSearchByFieldSource(MatchPostVo.STATUS,
                MatchStatusCodeEnum.MATCH_PLAYING_MATCHING.getCode()));
        Map<String, SortOrder> sortPropertiesQueries = new HashMap<String, SortOrder>(16);
        sortPropertiesQueries.put(MatchPostVo.ORDERTIME, SortOrder.ASC);
        QueryBuilder[] values = new QueryBuilder[8];
        LinkedList<HashMap<String, Object>> searchResponse = SearchApi.searchByMultiQueriesAndOrders(
                DataSetConstant.GAME_MATCH_INFORMATION, sortPropertiesQueries, 0, 1, params.toArray(values));
        return searchResponse == null ? null : searchResponse.get(0);
    }

    @Override
    public Object rankedMatchInfo(String user) {
        String matchId = (String) redis.get(StringUtil.combiningSpecifiedUserKey(user, "ranked"));
        redis.del(StringUtil.combiningSpecifiedUserKey(user, "ranked"));
        return getMatchInfos(matchId);
    }

    @Override
    public Object updateMatchScore(String matchId, Integer holderScore, Integer challengerScore) {

        HashMap<String, Object> match = SearchApi.searchById(DataSetConstant.GAME_MATCH_INFORMATION, matchId);
        if (match == null) {
            return null;
        }

        MatchPostVo vo = JSONObject.parseObject(JSONObject.toJSONString(match), MatchPostVo.class);
        if (!MatchStatusCodeEnum.MATCH_PLAYING_MATCHING.getCode().equals(vo.getStatus())) {
            return null;
        }

        // vo.setHolderScore(holderScore);
        // Optional.ofNullable(holderScore).ifPresent(i -> {
        if (holderScore != null) {
            vo.setHolderScore(holderScore);
        }
        // vo.setHolderAcknowledged(MatchStatusCodeEnum.USER_UN_ACKNOWLADGED.getCode());
        // });
        ;
        // Optional.ofNullable(challengerScore).ifPresent(i -> {
        if (challengerScore != null) {
            vo.setChallengerScore(challengerScore);
        }
        // vo.setChallengerAcknowledged(MatchStatusCodeEnum.USER_UN_ACKNOWLADGED.getCode());
        // });
        // ;
        vo.setHolderAcknowledged(MatchStatusCodeEnum.USER_UN_ACKNOWLADGED.getCode());
        vo.setChallengerAcknowledged(MatchStatusCodeEnum.USER_UN_ACKNOWLADGED.getCode());
       
        return SearchApi.updateDocument(DataSetConstant.GAME_MATCH_INFORMATION, JSON.toJSONString(vo), matchId);
    }

    @Override
    public Object lastMatchResult(String user) {
        String key = StringUtil.combiningSpecifiedUserKey(user, "ranked");
      String matchId= (String) redis.get(key);
      redis.del(key);
        return getMatchInfos(matchId);
    }

    @Override
    public LinkedList<HashMap<String, Object>> nearByCourt(String gps) {
        return  SearchApi.searchByLocation(DataSetConstant.COURT_INFORMATION, CourtVo.LOCATION, gps,"10");
    }




}
