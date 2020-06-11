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

import javax.annotation.Resource;

import org.apache.http.util.TextUtils;
import org.apache.log4j.Logger;
import org.elasticsearch.index.query.BoolQueryBuilder;
import org.elasticsearch.index.query.QueryBuilder;
import org.elasticsearch.index.query.QueryBuilders;
import org.elasticsearch.search.aggregations.AggregationBuilders;
import org.elasticsearch.search.aggregations.bucket.terms.TermsAggregationBuilder;
import org.elasticsearch.search.builder.SearchSourceBuilder;
import org.elasticsearch.search.sort.SortOrder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.stereotype.Service;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;

import VO.CourtVo;
import VO.MatchConfirmEvent;
import VO.MatchPostVo;
import VO.MatchRequestVo;
import VO.RankInfoVo;
import VO.SessionVo;
import VO.UserVo;
import ledong.wxapp.config.CustomException;
import ledong.wxapp.constant.DataSetConstant;
import ledong.wxapp.constant.enums.MatchStatusCodeEnum;
import ledong.wxapp.constant.enums.ResultCodeEnum;
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

    @Resource
    private ApplicationContext ctx;

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
        log.info("---1" + matchId);

        if (!TextUtils.isEmpty(matchId)) {
            return matchId;
        }

        // strategy = new MatchContext(new PickIntentionalMatch());
        // matchId = strategy.getMatchId(vo);
        // log.info("---2" + matchId);
        // if (!TextUtils.isEmpty(matchId)) {
        // return acceptIntentionalMatch(matchId, user);
        // }

        strategy = new MatchContext(new PostRandomMatch(redis));
        matchId = strategy.getMatchId(vo);
        log.info("---3" + matchId);
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
        return postMatches(null, user, null, MatchStatusCodeEnum.MATCH_TYPE_INTENTIONAL.getCode(),
                MatchStatusCodeEnum.NON_CLUB_MATCH.getCode(), orderTime, courtName, courtGps);
    }

    @Override
    public String postChallengeMatch(String holder, String challenger) {

        ArrayList<QueryBuilder> params = new ArrayList<QueryBuilder>();

        params.add(SearchApi.createSearchByFieldSource(MatchPostVo.HOLDER, holder));

        params.add(SearchApi.createSearchByFieldSource(MatchPostVo.CHALLENGER, challenger));

        params.add(SearchApi.createSearchByFieldSource(MatchPostVo.STATUS,
                MatchStatusCodeEnum.MATCH_ACKNOWLEDGED_MATCHING.getCode()));
        Map<String, SortOrder> sortPropertiesQueries = new HashMap<String, SortOrder>(16);

        // String time = DateUtil.getCurrentDate(DateUtil.FORMAT_DATE_TIME);
        // params.add(SearchApi.createSearchByFieldRangeGtSource(MatchPostVo.ORDERTIME, time));

        QueryBuilder[] values = new QueryBuilder[8];
        LinkedList<HashMap<String, Object>> searchResponse = SearchApi.searchByMultiQueriesAndOrders(
                DataSetConstant.GAME_MATCH_INFORMATION, sortPropertiesQueries, 0, 50, params.toArray(values));

        if (searchResponse != null) {
            log.error("        -------------  throw exception");
            throw new CustomException(ResultCodeEnum.ALREADY_POSTED_CHALLENGE);
        }
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
        String id = String.format("%s%s", parentId, StringUtil.isEmpty(challenger) ? "" : challenger);
        if (SearchApi.searchById(DataSetConstant.GAME_MATCH_INFORMATION, id) != null) {
            log.error("        -------------  throw exception");
            throw new CustomException(ResultCodeEnum.ALREADY_ACCEPTED_MATCH);
        }
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
            // String startTime = DateUtil.getDate(DateUtil.getMondayOfThisWeek(),
            // DateUtil.FORMAT_DATE_TIME);
            String startTime = DateUtil.getCurrentDate(DateUtil.FORMAT_DATE_TIME);
            // params.add(SearchApi.createSearchByFieldRangeGtSource(MatchPostVo.ORDERTIME,
            // time));

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
                : MatchStatusCodeEnum.CHALLENGER_WIN_MATCH.getCode());
        vo.setHolderScore(holderScore);
        vo.setChallengerScore(challengerScore);
        vo.setRanked(MatchStatusCodeEnum.MATCH_RANKED_STATUS.getCode());
        vo.setGamedTime(DateUtil.getCurrentDate(DateUtil.FORMAT_DATE_TIME));
        vo.setStatus(MatchStatusCodeEnum.MATCH_GAMED_MATCHING.getCode());

        return SearchApi.updateDocument(DataSetConstant.GAME_MATCH_INFORMATION, JSON.toJSONString(vo), vo.getId());
    }

    @Override
    public Object getIntentionalMatch(Integer count) {
        // List<HashMap<String, Object>> searchResponse = SearchApi.searchByFieldSorted(
        // DataSetConstant.GAME_MATCH_INFORMATION, MatchPostVo.STATUS,
        // String.valueOf(MatchStatusCodeEnum.MATCH_MATCHING_STATUS.getCode()),
        // MatchPostVo.CREATETIME,
        // SortOrder.DESC, 1, count);

        ArrayList<QueryBuilder> params = new ArrayList<QueryBuilder>();

        params.add(SearchApi.createSearchByFieldSource(MatchPostVo.STATUS,
                String.valueOf(MatchStatusCodeEnum.MATCH_MATCHING_STATUS.getCode())));
        String time = DateUtil.getCurrentDate(DateUtil.FORMAT_DATE_TIME);
        params.add(SearchApi.createSearchByFieldRangeGtSource(MatchPostVo.ORDERTIME, time));
        Map<String, SortOrder> sortPropertiesQueries = new HashMap<String, SortOrder>(16);

        QueryBuilder[] values = new QueryBuilder[8];
        List<HashMap<String, Object>> searchResponse = SearchApi.searchByMultiQueriesAndOrders(
                DataSetConstant.GAME_MATCH_INFORMATION, sortPropertiesQueries, 0, count, params.toArray(values));

        if (searchResponse != null) {
            String[] idsArr = new String[searchResponse.size()];
            List<String> ids = new ArrayList<String>();

            searchResponse = (List<HashMap<String, Object>>) searchResponse.stream().map(match -> {
                ids.add((String) match.get(MatchPostVo.HOLDER));
                return match;
            }).collect(Collectors.toList());

            LinkedList<Map<String, Object>> userInfos = SearchApi.getDocsByMultiIds(DataSetConstant.USER_INFORMATION,
                    ids.toArray(idsArr));
            LinkedList<Map<String, Object>> userRankInfos = SearchApi
                    .getDocsByMultiIds(DataSetConstant.USER_RANK_INFORMATION, ids.toArray(idsArr));

            searchResponse = (List<HashMap<String, Object>>) searchResponse.stream().map(match -> {
                List<Map<String, Object>> holder = userInfos.stream()
                        .filter(i -> i.get(RankInfoVo.OPENID).equals(match.get(MatchPostVo.HOLDER)))
                        .collect(Collectors.toList());

                List<Map<String, Object>> holderRank = userRankInfos.stream()
                        .filter(i -> i.get(RankInfoVo.OPENID).equals(match.get(MatchPostVo.HOLDER)))
                        .collect(Collectors.toList());

                match.put(MatchPostVo.HOLDERAVATOR, holder.get(0).get(UserVo.AVATOR));
                match.put(MatchPostVo.HOLDERNAME, holder.get(0).get(UserVo.NICKNAME));
                match.put(MatchPostVo.HOLDERRANKTYPE0, holderRank.get(0).get(RankInfoVo.RANKTYPE0));

                return match;
            }).collect(Collectors.toList());
        }
        return searchResponse;
    }

    @Override
    public Object getMatchedList(String user, Integer count) {

        ArrayList<QueryBuilder> params = new ArrayList<QueryBuilder>();
        if (!StringUtil.isEmpty(user)) {
            params.add(SearchApi.createMultiFieldsWithSingleValue(user, MatchPostVo.HOLDER, MatchPostVo.CHALLENGER));
        }

        params.add(SearchApi.createNotSearchSource(MatchPostVo.STATUS,
                MatchStatusCodeEnum.MATCH_MATCHING_STATUS.getCode()));
        params.add(SearchApi.createNotSearchSource(MatchPostVo.STATUS,
                MatchStatusCodeEnum.MATCH_GAMED_MATCHING.getCode()));

        Map<String, SortOrder> sortPropertiesQueries = new HashMap<String, SortOrder>(16);
        sortPropertiesQueries.put(MatchPostVo.ORDERTIME, SortOrder.ASC);
        QueryBuilder[] values = new QueryBuilder[8];
        List<HashMap<String, Object>> searchResponse = SearchApi.searchByMultiQueriesAndOrders(
                DataSetConstant.GAME_MATCH_INFORMATION, sortPropertiesQueries, 0, 50, params.toArray(values));
        if (searchResponse != null) {
            String[] idsArr = new String[searchResponse.size()];
            List<String> idsHolder = new ArrayList<String>();
            List<String> idsChallenger = new ArrayList<String>();

            searchResponse = (List<HashMap<String, Object>>) searchResponse.stream().map(match -> {
                // HashMap<String, Object> holder = iUserService.getUserInfo((String)
                // match.get(MatchPostVo.HOLDER));
                idsHolder.add((String) match.get(MatchPostVo.HOLDER));
                idsChallenger.add((String) match.get(MatchPostVo.CHALLENGER));
                return match;
            }).collect(Collectors.toList());

            LinkedList<Map<String, Object>> userInfosHolder = SearchApi
                    .getDocsByMultiIds(DataSetConstant.USER_INFORMATION, idsHolder.toArray(idsArr));
            LinkedList<Map<String, Object>> userRankInfosHolder = SearchApi
                    .getDocsByMultiIds(DataSetConstant.USER_RANK_INFORMATION, idsHolder.toArray(idsArr));

            LinkedList<Map<String, Object>> userInfosChallenger = SearchApi
                    .getDocsByMultiIds(DataSetConstant.USER_INFORMATION, idsChallenger.toArray(idsArr));
            LinkedList<Map<String, Object>> userRankInfosChallenger = SearchApi
                    .getDocsByMultiIds(DataSetConstant.USER_RANK_INFORMATION, idsChallenger.toArray(idsArr));

            searchResponse = (List<HashMap<String, Object>>) searchResponse.stream().map(match -> {

                List<Map<String, Object>> holder = userInfosHolder.stream()
                        .filter(i -> i.get(RankInfoVo.OPENID).equals(match.get(MatchPostVo.HOLDER)))
                        .collect(Collectors.toList());

                List<Map<String, Object>> holderRank = userRankInfosHolder.stream()
                        .filter(i -> i.get(RankInfoVo.OPENID).equals(match.get(MatchPostVo.HOLDER)))
                        .collect(Collectors.toList());

                match.put(MatchPostVo.HOLDERAVATOR, holder.get(0).get(UserVo.AVATOR));
                match.put(MatchPostVo.HOLDERNAME, holder.get(0).get(UserVo.NICKNAME));
                match.put(MatchPostVo.HOLDERRANKTYPE0, holderRank.get(0).get(RankInfoVo.RANKTYPE0));

                List<Map<String, Object>> challenger = userInfosChallenger.stream()
                        .filter(i -> i.get(RankInfoVo.OPENID).equals(match.get(MatchPostVo.CHALLENGER)))
                        .collect(Collectors.toList());

                List<Map<String, Object>> challengerRank = userRankInfosChallenger.stream()
                        .filter(i -> i.get(RankInfoVo.OPENID).equals(match.get(MatchPostVo.CHALLENGER)))
                        .collect(Collectors.toList());

                match.put(MatchPostVo.CHALLENGERAVATOR, challenger.get(0).get(UserVo.AVATOR));
                match.put(MatchPostVo.CHALLENGERNAME, challenger.get(0).get(UserVo.NICKNAME));
                match.put(MatchPostVo.CHALLENGERRANKTYPE0, challengerRank.get(0).get(RankInfoVo.RANKTYPE0));
                return match;
            }).collect(Collectors.toList());

        }

        // iUserService.getUserInfo(openId);
        return searchResponse;

    }

    @Override
    public Object getMatchInfos(String matchId) {

        if (TextUtils.isEmpty(matchId)) {
            return null;
        }
        HashMap<String, Object> searchResponse = SearchApi.searchById(DataSetConstant.GAME_MATCH_INFORMATION, matchId);

        Optional.ofNullable(searchResponse).ifPresent(i -> {
            String[] idsArr = new String[2];
            List<String> ids = new ArrayList<String>();

            ids.add((String) searchResponse.get(MatchPostVo.HOLDER));
            ids.add((String) searchResponse.get(MatchPostVo.CHALLENGER));

            LinkedList<Map<String, Object>> userInfos = SearchApi.getDocsByMultiIds(DataSetConstant.USER_INFORMATION,
                    ids.toArray(idsArr));
            LinkedList<Map<String, Object>> userRankInfos = SearchApi
                    .getDocsByMultiIds(DataSetConstant.USER_RANK_INFORMATION, ids.toArray(idsArr));

            List<Map<String, Object>> holder = userInfos.stream()
                    .filter(g -> g.get(RankInfoVo.OPENID).equals(searchResponse.get(MatchPostVo.HOLDER)))
                    .collect(Collectors.toList());

            List<Map<String, Object>> holderRank = userRankInfos.stream()
                    .filter(g -> g.get(RankInfoVo.OPENID).equals(searchResponse.get(MatchPostVo.HOLDER)))
                    .collect(Collectors.toList());

            searchResponse.put(MatchPostVo.HOLDERAVATOR, holder.get(0).get(UserVo.AVATOR));
            searchResponse.put(MatchPostVo.HOLDERNAME, holder.get(0).get(UserVo.NICKNAME));
            searchResponse.put(MatchPostVo.HOLDERRANKTYPE0, holderRank.get(0).get(RankInfoVo.RANKTYPE0));

            List<Map<String, Object>> challenger = userInfos.stream()
                    .filter(g -> g.get(RankInfoVo.OPENID).equals(searchResponse.get(MatchPostVo.CHALLENGER)))
                    .collect(Collectors.toList());

            List<Map<String, Object>> challengerRank = userRankInfos.stream()
                    .filter(g -> g.get(RankInfoVo.OPENID).equals(searchResponse.get(MatchPostVo.CHALLENGER)))
                    .collect(Collectors.toList());

            searchResponse.put(MatchPostVo.CHALLENGERAVATOR, challenger.get(0).get(UserVo.AVATOR));
            searchResponse.put(MatchPostVo.CHALLENGERNAME, challenger.get(0).get(UserVo.NICKNAME));
            searchResponse.put(MatchPostVo.CHALLENGERRANKTYPE0, challengerRank.get(0).get(RankInfoVo.RANKTYPE0));

        });

        return searchResponse;
    }

    @Override
    public Object updateMatchInfos(String matchId, String orderTime, String courtName, String courtGPS) {

        HashMap<String, Object> match = SearchApi.searchById(DataSetConstant.GAME_MATCH_INFORMATION, matchId);
        if (match == null) {
            return null;
        }

        MatchPostVo vo = JSONObject.parseObject(JSONObject.toJSONString(match), MatchPostVo.class);
        if (!MatchStatusCodeEnum.MATCH_ACKNOWLEDGED_MATCHING.getCode().equals(vo.getStatus())
                && !MatchStatusCodeEnum.MATCH_MATCHING_STATUS.getCode().equals(vo.getStatus())) {
            return null;
        }
        if (!TextUtils.isEmpty(orderTime)) {
            vo.setOrderTime(orderTime);
        }
        if (!TextUtils.isEmpty(courtName)) {
            vo.setCourtName(courtName);
        }
        if (!TextUtils.isEmpty(courtGPS)) {
            vo.setCourtGPS(courtGPS);
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
        String finishId=null;
        MatchPostVo vo = JSONObject.parseObject(JSONObject.toJSONString(match), MatchPostVo.class);
        if (type == 0) {
            vo.setHolderAcknowledged(MatchStatusCodeEnum.USER_ACKNOWLADGED.getCode());
        } else if(type == 1) {
            vo.setChallengerAcknowledged(MatchStatusCodeEnum.USER_ACKNOWLADGED.getCode());
        } else{
            vo.setHolderAcknowledged(MatchStatusCodeEnum.USER_ACKNOWLADGED.getCode());
            vo.setChallengerAcknowledged(MatchStatusCodeEnum.USER_ACKNOWLADGED.getCode());
        }

        if (MatchStatusCodeEnum.USER_ACKNOWLADGED.getCode().equals(vo.getChallengerAcknowledged())
                && MatchStatusCodeEnum.USER_ACKNOWLADGED.getCode().equals(vo.getHolderAcknowledged())) {

            if (!vo.getStatus().equals(MatchStatusCodeEnum.MATCH_PLAYING_MATCHING.getCode())) {
                vo.setStatus(MatchStatusCodeEnum.MATCH_PLAYING_MATCHING.getCode());
                vo.setChallengerAcknowledged(MatchStatusCodeEnum.USER_UN_ACKNOWLADGED.getCode());
                vo.setHolderAcknowledged(MatchStatusCodeEnum.USER_UN_ACKNOWLADGED.getCode());
                System.out.println("update acknowledged");
            } else {
                vo.setStatus(MatchStatusCodeEnum.MATCH_GAMED_MATCHING.getCode());
                finishId =  finishMatch(matchId, vo.getHolderScore(), vo.getChallengerScore());
                System.out.println("finished game");
            }
        }


        String id=SearchApi.updateDocument(DataSetConstant.GAME_MATCH_INFORMATION, JSON.toJSONString(vo), matchId);
        if(TextUtils.isEmpty(id)){
            throw new CustomException(ResultCodeEnum.CONFIRMED_MATCH_ERROR);
        }
        if (vo.getStatus().equals(MatchStatusCodeEnum.MATCH_PLAYING_MATCHING.getCode()) && TextUtils.isEmpty(finishId)){
            ctx.publishEvent(new MatchConfirmEvent(ctx, id) );
        }
        return id;
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
        if (holderScore != null) {
            vo.setHolderScore(holderScore);
        }
        if (challengerScore != null) {
            vo.setChallengerScore(challengerScore);
        }
        vo.setHolderAcknowledged(MatchStatusCodeEnum.USER_UN_ACKNOWLADGED.getCode());
        vo.setChallengerAcknowledged(MatchStatusCodeEnum.USER_UN_ACKNOWLADGED.getCode());
        log.info(JSON.toJSONString(vo));
        return SearchApi.updateDocument(DataSetConstant.GAME_MATCH_INFORMATION, JSON.toJSONString(vo), matchId);
    }

    @Override
    public Object lastMatchResult(String user) {
        String key = StringUtil.combiningSpecifiedUserKey(user, "ranked");
        String matchId = (String) redis.get(key);
        redis.del(key);
        return getMatchInfos(matchId);
    }

    @Override
    public LinkedList<HashMap<String, Object>> nearByCourt(String gps) {
        return SearchApi.searchByLocation(DataSetConstant.COURT_INFORMATION, CourtVo.LOCATION, gps, "8");
    }

    @Override
    public HashMap<String, Object> commonCourt(String userId) {
        SearchSourceBuilder searchSourceBuilder = new SearchSourceBuilder();
        BoolQueryBuilder user = new BoolQueryBuilder();
        user.should(QueryBuilders.termQuery(MatchPostVo.HOLDER, userId))
                .should(QueryBuilders.termQuery(MatchPostVo.CHALLENGER, userId));
        BoolQueryBuilder match = new BoolQueryBuilder();
        match.must(QueryBuilders.termQuery(MatchPostVo.STATUS, MatchStatusCodeEnum.MATCH_GAMED_MATCHING.getCode()))
                .must(user);
        TermsAggregationBuilder b = AggregationBuilders.terms("court").field(MatchPostVo.COURTNAME);
        searchSourceBuilder.query(match);
        searchSourceBuilder.aggregation(b).size(0);
        String court = SearchApi.mostPlayedCourt(DataSetConstant.GAME_MATCH_INFORMATION, searchSourceBuilder);
        HashMap<String, Object> courtName = new HashMap<String, Object>();
        courtName.put(MatchPostVo.COURTNAME, court);
        return courtName;

    }

}
