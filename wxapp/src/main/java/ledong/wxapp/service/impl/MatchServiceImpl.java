package ledong.wxapp.service.impl;

import java.text.ParseException;
import java.util.*;
import java.util.stream.Collectors;

import javax.annotation.Resource;

import org.apache.http.util.TextUtils;
import org.apache.log4j.Logger;
import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.index.query.BoolQueryBuilder;
import org.elasticsearch.index.query.QueryBuilder;
import org.elasticsearch.index.query.QueryBuilders;
import org.elasticsearch.search.aggregations.AggregationBuilders;
import org.elasticsearch.search.aggregations.bucket.terms.ParsedTerms;
import org.elasticsearch.search.aggregations.bucket.terms.StringTerms;
import org.elasticsearch.search.aggregations.bucket.terms.Terms;
import org.elasticsearch.search.aggregations.bucket.terms.TermsAggregationBuilder;
import org.elasticsearch.search.builder.SearchSourceBuilder;
import org.elasticsearch.search.sort.SortOrder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.stereotype.Service;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;

import VO.CourtVo;
import VO.DoubleMatchPostVo;
import VO.DoubleMatchRequestVo;
import VO.MatchConfirmEvent;
import VO.MatchPostVo;
import VO.MatchRequestVo;
import VO.RankInfoVo;
import VO.SessionVo;
import VO.SlamVo;
import VO.UserVo;
import ledong.wxapp.config.CustomException;
import ledong.wxapp.constant.DataSetConstant;
import ledong.wxapp.constant.enums.MatchStatusCodeEnum;
import ledong.wxapp.constant.enums.ResultCodeEnum;
import ledong.wxapp.search.SearchApi;
import ledong.wxapp.service.IMatchService;
import ledong.wxapp.service.IRankService;
import ledong.wxapp.service.IUserService;
import ledong.wxapp.strategy.DoubleMatchStrategy;
import ledong.wxapp.strategy.MatchStrategy;
import ledong.wxapp.strategy.context.DoubleMatchContext;
import ledong.wxapp.strategy.context.MatchContext;
import ledong.wxapp.strategy.impl.match.DoublePickRandomMatch;
import ledong.wxapp.strategy.impl.match.PickIntentionalMatch;
import ledong.wxapp.strategy.impl.match.PickRandomMatch;
import ledong.wxapp.strategy.impl.match.PostDoubleRandomMatch;
import ledong.wxapp.strategy.impl.match.PostRandomMatch;
import ledong.wxapp.utils.DateUtil;
import ledong.wxapp.utils.StringUtil;

@Service
public class MatchServiceImpl implements IMatchService {
    private final static Logger log = Logger.getLogger(MatchServiceImpl.class);

    // @Autowired
    // private RedisUtil redis;

    @Autowired
    private IRankService iRankService;

    @Autowired
    private IUserService iUserService;

    @Resource
    private ApplicationContext ctx;

    @Override
    public String requestMatching(String user, String courtGps) {

        // MatchRequestVo vo = new MatchRequestVo();
        // vo.setCreateTime(DateUtil.getCurrentDate(DateUtil.FORMAT_DATE_TIME));
        // vo.setLocation(courtGps);
        // vo.setUserName(user);
        // MatchContext strategy = null;
        // String matchId = null;
        // strategy = new MatchContext(new PickRandomMatch(redis, iRankService));
        // matchId = strategy.getMatchId(vo);

        // if (!TextUtils.isEmpty(matchId)) {
        // return matchId;
        // }

        // // strategy = new MatchContext(new PickIntentionalMatch());
        // // matchId = strategy.getMatchId(vo);
        // // log.info("---2" + matchId);
        // // if (!TextUtils.isEmpty(matchId)) {
        // // return acceptIntentionalMatch(matchId, user);
        // // }

        // strategy = new MatchContext(new PostRandomMatch(redis));
        // matchId = strategy.getMatchId(vo);
        // if (!TextUtils.isEmpty(matchId)) {
        // return matchId;
        // }

        return null;
    }

    @Override
    public String requestDoubleMatching(String user) {
        // DoubleMatchRequestVo vo = new DoubleMatchRequestVo();
        // vo.setCreateTime(DateUtil.getCurrentDate(DateUtil.FORMAT_DATE_TIME));
        // vo.setUserName(user);
        // DoubleMatchContext strategy = null;
        // String matchId = null;
        // strategy = new DoubleMatchContext(new DoublePickRandomMatch(redis,
        // iRankService));
        // matchId = strategy.getMatchId(vo);

        // if (!TextUtils.isEmpty(matchId)) {
        // return matchId;
        // }

        // strategy = new DoubleMatchContext(new PostDoubleRandomMatch(redis));
        // matchId = strategy.getMatchId(vo);
        // if (!TextUtils.isEmpty(matchId)) {
        // return matchId;
        // }

        return null;
    }

    @Override
    public String postMatches(String parendId, String holder, String challenger, int matchType, int clubMatch,
            String orderTime, String courtName, String courtGps) {
        return MatchStrategy.postMatches(parendId, holder, challenger, matchType, clubMatch, orderTime, courtName,
                courtGps);
    }




    @Override
    public String postLDMatches(String parendId, String holder, String challenger, int matchType, int clubMatch,
                              String orderTime, String courtName, String courtGps) {
        return MatchStrategy.postLDMatches(parendId, holder, challenger, matchType, clubMatch, orderTime, courtName,
                courtGps);
    }

    @Override
    public String postDoubleMatches(String parendId, String holder, String challenger, int matchType, int clubMatch,
            String orderTime, String courtName, String courtGps) {
        return DoubleMatchStrategy.postDoubleMatches(parendId, holder, null, challenger, null, matchType, clubMatch,
                orderTime, courtName, courtGps);
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
        // params.add(SearchApi.createSearchByFieldRangeGtSource(MatchPostVo.ORDERTIME,
        // time));

        QueryBuilder[] values = new QueryBuilder[8];
        LinkedList<HashMap<String, Object>> searchResponse = SearchApi.searchByMultiQueriesAndOrders(
                DataSetConstant.GAME_MATCH_INFORMATION, sortPropertiesQueries, 0, 50, params.toArray(values));

        if (searchResponse != null) {
            log.error("        -------------  throw exception");
            throw new CustomException(ResultCodeEnum.ALREADY_POSTED_CHALLENGE);
        }
        String matchId = postMatches(null, holder, challenger, MatchStatusCodeEnum.MATCH_TYPE_PICK.getCode(),
                MatchStatusCodeEnum.NON_CLUB_MATCH.getCode(), null, null, null);
        // attachedMatchSession(matchId, holder, challenger);
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
        // attachedMatchSession(matchId, holder, challenger);
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
    public String finishLDMatch(String matchId, int holderScore, int challengerScore) {
        HashMap<String, Object> match = SearchApi.searchById(DataSetConstant.LD_GAME_MATCH_INFORMATION, matchId);
        if (match == null) {
            log.info("finish match   but not found match,then return " + matchId);
            return null;
        }
        log.info("finish match   ready to rank match " + matchId);
        iRankService.matchLDRank(matchId, holderScore, challengerScore);
        MatchPostVo vo = JSONObject.parseObject(JSONObject.toJSONString(match), MatchPostVo.class);
        vo.setWinner(holderScore > challengerScore ? MatchStatusCodeEnum.HOLDER_WIN_MATCH.getCode()
                : MatchStatusCodeEnum.CHALLENGER_WIN_MATCH.getCode());
        vo.setHolderScore(holderScore);
        vo.setChallengerScore(challengerScore);
        vo.setRanked(MatchStatusCodeEnum.MATCH_RANKED_STATUS.getCode());
        vo.setGamedTime(DateUtil.getCurrentDate(DateUtil.FORMAT_DATE_TIME));
        vo.setStatus(MatchStatusCodeEnum.MATCH_GAMED_MATCHING.getCode());
        return SearchApi.updateDocument(DataSetConstant.LD_GAME_MATCH_INFORMATION, JSON.toJSONString(vo), vo.getId());
    }

    @Override
    public String finishMatch(String matchId, int holderScore, int challengerScore) {
        log.info("finish match :" + matchId);
        HashMap<String, Object> match = SearchApi.searchById(DataSetConstant.GAME_MATCH_INFORMATION, matchId);
        if (match == null) {
            log.info("finish match   but not found match,then return " + matchId);
            return null;
        }
        log.info("finish match   ready to rank match " + matchId);
        iRankService.matchRank(matchId, holderScore, challengerScore);
        MatchPostVo vo = JSONObject.parseObject(JSONObject.toJSONString(match), MatchPostVo.class);
        vo.setWinner(holderScore > challengerScore ? MatchStatusCodeEnum.HOLDER_WIN_MATCH.getCode()
                : MatchStatusCodeEnum.CHALLENGER_WIN_MATCH.getCode());
        vo.setHolderScore(holderScore);
        vo.setChallengerScore(challengerScore);
        vo.setRanked(MatchStatusCodeEnum.MATCH_RANKED_STATUS.getCode());
        vo.setGamedTime(DateUtil.getCurrentDate(DateUtil.FORMAT_DATE_TIME));
        vo.setStatus(MatchStatusCodeEnum.MATCH_GAMED_MATCHING.getCode());
        log.info("finish match   updateDocument " + matchId);
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
    public Object getH2hOpponentList(String user, String opponent, Integer count) {


        return null;
    }



    @Override
    public Object getLdH2hOpponentCount(String user) {
        ArrayList<QueryBuilder> params = new ArrayList<QueryBuilder>();
        BoolQueryBuilder head2Head = new BoolQueryBuilder();

        head2Head.should(SearchApi.createSearchByFieldSource(MatchPostVo.HOLDER, user))
                .should(SearchApi.createSearchByFieldSource(MatchPostVo.CHALLENGER, user));

        QueryBuilder[] values = new QueryBuilder[8];
        params.add(head2Head);
        SearchResponse res = SearchApi.H2HOpponentAggs(DataSetConstant.LD_GAME_MATCH_INFORMATION, params.toArray(values));
        Terms t1 = res.getAggregations().get("holder");
        Terms t2 = res.getAggregations().get("challenger");
        Iterator<ParsedTerms.ParsedBucket> ti1 = (Iterator<ParsedTerms.ParsedBucket>) t1.getBuckets().iterator();
        Iterator<ParsedTerms.ParsedBucket> ti2 = (Iterator<ParsedTerms.ParsedBucket>) t2.getBuckets().iterator();
        Set<String> total = new HashSet<>();
        while (ti1.hasNext()) {
            ParsedTerms.ParsedBucket b = ti1.next();
            total.add(b.getKeyAsString());
        }
        while (ti2.hasNext()) {
            ParsedTerms.ParsedBucket b = ti2.next();
            total.add(b.getKeyAsString());
        }

        List<String> ids = new ArrayList<String>();
        total.forEach(t -> {
            if (!t.equals(user)) {
                ids.add(t);
            }
        });

        String[] idsArr = new String[ids.size()];

        LinkedList<Map<String, Object>> userInfos = SearchApi.getDocsByMultiIds(DataSetConstant.LD_USER_INFORMATION,
                ids.toArray(idsArr));

        LinkedList<Map<String, Object>> userRankInfos = SearchApi
                .getDocsByMultiIds(DataSetConstant.LD_USER_RANK_INFORMATION, ids.toArray(idsArr));

        ArrayList<Map<String, Object>> result = new ArrayList<Map<String, Object>>();

        userInfos.forEach(u -> {
            userRankInfos.forEach(r -> {
                if (r.get(RankInfoVo.OPENID).equals(u.get(UserVo.OPENID))) {
                    u.put(RankInfoVo.RANKTYPE0, r.get(RankInfoVo.RANKTYPE0));
                    u.put(RankInfoVo.RANKTYPE1, r.get(RankInfoVo.RANKTYPE1));
                    u.put(RankInfoVo.WINRATE, r.get(RankInfoVo.WINRATE));
                    u.put(RankInfoVo.POSITION, r.get(RankInfoVo.POSITION));
                    result.add(r);
                }

            });

        });

        return userInfos;
    }



    @Override
    public Object getH2hOpponentCount(String user) {
        ArrayList<QueryBuilder> params = new ArrayList<QueryBuilder>();
        BoolQueryBuilder head2Head = new BoolQueryBuilder();

        head2Head.should(SearchApi.createSearchByFieldSource(MatchPostVo.HOLDER, user))
                .should(SearchApi.createSearchByFieldSource(MatchPostVo.CHALLENGER, user));

        QueryBuilder[] values = new QueryBuilder[8];
        params.add(head2Head);
        SearchResponse res = SearchApi.H2HOpponentAggs(DataSetConstant.GAME_MATCH_INFORMATION, params.toArray(values));
        Terms t1 = res.getAggregations().get("holder");
        Terms t2 = res.getAggregations().get("challenger");
        Iterator<ParsedTerms.ParsedBucket> ti1 = (Iterator<ParsedTerms.ParsedBucket>) t1.getBuckets().iterator();
        Iterator<ParsedTerms.ParsedBucket> ti2 = (Iterator<ParsedTerms.ParsedBucket>) t2.getBuckets().iterator();
        Set<String> total = new HashSet<>();
        while (ti1.hasNext()) {
            ParsedTerms.ParsedBucket b = ti1.next();
            total.add(b.getKeyAsString());
        }
        while (ti2.hasNext()) {
            ParsedTerms.ParsedBucket b = ti2.next();
            total.add(b.getKeyAsString());
        }

        List<String> ids = new ArrayList<String>();
        total.forEach(t -> {
            if (!t.equals(user)) {
                ids.add(t);
            }
        });

        String[] idsArr = new String[ids.size()];

        LinkedList<Map<String, Object>> userInfos = SearchApi.getDocsByMultiIds(DataSetConstant.USER_INFORMATION,
                ids.toArray(idsArr));

        LinkedList<Map<String, Object>> userRankInfos = SearchApi
                .getDocsByMultiIds(DataSetConstant.USER_RANK_INFORMATION, ids.toArray(idsArr));

        ArrayList<Map<String, Object>> result = new ArrayList<Map<String, Object>>();

        userInfos.forEach(u -> {
            userRankInfos.forEach(r -> {
                if (r.get(RankInfoVo.OPENID).equals(u.get(UserVo.OPENID))) {
                    u.put(RankInfoVo.RANKTYPE0, r.get(RankInfoVo.RANKTYPE0));
                    u.put(RankInfoVo.RANKTYPE1, r.get(RankInfoVo.RANKTYPE1));
                    u.put(RankInfoVo.WINRATE, r.get(RankInfoVo.WINRATE));
                    u.put(RankInfoVo.POSITION, r.get(RankInfoVo.POSITION));
                    result.add(r);
                }

            });

        });

        return userInfos;
    }


    @Override
    public Object getLDH2hOpponentCount(String user) {
        ArrayList<QueryBuilder> params = new ArrayList<QueryBuilder>();
        BoolQueryBuilder head2Head = new BoolQueryBuilder();

        head2Head.should(SearchApi.createSearchByFieldSource(MatchPostVo.HOLDER, user))
                .should(SearchApi.createSearchByFieldSource(MatchPostVo.CHALLENGER, user));

        QueryBuilder[] values = new QueryBuilder[8];
        params.add(head2Head);
        SearchResponse res = SearchApi.H2HOpponentAggs(DataSetConstant.LD_GAME_MATCH_INFORMATION, params.toArray(values));
        Terms t1 = res.getAggregations().get("holder");
        Terms t2 = res.getAggregations().get("challenger");
        Iterator<ParsedTerms.ParsedBucket> ti1 = (Iterator<ParsedTerms.ParsedBucket>) t1.getBuckets().iterator();
        Iterator<ParsedTerms.ParsedBucket> ti2 = (Iterator<ParsedTerms.ParsedBucket>) t2.getBuckets().iterator();
        Set<String> total = new HashSet<>();
        while (ti1.hasNext()) {
            ParsedTerms.ParsedBucket b = ti1.next();
            total.add(b.getKeyAsString());
        }
        while (ti2.hasNext()) {
            ParsedTerms.ParsedBucket b = ti2.next();
            total.add(b.getKeyAsString());
        }

        List<String> ids = new ArrayList<String>();
        total.forEach(t -> {
            if (!t.equals(user)) {
                ids.add(t);
            }
        });

        String[] idsArr = new String[ids.size()];

        if(idsArr.length>0){
            LinkedList<Map<String, Object>> userInfos = SearchApi.getDocsByMultiIds(DataSetConstant.LD_USER_INFORMATION,
                    ids.toArray(idsArr));

            LinkedList<Map<String, Object>> userRankInfos = SearchApi
                    .getDocsByMultiIds(DataSetConstant.LD_USER_RANK_INFORMATION, ids.toArray(idsArr));

            ArrayList<Map<String, Object>> result = new ArrayList<Map<String, Object>>();

            userInfos.forEach(u -> {
                userRankInfos.forEach(r -> {
                    if (r.get(RankInfoVo.OPENID).equals(u.get(UserVo.OPENID))) {
                        u.put(RankInfoVo.RANKTYPE0, r.get(RankInfoVo.RANKTYPE0));
                        u.put(RankInfoVo.RANKTYPE1, r.get(RankInfoVo.RANKTYPE1));
                        u.put(RankInfoVo.WINRATE, r.get(RankInfoVo.WINRATE));
                        u.put(RankInfoVo.POSITION, r.get(RankInfoVo.POSITION));
                        result.add(r);
                    }

                });

            });
            return userInfos;
        }
        return null;
    }



    @Override
    public Object getLDMatchedCount(String user) {
        ArrayList<QueryBuilder> params = new ArrayList<QueryBuilder>();
        if (!StringUtil.isEmpty(user)) {
            params.add(SearchApi.createMultiFieldsWithSingleValue(user, MatchPostVo.HOLDER, MatchPostVo.CHALLENGER));
        }
        params.add(SearchApi.createSearchByFieldSource(MatchPostVo.STATUS,
                MatchStatusCodeEnum.MATCH_GAMED_MATCHING.getCode()));

        Map<String, SortOrder> sortPropertiesQueries = new HashMap<String, SortOrder>(16);
        sortPropertiesQueries.put(MatchPostVo.ORDERTIME, SortOrder.ASC);
        QueryBuilder[] values = new QueryBuilder[8];
        SearchResponse searchResponse = SearchApi.searchByQueryBuilder(DataSetConstant.LD_GAME_MATCH_INFORMATION,
                params.toArray(values));
        if (searchResponse != null) {
            return searchResponse.getHits().getTotalHits().value;
        }
        return 0;
    }



    @Override
    public Object getMatchedCount(String user) {
        ArrayList<QueryBuilder> params = new ArrayList<QueryBuilder>();
        if (!StringUtil.isEmpty(user)) {
            params.add(SearchApi.createMultiFieldsWithSingleValue(user, MatchPostVo.HOLDER, MatchPostVo.CHALLENGER));
        }

        // params.add(SearchApi.createNotSearchSource(MatchPostVo.STATUS,
        // MatchStatusCodeEnum.MATCH_MATCHING_STATUS.getCode()));
        params.add(SearchApi.createSearchByFieldSource(MatchPostVo.STATUS,
                MatchStatusCodeEnum.MATCH_GAMED_MATCHING.getCode()));

        Map<String, SortOrder> sortPropertiesQueries = new HashMap<String, SortOrder>(16);
        sortPropertiesQueries.put(MatchPostVo.ORDERTIME, SortOrder.ASC);
        QueryBuilder[] values = new QueryBuilder[8];
        SearchResponse searchResponse = SearchApi.searchByQueryBuilder(DataSetConstant.GAME_MATCH_INFORMATION,
                params.toArray(values));
        if (searchResponse != null) {
            return searchResponse.getHits().getTotalHits().value;
        }

        // iUserService.getUserInfo(openId);
        return 0;
    }


    @Override
    public Object getLDMatchedList(String user, Integer count) {

        ArrayList<QueryBuilder> params = new ArrayList<QueryBuilder>();
        if (!StringUtil.isEmpty(user)) {
            params.add(SearchApi.createMultiFieldsWithSingleValue(user, MatchPostVo.HOLDER, MatchPostVo.CHALLENGER));
        }


        params.add(SearchApi.createSearchByFieldSource(MatchPostVo.STATUS,
                MatchStatusCodeEnum.MATCH_GAMED_MATCHING.getCode()));

        Map<String, SortOrder> sortPropertiesQueries = new HashMap<String, SortOrder>(16);
        sortPropertiesQueries.put(MatchPostVo.ORDERTIME, SortOrder.DESC);
        QueryBuilder[] values = new QueryBuilder[8];
        List<HashMap<String, Object>> searchResponse = SearchApi.searchByMultiQueriesAndOrders(
                DataSetConstant.LD_GAME_MATCH_INFORMATION, sortPropertiesQueries, 0, count, params.toArray(values));
        if (searchResponse != null) {
            String[] idsArr = new String[searchResponse.size()];
            List<String> idsHolder = new ArrayList<String>();
            List<String> idsChallenger = new ArrayList<String>();

            searchResponse = (List<HashMap<String, Object>>) searchResponse.stream().map(match -> {

                idsHolder.add((String) match.get(MatchPostVo.HOLDER));
                idsChallenger.add((String) match.get(MatchPostVo.CHALLENGER));
                return match;
            }).collect(Collectors.toList());

            LinkedList<Map<String, Object>> userInfosHolder = SearchApi
                    .getDocsByMultiIds(DataSetConstant.LD_USER_INFORMATION, idsHolder.toArray(idsArr));
            LinkedList<Map<String, Object>> userRankInfosHolder = SearchApi
                    .getDocsByMultiIds(DataSetConstant.LD_USER_RANK_INFORMATION, idsHolder.toArray(idsArr));

            LinkedList<Map<String, Object>> userInfosChallenger = SearchApi
                    .getDocsByMultiIds(DataSetConstant.LD_USER_INFORMATION, idsChallenger.toArray(idsArr));
            LinkedList<Map<String, Object>> userRankInfosChallenger = SearchApi
                    .getDocsByMultiIds(DataSetConstant.LD_USER_RANK_INFORMATION, idsChallenger.toArray(idsArr));

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
        return searchResponse;

    }


    @Override
    public Object getMatchedList(String user, Integer count) {

        ArrayList<QueryBuilder> params = new ArrayList<QueryBuilder>();
        if (!StringUtil.isEmpty(user)) {
            params.add(SearchApi.createMultiFieldsWithSingleValue(user, MatchPostVo.HOLDER, MatchPostVo.CHALLENGER));
        }

        // params.add(SearchApi.createNotSearchSource(MatchPostVo.STATUS,
        // MatchStatusCodeEnum.MATCH_MATCHING_STATUS.getCode()));
        params.add(SearchApi.createSearchByFieldSource(MatchPostVo.STATUS,
                MatchStatusCodeEnum.MATCH_GAMED_MATCHING.getCode()));

        Map<String, SortOrder> sortPropertiesQueries = new HashMap<String, SortOrder>(16);
        sortPropertiesQueries.put(MatchPostVo.ORDERTIME, SortOrder.DESC);
        QueryBuilder[] values = new QueryBuilder[8];
        List<HashMap<String, Object>> searchResponse = SearchApi.searchByMultiQueriesAndOrders(
                DataSetConstant.GAME_MATCH_INFORMATION, sortPropertiesQueries, 0, count, params.toArray(values));
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
    public Object getLDH2hMatchedList(String user, String opponent, Integer count) {

        ArrayList<QueryBuilder> params = new ArrayList<QueryBuilder>();
        BoolQueryBuilder head2Head = new BoolQueryBuilder();

        // params.add(SearchApi.createSearchByFieldSource(user, MatchPostVo.HOLDER,
        // MatchPostVo.CHALLENGER));
        BoolQueryBuilder head1 = new BoolQueryBuilder();
        head1.must(SearchApi.createSearchByFieldSource(MatchPostVo.HOLDER, user))
                .must(SearchApi.createSearchByFieldSource(MatchPostVo.CHALLENGER, opponent));

        BoolQueryBuilder head2 = new BoolQueryBuilder();
        head2.must(SearchApi.createSearchByFieldSource(MatchPostVo.HOLDER, opponent))
                .must(SearchApi.createSearchByFieldSource(MatchPostVo.CHALLENGER, user));
        head2Head.should(head1).should(head2);

        params.add(head2Head);

        params.add(SearchApi.createSearchByFieldSource(MatchPostVo.STATUS,
                MatchStatusCodeEnum.MATCH_GAMED_MATCHING.getCode()));

        Map<String, SortOrder> sortPropertiesQueries = new HashMap<String, SortOrder>(16);
        sortPropertiesQueries.put(MatchPostVo.ORDERTIME, SortOrder.DESC);
        QueryBuilder[] values = new QueryBuilder[8];
        List<HashMap<String, Object>> searchResponse = SearchApi.searchByMultiQueriesAndOrders(
                DataSetConstant.LD_GAME_MATCH_INFORMATION, sortPropertiesQueries, 0, count, params.toArray(values));
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
                    .getDocsByMultiIds(DataSetConstant.LD_USER_INFORMATION, idsHolder.toArray(idsArr));
            LinkedList<Map<String, Object>> userRankInfosHolder = SearchApi
                    .getDocsByMultiIds(DataSetConstant.LD_USER_RANK_INFORMATION, idsHolder.toArray(idsArr));

            LinkedList<Map<String, Object>> userInfosChallenger = SearchApi
                    .getDocsByMultiIds(DataSetConstant.LD_USER_INFORMATION, idsChallenger.toArray(idsArr));
            LinkedList<Map<String, Object>> userRankInfosChallenger = SearchApi
                    .getDocsByMultiIds(DataSetConstant.LD_USER_RANK_INFORMATION, idsChallenger.toArray(idsArr));
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

        return searchResponse;
    }


    @Override
    public Object getH2hMatchedList(String user, String opponent, Integer count) {

        ArrayList<QueryBuilder> params = new ArrayList<QueryBuilder>();
        BoolQueryBuilder head2Head = new BoolQueryBuilder();

        // params.add(SearchApi.createSearchByFieldSource(user, MatchPostVo.HOLDER,
        // MatchPostVo.CHALLENGER));
        BoolQueryBuilder head1 = new BoolQueryBuilder();
        head1.must(SearchApi.createSearchByFieldSource(MatchPostVo.HOLDER, user))
                .must(SearchApi.createSearchByFieldSource(MatchPostVo.CHALLENGER, opponent));

        BoolQueryBuilder head2 = new BoolQueryBuilder();
        head2.must(SearchApi.createSearchByFieldSource(MatchPostVo.HOLDER, opponent))
                .must(SearchApi.createSearchByFieldSource(MatchPostVo.CHALLENGER, user));
        head2Head.should(head1).should(head2);

        params.add(head2Head);

        params.add(SearchApi.createSearchByFieldSource(MatchPostVo.STATUS,
                MatchStatusCodeEnum.MATCH_GAMED_MATCHING.getCode()));

        Map<String, SortOrder> sortPropertiesQueries = new HashMap<String, SortOrder>(16);
        sortPropertiesQueries.put(MatchPostVo.ORDERTIME, SortOrder.DESC);
        QueryBuilder[] values = new QueryBuilder[8];
        List<HashMap<String, Object>> searchResponse = SearchApi.searchByMultiQueriesAndOrders(
                DataSetConstant.GAME_MATCH_INFORMATION, sortPropertiesQueries, 0, count, params.toArray(values));
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
    public Object getDoubleMatchedList(String user, Integer count) {

        ArrayList<QueryBuilder> params = new ArrayList<QueryBuilder>();
        if (!StringUtil.isEmpty(user)) {
            params.add(SearchApi.createMultiFieldsWithSingleValue(user, DoubleMatchPostVo.HOLDER,
                    DoubleMatchPostVo.HOLDER2, DoubleMatchPostVo.CHALLENGER, DoubleMatchPostVo.CHALLENGER2));
        }

        params.add(SearchApi.createNotSearchSource(DoubleMatchPostVo.STATUS,
                MatchStatusCodeEnum.MATCH_MATCHING_STATUS.getCode()));
        params.add(SearchApi.createNotSearchSource(DoubleMatchPostVo.STATUS,
                MatchStatusCodeEnum.MATCH_GAMED_MATCHING.getCode()));

        Map<String, SortOrder> sortPropertiesQueries = new HashMap<String, SortOrder>(16);
        sortPropertiesQueries.put(DoubleMatchPostVo.ORDERTIME, SortOrder.ASC);
        QueryBuilder[] values = new QueryBuilder[8];
        List<HashMap<String, Object>> searchResponse = SearchApi.searchByMultiQueriesAndOrders(
                DataSetConstant.GAME_DOUBLE_MATCH_INFORMATION, sortPropertiesQueries, 0, 50, params.toArray(values));
        if (searchResponse != null) {
            String[] idsArr = new String[searchResponse.size()];
            List<String> idsHolder1 = new ArrayList<String>();
            List<String> idsChallenger1 = new ArrayList<String>();
            List<String> idsHolder2 = new ArrayList<String>();
            List<String> idsChallenger2 = new ArrayList<String>();

            searchResponse = (List<HashMap<String, Object>>) searchResponse.stream().map(match -> {
                idsHolder1.add((String) match.get(DoubleMatchPostVo.HOLDER));
                idsChallenger1.add((String) match.get(DoubleMatchPostVo.CHALLENGER));
                if (match.get(DoubleMatchPostVo.HOLDER2) != null) {

                    idsHolder2.add((String) match.get(DoubleMatchPostVo.HOLDER2));
                }
                if (match.get(DoubleMatchPostVo.CHALLENGER2) != null) {

                    idsChallenger2.add((String) match.get(DoubleMatchPostVo.CHALLENGER2));
                }
                return match;
            }).collect(Collectors.toList());
            System.out.println(idsHolder1);
            System.out.println(idsHolder2);
            System.out.println(idsChallenger1);
            System.out.println(idsChallenger2);
            if (idsHolder2.size() == 0) {
                idsHolder2.add("1");
            }
            if (idsChallenger2.size() == 0) {
                idsChallenger2.add("1");
            }
            LinkedList<Map<String, Object>> userInfosHolder1 = SearchApi
                    .getDocsByMultiIds(DataSetConstant.USER_INFORMATION, idsHolder1.toArray(idsArr));
            LinkedList<Map<String, Object>> userRankInfosHolder1 = SearchApi
                    .getDocsByMultiIds(DataSetConstant.USER_RANK_INFORMATION, idsHolder1.toArray(idsArr));

            LinkedList<Map<String, Object>> userInfosChallenger1 = SearchApi
                    .getDocsByMultiIds(DataSetConstant.USER_INFORMATION, idsChallenger1.toArray(idsArr));
            LinkedList<Map<String, Object>> userRankInfosChallenger1 = SearchApi
                    .getDocsByMultiIds(DataSetConstant.USER_RANK_INFORMATION, idsChallenger1.toArray(idsArr));

            LinkedList<Map<String, Object>> userInfosHolder2 = SearchApi
                    .getDocsByMultiIds(DataSetConstant.USER_INFORMATION, idsHolder2.toArray(idsArr));
            LinkedList<Map<String, Object>> userRankInfosHolder2 = SearchApi
                    .getDocsByMultiIds(DataSetConstant.USER_RANK_INFORMATION, idsHolder2.toArray(idsArr));

            LinkedList<Map<String, Object>> userInfosChallenger2 = SearchApi
                    .getDocsByMultiIds(DataSetConstant.USER_INFORMATION, idsChallenger2.toArray(idsArr));
            LinkedList<Map<String, Object>> userRankInfosChallenger2 = SearchApi
                    .getDocsByMultiIds(DataSetConstant.USER_RANK_INFORMATION, idsChallenger2.toArray(idsArr));

            searchResponse = (List<HashMap<String, Object>>) searchResponse.stream().map(match -> {

                List<Map<String, Object>> holder1 = userInfosHolder1.stream()
                        .filter(i -> i.get(RankInfoVo.OPENID).equals(match.get(DoubleMatchPostVo.HOLDER)))
                        .collect(Collectors.toList());

                List<Map<String, Object>> holderRank1 = userRankInfosHolder1.stream()
                        .filter(i -> i.get(RankInfoVo.OPENID).equals(match.get(DoubleMatchPostVo.HOLDER)))
                        .collect(Collectors.toList());

                match.put(DoubleMatchPostVo.HOLDERAVATOR, holder1.get(0).get(UserVo.AVATOR));
                match.put(DoubleMatchPostVo.HOLDERNAME, holder1.get(0).get(UserVo.NICKNAME));
                match.put(DoubleMatchPostVo.HOLDERRANKTYPE0, holderRank1.get(0).get(RankInfoVo.RANKTYPE0));

                List<Map<String, Object>> challenger1 = userInfosChallenger1.stream()
                        .filter(i -> i.get(RankInfoVo.OPENID).equals(match.get(DoubleMatchPostVo.CHALLENGER)))
                        .collect(Collectors.toList());

                List<Map<String, Object>> challengerRank1 = userRankInfosChallenger1.stream()
                        .filter(i -> i.get(RankInfoVo.OPENID).equals(match.get(DoubleMatchPostVo.CHALLENGER)))
                        .collect(Collectors.toList());

                match.put(DoubleMatchPostVo.CHALLENGERAVATOR, challenger1.get(0).get(UserVo.AVATOR));
                match.put(DoubleMatchPostVo.CHALLENGERNAME, challenger1.get(0).get(UserVo.NICKNAME));
                match.put(DoubleMatchPostVo.CHALLENGERRANKTYPE0, challengerRank1.get(0).get(RankInfoVo.RANKTYPE0));

                // challenger2
                if (userInfosHolder2 != null && userInfosHolder2.size() > 0) {
                    System.out.println(userInfosHolder2);
                    System.out.println(userInfosHolder2.stream());
                    if (userInfosHolder2 != null) {

                        List<Map<String, Object>> holder2 = userInfosHolder2.stream().filter(i -> {
                            System.out.println(i);
                            return i == null ? false
                                    : i.get(RankInfoVo.OPENID).equals(match.get(DoubleMatchPostVo.HOLDER2));
                        }).collect(Collectors.toList());

                        List<Map<String, Object>> holderRank2 = userRankInfosHolder2.stream()
                                .filter(i -> i == null ? false
                                        : i.get(RankInfoVo.OPENID).equals(match.get(DoubleMatchPostVo.HOLDER2)))
                                .collect(Collectors.toList());

                        if (holder2 != null && holder2.size() > 0) {

                            match.put(DoubleMatchPostVo.HOLDER2AVATOR, holder2.get(0).get(UserVo.AVATOR));
                            match.put(DoubleMatchPostVo.HOLDERNAME2, holder2.get(0).get(UserVo.NICKNAME));
                        }
                        if (holderRank2 != null && holderRank2.size() > 0) {
                            match.put(DoubleMatchPostVo.HOLDER2RANKTYPE0, holderRank2.get(0).get(RankInfoVo.RANKTYPE0));
                        }
                    }
                }

                if (userInfosChallenger2 != null && userInfosChallenger2.size() > 0) {
                    List<Map<String, Object>> challenger2 = userInfosChallenger2.stream()
                            .filter(i -> i == null ? false
                                    : i.get(RankInfoVo.OPENID).equals(match.get(DoubleMatchPostVo.CHALLENGER2)))
                            .collect(Collectors.toList());

                    List<Map<String, Object>> challengerRank2 = userRankInfosChallenger2.stream()
                            .filter(i -> i == null ? false
                                    : i.get(RankInfoVo.OPENID).equals(match.get(DoubleMatchPostVo.CHALLENGER2)))
                            .collect(Collectors.toList());

                    if (challenger2 != null && challenger2.size() > 0) {
                        match.put(DoubleMatchPostVo.CHALLENGER2AVATOR, challenger2.get(0).get(UserVo.AVATOR));
                        match.put(DoubleMatchPostVo.CHALLENGER2NAME, challenger2.get(0).get(UserVo.NICKNAME));
                    }
                    if (challengerRank2 != null && challengerRank2.size() > 0) {
                        match.put(DoubleMatchPostVo.CHALLENGER2RANKTYPE0,
                                challengerRank2.get(0).get(RankInfoVo.RANKTYPE0));
                    }
                }
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
                && !MatchStatusCodeEnum.MATCH_MATCHING_STATUS.getCode().equals(vo.getStatus())
                && !MatchStatusCodeEnum.MATCH_TYPE_RANDOM.getCode().equals(vo.getMatchType())) {
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
        // String finishId = null;
        MatchPostVo vo = JSONObject.parseObject(JSONObject.toJSONString(match), MatchPostVo.class);
        if (type == 0) {
            vo.setHolderAcknowledged(MatchStatusCodeEnum.USER_ACKNOWLADGED.getCode());
        } else if (type == 1) {
            vo.setChallengerAcknowledged(MatchStatusCodeEnum.USER_ACKNOWLADGED.getCode());
        } else {
            vo.setHolderAcknowledged(MatchStatusCodeEnum.USER_ACKNOWLADGED.getCode());
            vo.setChallengerAcknowledged(MatchStatusCodeEnum.USER_ACKNOWLADGED.getCode());
        }

        if (MatchStatusCodeEnum.USER_ACKNOWLADGED.getCode().equals(vo.getChallengerAcknowledged())
                && MatchStatusCodeEnum.USER_ACKNOWLADGED.getCode().equals(vo.getHolderAcknowledged())) {

            if (!vo.getStatus().equals(MatchStatusCodeEnum.MATCH_PLAYING_MATCHING.getCode())) {
                vo.setStatus(MatchStatusCodeEnum.MATCH_PLAYING_MATCHING.getCode());
                vo.setChallengerAcknowledged(MatchStatusCodeEnum.USER_UN_ACKNOWLADGED.getCode());
                vo.setHolderAcknowledged(MatchStatusCodeEnum.USER_UN_ACKNOWLADGED.getCode());
            } else {
                vo.setStatus(MatchStatusCodeEnum.MATCH_GAMED_MATCHING.getCode());
                finishMatch(matchId, vo.getHolderScore(), vo.getChallengerScore());
            }
        }

        String id = SearchApi.updateDocument(DataSetConstant.GAME_MATCH_INFORMATION, JSON.toJSONString(vo), matchId);
        if (TextUtils.isEmpty(id)) {
            throw new CustomException(ResultCodeEnum.CONFIRMED_MATCH_ERROR);
        }
        // if
        // (vo.getStatus().equals(MatchStatusCodeEnum.MATCH_PLAYING_MATCHING.getCode())
        // && TextUtils.isEmpty(finishId)) {
        // ctx.publishEvent(new MatchConfirmEvent(ctx, id));
        // }
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
        // String matchId = (String)
        // redis.get(StringUtil.combiningSpecifiedUserKey(user, "ranked"));
        // redis.del(StringUtil.combiningSpecifiedUserKey(user, "ranked"));
        // return getMatchInfos(matchId);
        return null;
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
        // String key = StringUtil.combiningSpecifiedUserKey(user, "ranked");
        // String matchId = (String) redis.get(key);
        // redis.del(key);
        // return getMatchInfos(matchId);
        return null;
    }

    @Override
    public LinkedList<HashMap<String, Object>> nearByCourt(String gps, Integer size) {
        return SearchApi.searchByLocation(DataSetConstant.COURT_INFORMATION, CourtVo.LOCATION, gps, "50", size);
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

    @Override
    public String deleteMatches(String id) {
        LinkedList<HashMap<String, Object>> session = SearchApi.searchByField(DataSetConstant.SESSION_INFORMATION,
                SessionVo.MATCHID, id, 1, 10);
        Optional.ofNullable(session).ifPresent(s -> {
            String sessionId = (String) s.getFirst().get(SessionVo.ID);
            SearchApi.deleteDocument(DataSetConstant.SESSION_INFORMATION, sessionId);
        });
        SearchApi.deleteDocument(DataSetConstant.GAME_MATCH_INFORMATION, id);
        return null;
    }

    @Override
    public String finishSlamMatch(String slamId, String matchId, Integer holderScore, Integer challengerScore) {

        SlamVo match = JSON.parseObject(JSON.toJSONString(SearchApi.searchById(SlamVo.SLAM_INFORMATION, slamId)),
                SlamVo.class);
        if (match == null) {
            return null;
        }

        iRankService.rankingSlamMatches(slamId, matchId, holderScore, challengerScore);

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
    public String postSlamMatch(String holder, String courtName, String challenger, String courtGPS) {
        String matchId = postMatches(null, holder, challenger, MatchStatusCodeEnum.MATCH_TYPE_RANDOM.getCode(),
                MatchStatusCodeEnum.NON_CLUB_MATCH.getCode(), DateUtil.getCurrentDate(DateUtil.FORMAT_DATE_TIME),
                courtName, courtGPS);
        // attachedMatchSession(matchId, holder, challenger);
        return matchId;
    }



    @Override
    public LinkedList<HashMap<String, Object>> getStartMatch() {
        LinkedList<HashMap<String, Object>> searchResponse = SearchApi.searchByField(
                DataSetConstant.GAME_MATCH_INFORMATION, MatchPostVo.STATUS,
                String.valueOf(MatchStatusCodeEnum.MATCH_PLAYING_MATCHING.getCode()), 0, 50);

        if (searchResponse != null) {
            String[] idsArr = new String[searchResponse.size()];
            List<String> idsHolder = new ArrayList<String>();
            List<String> idsChallenger = new ArrayList<String>();

            searchResponse = (LinkedList<HashMap<String, Object>>) searchResponse.stream().map(match -> {
                // HashMap<String, Object> holder = iUserService.getUserInfo((String)
                // match.get(MatchPostVo.HOLDER));
                idsHolder.add((String) match.get(MatchPostVo.HOLDER));
                idsChallenger.add((String) match.get(MatchPostVo.CHALLENGER));
                return match;
            }).collect(Collectors.toCollection(LinkedList::new));

            LinkedList<Map<String, Object>> userInfosHolder = SearchApi
                    .getDocsByMultiIds(DataSetConstant.USER_INFORMATION, idsHolder.toArray(idsArr));
            LinkedList<Map<String, Object>> userRankInfosHolder = SearchApi
                    .getDocsByMultiIds(DataSetConstant.USER_RANK_INFORMATION, idsHolder.toArray(idsArr));

            LinkedList<Map<String, Object>> userInfosChallenger = SearchApi
                    .getDocsByMultiIds(DataSetConstant.USER_INFORMATION, idsChallenger.toArray(idsArr));
            LinkedList<Map<String, Object>> userRankInfosChallenger = SearchApi
                    .getDocsByMultiIds(DataSetConstant.USER_RANK_INFORMATION, idsChallenger.toArray(idsArr));

            searchResponse = (LinkedList<HashMap<String, Object>>) searchResponse.stream().map(match -> {

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
            }).collect(Collectors.toCollection(LinkedList::new));
        }
        return searchResponse;
    }

    @Override
    public Object getDoubleMatchInfos(String matchId) {
        if (TextUtils.isEmpty(matchId)) {
            return null;
        }
        HashMap<String, Object> searchResponse = SearchApi.searchById(DataSetConstant.GAME_DOUBLE_MATCH_INFORMATION,
                matchId);

        Optional.ofNullable(searchResponse).ifPresent(i -> {
            String[] idsArr = new String[2];
            List<String> ids = new ArrayList<String>();

            ids.add((String) searchResponse.get(DoubleMatchPostVo.HOLDER));
            ids.add((String) searchResponse.get(DoubleMatchPostVo.HOLDER2));
            ids.add((String) searchResponse.get(DoubleMatchPostVo.CHALLENGER));
            ids.add((String) searchResponse.get(DoubleMatchPostVo.CHALLENGER2));

            LinkedList<Map<String, Object>> userInfos = SearchApi.getDocsByMultiIds(DataSetConstant.USER_INFORMATION,
                    ids.toArray(idsArr));
            LinkedList<Map<String, Object>> userRankInfos = SearchApi
                    .getDocsByMultiIds(DataSetConstant.USER_RANK_INFORMATION, ids.toArray(idsArr));

            List<Map<String, Object>> holder1 = userInfos.stream()
                    .filter(g -> g.get(RankInfoVo.OPENID).equals(searchResponse.get(DoubleMatchPostVo.HOLDER)))
                    .collect(Collectors.toList());

            List<Map<String, Object>> holder2 = userInfos.stream()
                    .filter(g -> g.get(RankInfoVo.OPENID).equals(searchResponse.get(DoubleMatchPostVo.HOLDER2)))
                    .collect(Collectors.toList());

            List<Map<String, Object>> holderRank1 = userRankInfos.stream()
                    .filter(g -> g.get(RankInfoVo.OPENID).equals(searchResponse.get(DoubleMatchPostVo.HOLDER)))
                    .collect(Collectors.toList());

            List<Map<String, Object>> holderRank2 = userRankInfos.stream()
                    .filter(g -> g.get(RankInfoVo.OPENID).equals(searchResponse.get(DoubleMatchPostVo.HOLDER2)))
                    .collect(Collectors.toList());

            searchResponse.put(DoubleMatchPostVo.HOLDERAVATOR, holder1.get(0).get(UserVo.AVATOR));
            searchResponse.put(DoubleMatchPostVo.HOLDERNAME, holder1.get(0).get(UserVo.NICKNAME));
            searchResponse.put(DoubleMatchPostVo.HOLDERRANKTYPE0, holderRank1.get(0).get(RankInfoVo.RANKTYPE0));

            searchResponse.put(DoubleMatchPostVo.HOLDER2AVATOR, holder2.get(0).get(UserVo.AVATOR));
            searchResponse.put(DoubleMatchPostVo.HOLDERNAME2, holder2.get(0).get(UserVo.NICKNAME));
            searchResponse.put(DoubleMatchPostVo.HOLDER2RANKTYPE0, holderRank2.get(0).get(RankInfoVo.RANKTYPE0));

            List<Map<String, Object>> challenger1 = userInfos.stream()
                    .filter(g -> g.get(RankInfoVo.OPENID).equals(searchResponse.get(DoubleMatchPostVo.CHALLENGER)))
                    .collect(Collectors.toList());
            List<Map<String, Object>> challengerRank1 = userRankInfos.stream()
                    .filter(g -> g.get(RankInfoVo.OPENID).equals(searchResponse.get(DoubleMatchPostVo.CHALLENGER)))
                    .collect(Collectors.toList());

            List<Map<String, Object>> challenger2 = userInfos.stream()
                    .filter(g -> g.get(RankInfoVo.OPENID).equals(searchResponse.get(DoubleMatchPostVo.CHALLENGER2)))
                    .collect(Collectors.toList());
            List<Map<String, Object>> challengerRank2 = userRankInfos.stream()
                    .filter(g -> g.get(RankInfoVo.OPENID).equals(searchResponse.get(DoubleMatchPostVo.CHALLENGER2)))
                    .collect(Collectors.toList());

            searchResponse.put(DoubleMatchPostVo.CHALLENGERAVATOR, challenger1.get(0).get(UserVo.AVATOR));
            searchResponse.put(DoubleMatchPostVo.CHALLENGERNAME, challenger1.get(0).get(UserVo.NICKNAME));
            searchResponse.put(DoubleMatchPostVo.CHALLENGERRANKTYPE0, challengerRank1.get(0).get(RankInfoVo.RANKTYPE0));

            searchResponse.put(DoubleMatchPostVo.CHALLENGERAVATOR, challenger2.get(0).get(UserVo.AVATOR));
            searchResponse.put(DoubleMatchPostVo.CHALLENGERNAME, challenger2.get(0).get(UserVo.NICKNAME));
            searchResponse.put(DoubleMatchPostVo.CHALLENGERRANKTYPE0, challengerRank2.get(0).get(RankInfoVo.RANKTYPE0));

        });

        return searchResponse;
    }

    @Override
    public Object updateDoubleMatchInfos(String matchId, String courtName, String courtGPS, String holder2,
            String challenger2) {
        HashMap<String, Object> match = SearchApi.searchById(DataSetConstant.GAME_DOUBLE_MATCH_INFORMATION, matchId);
        if (match == null) {
            return null;
        }

        DoubleMatchPostVo vo = JSONObject.parseObject(JSONObject.toJSONString(match), DoubleMatchPostVo.class);
        if (!MatchStatusCodeEnum.MATCH_ACKNOWLEDGED_MATCHING.getCode().equals(vo.getStatus())
                && !MatchStatusCodeEnum.MATCH_MATCHING_STATUS.getCode().equals(vo.getStatus())
                && !MatchStatusCodeEnum.MATCH_TYPE_RANDOM.getCode().equals(vo.getMatchType())) {
            return null;
        }

        if (!TextUtils.isEmpty(holder2)) {
            vo.setHolder2(holder2);
        }

        if (!TextUtils.isEmpty(challenger2)) {
            vo.setChallenger2(challenger2);
        }

        if (!TextUtils.isEmpty(courtName)) {
            vo.setCourtName(courtName);
        }
        if (!TextUtils.isEmpty(courtGPS)) {
            vo.setCourtGPS(courtGPS);
        }
        vo.setChallengerAcknowledged(MatchStatusCodeEnum.USER_UN_ACKNOWLADGED.getCode());
        vo.setHolderAcknowledged(MatchStatusCodeEnum.USER_UN_ACKNOWLADGED.getCode());
        return SearchApi.updateDocument(DataSetConstant.GAME_DOUBLE_MATCH_INFORMATION, JSON.toJSONString(vo), matchId);

    }

    @Override
    public Object updateDoubleMatchScore(String matchId, Integer holderScore, Integer challengerScore) {
        HashMap<String, Object> match = SearchApi.searchById(DataSetConstant.GAME_DOUBLE_MATCH_INFORMATION, matchId);
        if (match == null) {
            return null;
        }
        DoubleMatchPostVo vo = JSONObject.parseObject(JSONObject.toJSONString(match), DoubleMatchPostVo.class);
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
        return SearchApi.updateDocument(DataSetConstant.GAME_DOUBLE_MATCH_INFORMATION, JSON.toJSONString(vo), matchId);
    }

    @Override
    public Object confirmDoubleMatch(String matchId, Integer type) {
        HashMap<String, Object> match = SearchApi.searchById(DataSetConstant.GAME_DOUBLE_MATCH_INFORMATION, matchId);
        if (match == null) {
            return null;
        }
        String finishId = null;
        DoubleMatchPostVo vo = JSONObject.parseObject(JSONObject.toJSONString(match), DoubleMatchPostVo.class);
        // if (type == 0) {
        // vo.setHolderAcknowledged(MatchStatusCodeEnum.USER_ACKNOWLADGED.getCode());
        // } else if (type == 1) {
        // vo.setChallengerAcknowledged(MatchStatusCodeEnum.USER_ACKNOWLADGED.getCode());
        // } else {
        vo.setHolderAcknowledged(MatchStatusCodeEnum.USER_ACKNOWLADGED.getCode());
        vo.setChallengerAcknowledged(MatchStatusCodeEnum.USER_ACKNOWLADGED.getCode());
        // }

        if (MatchStatusCodeEnum.USER_ACKNOWLADGED.getCode().equals(vo.getChallengerAcknowledged())
                && MatchStatusCodeEnum.USER_ACKNOWLADGED.getCode().equals(vo.getHolderAcknowledged())) {

            // if
            // (!vo.getStatus().equals(MatchStatusCodeEnum.MATCH_PLAYING_MATCHING.getCode()))
            // {
            // vo.setStatus(MatchStatusCodeEnum.MATCH_PLAYING_MATCHING.getCode());
            // vo.setChallengerAcknowledged(MatchStatusCodeEnum.USER_UN_ACKNOWLADGED.getCode());
            // vo.setHolderAcknowledged(MatchStatusCodeEnum.USER_UN_ACKNOWLADGED.getCode());
            // } else {
            vo.setStatus(MatchStatusCodeEnum.MATCH_GAMED_MATCHING.getCode());
            finishId = finishDoubleMatch(matchId, vo.getHolderScore(), vo.getChallengerScore());
            // }
        }

        String id = SearchApi.updateDocument(DataSetConstant.GAME_DOUBLE_MATCH_INFORMATION, JSON.toJSONString(vo),
                matchId);
        if (TextUtils.isEmpty(id)) {
            throw new CustomException(ResultCodeEnum.CONFIRMED_MATCH_ERROR);
        }
        // if
        // (vo.getStatus().equals(MatchStatusCodeEnum.MATCH_PLAYING_MATCHING.getCode())
        // && TextUtils.isEmpty(finishId)) {
        // ctx.publishEvent(new MatchConfirmEvent(ctx, id));
        // }
        return id;
    }

    @Override
    public String finishDoubleMatch(String matchId, int holderScore, int challengerScore) {

        HashMap<String, Object> match = SearchApi.searchById(DataSetConstant.GAME_DOUBLE_MATCH_INFORMATION, matchId);
        if (match == null) {
            return null;
        }
        iRankService.doubleMatchRank(matchId, holderScore, challengerScore);
        DoubleMatchPostVo vo = JSONObject.parseObject(JSONObject.toJSONString(match), DoubleMatchPostVo.class);
        vo.setWinner(holderScore > challengerScore ? MatchStatusCodeEnum.HOLDER_WIN_MATCH.getCode()
                : MatchStatusCodeEnum.CHALLENGER_WIN_MATCH.getCode());
        vo.setHolderScore(holderScore);
        vo.setChallengerScore(challengerScore);
        vo.setRanked(MatchStatusCodeEnum.MATCH_RANKED_STATUS.getCode());
        vo.setGamedTime(DateUtil.getCurrentDate(DateUtil.FORMAT_DATE_TIME));
        vo.setStatus(MatchStatusCodeEnum.MATCH_GAMED_MATCHING.getCode());
        return SearchApi.updateDocument(DataSetConstant.GAME_DOUBLE_MATCH_INFORMATION, JSON.toJSONString(vo),
                vo.getId());
    }

    @Override
    public Object playingDoubleMatchInfo(String user) {
        ArrayList<QueryBuilder> params = new ArrayList<QueryBuilder>();
        if (!StringUtil.isEmpty(user)) {
            params.add(SearchApi.createMultiFieldsWithSingleValue(user, DoubleMatchPostVo.HOLDER,
                    DoubleMatchPostVo.CHALLENGER, DoubleMatchPostVo.HOLDER2, DoubleMatchPostVo.CHALLENGER2));
        }
        params.add(SearchApi.createSearchByFieldSource(MatchPostVo.STATUS,
                MatchStatusCodeEnum.MATCH_PLAYING_MATCHING.getCode()));
        Map<String, SortOrder> sortPropertiesQueries = new HashMap<String, SortOrder>(16);
        sortPropertiesQueries.put(MatchPostVo.ORDERTIME, SortOrder.ASC);
        QueryBuilder[] values = new QueryBuilder[8];
        LinkedList<HashMap<String, Object>> searchResponse = SearchApi.searchByMultiQueriesAndOrders(
                DataSetConstant.GAME_DOUBLE_MATCH_INFORMATION, sortPropertiesQueries, 0, 1, params.toArray(values));
        return searchResponse == null ? null : searchResponse.get(0);
    }

    @Override
    public Object rankedDoubleMatchInfo(String user) {
        // String matchId = (String)
        // redis.get(StringUtil.combiningSpecifiedUserKey(user, "ranked"));
        // redis.del(StringUtil.combiningSpecifiedUserKey(user, "ranked"));
        // return getDoubleMatchInfos(matchId);
        return null;
    }

    @Override
    public Object lastDoubleMatchResult(String user) {
        // String key = StringUtil.combiningSpecifiedUserKey(user, "ranked");
        // String matchId = (String) redis.get(key);
        // redis.del(key);
        // return getDoubleMatchInfos(matchId);
        return null;
    }
}
