package ledong.wxapp.service.impl;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import javax.annotation.Resource;

import org.apache.http.util.TextUtils;
import org.apache.log4j.Logger;
import org.elasticsearch.index.query.BoolQueryBuilder;
import org.elasticsearch.index.query.QueryBuilder;
import org.elasticsearch.index.query.QueryBuilders;
import org.elasticsearch.search.aggregations.AggregationBuilder;
import org.elasticsearch.search.aggregations.AggregationBuilders;
import org.elasticsearch.search.builder.SearchSourceBuilder;
import org.elasticsearch.search.sort.SortOrder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.stereotype.Service;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;

import VO.DoubleMatchPostVo;
import VO.DoubleWinRateEvent;
import VO.MatchPostVo;
import VO.RankInfoVo;
import VO.ScoreLogVo;
import VO.SlamWinRateEvent;
import VO.UserVo;
import VO.WinRateEvent;
import ledong.wxapp.constant.DataSetConstant;
import ledong.wxapp.constant.enums.MatchStatusCodeEnum;
import ledong.wxapp.search.SearchApi;
import ledong.wxapp.service.IMatchService;
import ledong.wxapp.service.IRankService;
import ledong.wxapp.service.IUserService;
import ledong.wxapp.strategy.RankingStrategy;
import ledong.wxapp.strategy.context.GradingContext;
import ledong.wxapp.strategy.context.RankingContext;
import ledong.wxapp.strategy.impl.rank.ConsecutiveRanking;
import ledong.wxapp.strategy.impl.rank.DoubleGradeRanking;
import ledong.wxapp.strategy.impl.rank.DoublePondRanking;
import ledong.wxapp.strategy.impl.rank.GradeRanking;
import ledong.wxapp.strategy.impl.rank.PondRanking;
import ledong.wxapp.strategy.impl.rank.VictoryRanking;
import ledong.wxapp.utils.StringUtil;

@Service
public class RankServiceImpl implements IRankService {
    private static Logger logger = Logger.getLogger(RankServiceImpl.class);
    // @Autowired
    // private RedisUtil redis;
    @Autowired
    private IUserService iUserService;
    @Autowired
    private IMatchService iMatchService;
    @Resource
    private ApplicationContext ctx;

    @Override
    public String matchRank(String matchId, int holderScore, int challengerScor) {
        int[] scores = new int[2];
        int[] tempScore = new int[2];
        Map<String, Object> match = SearchApi.searchById(DataSetConstant.GAME_MATCH_INFORMATION, matchId);
        MatchPostVo vo = JSONObject.parseObject(JSONObject.toJSONString(match), MatchPostVo.class);

        RankInfoVo holder = getUserRank(vo.getHolder());
        RankInfoVo challenger = getUserRank(vo.getChallenger());
        int scoreChanged = 0;
        RankingContext context = new RankingContext(new VictoryRanking());
        scores = context.rankMatch(matchId, holderScore, challengerScor);

        context = new RankingContext(new ConsecutiveRanking());
        tempScore = context.rankMatch(matchId, holderScore, challengerScor);

        scores[0] += tempScore[0];
        scores[1] += tempScore[1];

        // context = new RankingContext(new PondRanking());
        // tempScore = context.rankMatch(matchId, holderScore, challengerScor);
        // scores[0] += tempScore[0];
        // scores[1] += tempScore[1];

        holder.setScore(holder.getScore() + scores[0]);
        challenger.setScore(challenger.getScore() + scores[1]);

        GradingContext gContext = new GradingContext(new GradeRanking());

        holder = gContext.rankMatch(holder);
        challenger = gContext.rankMatch(challenger);

//        if (holder.getPoolRemain() >= tempScore[0]) {
//            holder.setPoolRemain(holder.getPoolRemain() - tempScore[0]);
//        } else {
//            holder.setPoolRemain(0);
//        }
//
//        if (challenger.getPoolRemain() >= tempScore[1]) {
//            challenger.setPoolRemain(challenger.getPoolRemain() - tempScore[1]);
//        } else {
//            challenger.setPoolRemain(0);
//        }
        HashMap<String, Object> holderVo = iUserService.getUserInfo(holder.getOpenId());
        HashMap<String, Object> challengerVo = iUserService.getUserInfo(challenger.getOpenId());

        updateRankInfo(holder);
        scoreChangeLog(holder.getOpenId(), scores[0],"与"+challengerVo.get(UserVo.NICKNAME)+"比赛得分");
        updateRankInfo(challenger);
        scoreChangeLog(challenger.getOpenId(), scores[1],"与"+holderVo.get(UserVo.NICKNAME)+"比赛得分");
        ctx.publishEvent(new WinRateEvent(ctx, holder));
        ctx.publishEvent(new WinRateEvent(ctx, challenger));
        updateUserPosition();
        // redis.set(StringUtil.combiningSpecifiedUserKey(holder.getOpenId(), "ranked"),
        // matchId, 60 * 60 * 24 * 7);
        // redis.set(StringUtil.combiningSpecifiedUserKey(challenger.getOpenId(),
        // "ranked"), matchId, 60 * 60 * 24 * 7);
        return String.valueOf(scoreChanged);
    }

    @Override
    public RankInfoVo getUserRank(String userId) {
        return RankingStrategy.getUserRank(userId);
    }

    @Override
    public String updateRankInfo(RankInfoVo vo) {
        return RankingStrategy.updateRankInfo(vo);
    }

    @Override
    public String updateUserTags(String userId, String tag) {
        RankInfoVo user = RankingStrategy.getUserRank(userId);
        String tags = user.getPolygen();
        for (int i = 0; i < tag.split(",").length; i++)
            if (!tags.contains(tag.split(",")[i])) {
                tags = tags + "," + tag.split(",")[i];
            }
        user.setPolygen(tags);
        return updateRankInfo(user);
    }

    @Override
    public Object getRankingList(String grade) {
        List<HashMap<String, Object>> users = SearchApi.searchByFieldSorted(DataSetConstant.USER_RANK_INFORMATION,
                RankInfoVo.RANKTYPE0, grade, RankInfoVo.SCORE, SortOrder.DESC, 0, 50);
        if (users != null) {
            String[] idsArr = new String[users.size()];
            List<String> ids = new ArrayList<String>();
            users = users.stream().map(match -> {
                ids.add((String) match.get(RankInfoVo.OPENID));
                return match;
            }).collect(Collectors.toList());

            List<Map<String, Object>> userInfos = SearchApi.getDocsByMultiIds(DataSetConstant.USER_INFORMATION,
                    ids.toArray(idsArr));

            users = users.stream().map(match -> {
                List<Map<String, Object>> holder = userInfos.stream()
                        .filter(i -> i.get(RankInfoVo.OPENID).equals(match.get(UserVo.OPENID)))
                        .collect(Collectors.toList());

                match.put(MatchPostVo.HOLDERAVATOR, holder.get(0).get(UserVo.AVATOR));
                match.put(MatchPostVo.HOLDERNAME, holder.get(0).get(UserVo.NICKNAME));
                match.put(MatchPostVo.COURTNAME, iMatchService.commonCourt((String) holder.get(0).get(UserVo.OPENID))
                        .get(MatchPostVo.COURTNAME));
                return match;
            }).collect(Collectors.toList());

        }

        return users;
    }

    @Override
    public Object getDoubleRankingList(String grade) {
        List<HashMap<String, Object>> users = SearchApi.searchByFieldSorted(DataSetConstant.USER_RANK_INFORMATION,
                RankInfoVo.DOUBLERANKTYPE0, grade, RankInfoVo.DOUBLESCORE, SortOrder.DESC, 0, 50);
        if (users != null) {
            String[] idsArr = new String[users.size()];
            List<String> ids = new ArrayList<String>();
            users = users.stream().map(match -> {
                ids.add((String) match.get(RankInfoVo.OPENID));
                return match;
            }).collect(Collectors.toList());

            List<Map<String, Object>> userInfos = SearchApi.getDocsByMultiIds(DataSetConstant.USER_INFORMATION,
                    ids.toArray(idsArr));

            users = users.stream().map(match -> {
                List<Map<String, Object>> holder = userInfos.stream()
                        .filter(i -> i.get(RankInfoVo.OPENID).equals(match.get(UserVo.OPENID)))
                        .collect(Collectors.toList());

                // System.out.println(holder.get(0));
                // match.put(RankInfoVo.DOUBLERANKTYPE0,
                // holder.get(0).get(RankInfoVo.DOUBLERANKTYPE0));
                // match.put(RankInfoVo.DOUBLEWINRATE,
                // holder.get(0).get(RankInfoVo.DOUBLEWINRATE));
                // match.put(RankInfoVo.DOUBLEPOSITION,
                // holder.get(0).get(RankInfoVo.DOUBLEPOSITION));
                match.put(MatchPostVo.HOLDERAVATOR, holder.get(0).get(UserVo.AVATOR));
                match.put(MatchPostVo.HOLDERNAME, holder.get(0).get(UserVo.NICKNAME));
                match.put(MatchPostVo.COURTNAME, iMatchService.commonCourt((String) holder.get(0).get(UserVo.OPENID))
                        .get(MatchPostVo.COURTNAME));
                return match;
            }).collect(Collectors.toList());

        }

        return users;
    }

    @Override
    public String createRankInfo(String userId) {
        RankInfoVo vo = new RankInfoVo();
        vo.setOpenId(userId);
        GradingContext gContext = new GradingContext(new GradeRanking());
        vo = gContext.rankMatch(vo);
        gContext = new GradingContext(new DoubleGradeRanking());
        vo = gContext.rankMatch(vo);
        return RankingStrategy.createRankInfo(vo);
    }

    @Override
    public Double updateWinRate(String userId) {
        SearchSourceBuilder searchSourceBuilder = new SearchSourceBuilder();
        BoolQueryBuilder user = new BoolQueryBuilder();
        user.should(QueryBuilders.termQuery(MatchPostVo.HOLDER, userId))
                .should(QueryBuilders.termQuery(MatchPostVo.CHALLENGER, userId));
        BoolQueryBuilder match = new BoolQueryBuilder();
        match.must(QueryBuilders.termQuery(MatchPostVo.STATUS, MatchStatusCodeEnum.MATCH_GAMED_MATCHING.getCode()))
                .must(user);

        BoolQueryBuilder win = new BoolQueryBuilder();

        win.should(new BoolQueryBuilder()
                .must(QueryBuilders.termQuery(MatchPostVo.WINNER, MatchStatusCodeEnum.HOLDER_WIN_MATCH.getCode()))
                .must(QueryBuilders.termQuery(MatchPostVo.HOLDER, userId)))
                .should(new BoolQueryBuilder()
                        .must(QueryBuilders.termQuery(MatchPostVo.WINNER,
                                MatchStatusCodeEnum.CHALLENGER_WIN_MATCH.getCode()))
                        .must(QueryBuilders.termQuery(MatchPostVo.CHALLENGER, userId)));
        AggregationBuilder b = AggregationBuilders.filter("winrate", win);
        searchSourceBuilder.query(match);
        searchSourceBuilder.size(5000);
        searchSourceBuilder.aggregation(b);
        return SearchApi.winRateAggregate(DataSetConstant.GAME_MATCH_INFORMATION, searchSourceBuilder);
    }

    @Override
    public Integer getUserPositionInRankList(String userId) {
        Integer rankPosition = 0;
        List<HashMap<String, Object>> users = SearchApi.searchByField(DataSetConstant.USER_RANK_INFORMATION,
                RankInfoVo.OPENID, userId, null, null);
        if (users != null) {
            SearchSourceBuilder searchSourceBuilder = new SearchSourceBuilder();
            QueryBuilder range = SearchApi.createSearchByFieldRangeGtSource(RankInfoVo.SCORE,
                    String.valueOf(users.get(0).get(RankInfoVo.SCORE)));
            searchSourceBuilder.query(range);
            searchSourceBuilder.size(500);
            rankPosition = SearchApi.totalRawResponse(searchSourceBuilder, DataSetConstant.USER_RANK_INFORMATION);
        }
        return rankPosition == null ? 1 : (rankPosition + 1);
    }

    @Override
    public String rankingSlamMatches(String slamId, String matchId, Integer holderScore, Integer challengerScore) {

        Map<String, Object> match = SearchApi.searchById(DataSetConstant.GAME_MATCH_INFORMATION, matchId);
        MatchPostVo vo = JSONObject.parseObject(JSONObject.toJSONString(match), MatchPostVo.class);
        RankInfoVo holder = getUserRank(vo.getHolder());
        RankInfoVo challenger = getUserRank(vo.getChallenger());

        matchRanked(holder, challenger, matchId, holderScore, challengerScore);
        updateRankInfo(holder);
        updateRankInfo(challenger);
        ctx.publishEvent(new SlamWinRateEvent(ctx, holder));
        ctx.publishEvent(new SlamWinRateEvent(ctx, challenger));
        // redis.set(StringUtil.combiningSpecifiedUserKey(holder.getOpenId(), "ranked"),
        // matchId, 60 * 60 * 24 * 7);
        // redis.set(StringUtil.combiningSpecifiedUserKey(challenger.getOpenId(),
        // "ranked"), matchId, 60 * 60 * 24 * 7);
        return null;
    }

    private void matchRanked(RankInfoVo holder, RankInfoVo challenger, String matchId, Integer holderScore,
            Integer challengerScore) {
        int[] scores = new int[2];
        int[] tempScore = new int[2];
        RankingContext context = new RankingContext(new VictoryRanking());
        scores = context.rankMatch(matchId, holderScore, challengerScore);

        context = new RankingContext(new ConsecutiveRanking());
        tempScore = context.rankMatch(matchId, holderScore, challengerScore);

        scores[0] += tempScore[0];
        scores[1] += tempScore[1];
        context = new RankingContext(new PondRanking());
        tempScore = context.rankMatch(matchId, holderScore, challengerScore);
        scores[0] += tempScore[0];
        scores[1] += tempScore[1];

        holder.setSlamScore(holder.getSlamScore() + scores[0]);
        challenger.setSlamScore(challenger.getSlamScore() + scores[1]);
        GradingContext gContext = new GradingContext(new GradeRanking());
        holder = gContext.rankMatch(holder);
        challenger = gContext.rankMatch(challenger);
    }

    @Override
    public Double updateSlamWinRate(String userId) {
        SearchSourceBuilder searchSourceBuilder = new SearchSourceBuilder();
        BoolQueryBuilder user = new BoolQueryBuilder();
        user.should(QueryBuilders.termQuery(MatchPostVo.HOLDER, userId))
                .should(QueryBuilders.termQuery(MatchPostVo.CHALLENGER, userId));
        BoolQueryBuilder match = new BoolQueryBuilder();
        match.must(QueryBuilders.termQuery(MatchPostVo.STATUS, MatchStatusCodeEnum.MATCH_GAMED_MATCHING.getCode()))
                .must(user)
                .must(QueryBuilders.termQuery(MatchPostVo.CLUBMATCH, MatchStatusCodeEnum.SLAM_MATCH.getCode()));

        BoolQueryBuilder win = new BoolQueryBuilder();

        win.should(new BoolQueryBuilder()
                .must(QueryBuilders.termQuery(MatchPostVo.WINNER, MatchStatusCodeEnum.HOLDER_WIN_MATCH.getCode()))
                .must(QueryBuilders.termQuery(MatchPostVo.HOLDER, userId)))
                .should(new BoolQueryBuilder()
                        .must(QueryBuilders.termQuery(MatchPostVo.WINNER,
                                MatchStatusCodeEnum.CHALLENGER_WIN_MATCH.getCode()))
                        .must(QueryBuilders.termQuery(MatchPostVo.CHALLENGER, userId)));
        AggregationBuilder b = AggregationBuilders.filter("winrate", win);
        searchSourceBuilder.query(match);
        searchSourceBuilder.aggregation(b);
        return SearchApi.winRateAggregate(DataSetConstant.GAME_MATCH_INFORMATION, searchSourceBuilder);
    }

    @Override
    public Object getRankingList(Integer count) {
        Long start=System.currentTimeMillis();
        HashMap<String, HashMap<String, Object>> users = SearchApi.searchByFieldSortedInMap(DataSetConstant.USER_RANK_INFORMATION, null,
                null, RankInfoVo.SCORE, SortOrder.DESC, 0, count);
        Long step1=System.currentTimeMillis();
        logger.info("step1"+(step1-start) +"       total"+(step1-start));
        List< HashMap<String, Object>> result=new ArrayList<>();
        if (users != null) {
            String[] idsArr = new String[users.size()];
            List<String> ids = new ArrayList<String>();
//            users = users.stream().map(match -> {
//                ids.add((String) match.get(RankInfoVo.OPENID));
//                return match;
//            }).collect(Collectors.toList());
            for (String key : users.keySet()){
                ids.add(key);
            }

            Long step2=System.currentTimeMillis();
            logger.info("step2"+(step2-step1) +"       total"+(step2-start));
            HashMap<String, HashMap<String, Object>> userInfos = SearchApi.getDocsByMultiIdsWithMap(DataSetConstant.USER_INFORMATION,
                    UserVo.OPENID,ids.toArray(idsArr));
            Long step3=System.currentTimeMillis();
            logger.info("step3"+(step3-step2) +"       total"+(step3-start));
            long total =0;
            for (String key : users.keySet()){
                Long for1=System.currentTimeMillis();
                HashMap<String, Object> u= users.get(key);
               HashMap<String, Object> info= userInfos.get(key);
               u.putAll(info);
//               u.put(UserVo.CREATETIME,info.get(UserVo.CREATETIME));
//               u.put(MatchPostVo.HOLDERAVATOR,info.get(UserVo.AVATOR));
//               u.put(MatchPostVo.HOLDERNAME, info.get(UserVo.NICKNAME));
//               u.put(MatchPostVo.COURTNAME, iMatchService.commonCourt((String)info.get(UserVo.OPENID))
//                                .get(MatchPostVo.COURTNAME)) ;
                Long for2=System.currentTimeMillis();
                result.add(u);
                total++;
                logger.info("for loop--"+total+"--"+(for2-for1) );

            }


//            users.forEach(u->{
//
//                userInfos.forEach(i->{
//                    if(i.get(RankInfoVo.OPENID).equals(u.get(UserVo.OPENID))){
//                        u.put(UserVo.CREATETIME,i.get(UserVo.CREATETIME));
//                        u.put(MatchPostVo.HOLDERAVATOR, i.get(UserVo.AVATOR));
//                        u.put(MatchPostVo.HOLDERNAME, i.get(UserVo.NICKNAME));
//                        u.put(MatchPostVo.COURTNAME, iMatchService.commonCourt((String)i.get(UserVo.OPENID))
//                                .get(MatchPostVo.COURTNAME)) ;
//                    }
//                });
//            });

//            users = users.stream().map(match -> {
//                List<Map<String, Object>> holder = userInfos.stream()
//                        .filter(i -> i.get(RankInfoVo.OPENID).equals(match.get(UserVo.OPENID)))
//                        .collect(Collectors.toList());
//                match.put(UserVo.CREATETIME, holder.get(0).get(UserVo.CREATETIME));
//                match.put(MatchPostVo.HOLDERAVATOR, holder.get(0).get(UserVo.AVATOR));
//                match.put(MatchPostVo.HOLDERNAME, holder.get(0).get(UserVo.NICKNAME));
//                match.put(MatchPostVo.COURTNAME, iMatchService.commonCourt((String) holder.get(0).get(UserVo.OPENID))
//                        .get(MatchPostVo.COURTNAME));
//                return match;
//            }).sorted(Comparator.comparing(UserVo::comparingByTime).reversed()).collect(Collectors.toList());
            Long step4=System.currentTimeMillis();
            logger.info("step4"+(step4-step3) +"       total"+(step4-start));
        }

        return result;
    }

    @Override
    public Long getTotalUser() {
        return SearchApi.indexCount(DataSetConstant.USER_INFORMATION);
    }

    @Override
    public String updateScoreByMaster(String openId, Integer score, String description) {
        RankInfoVo holder = getUserRank(openId);
        holder.setScore(score);
//        logger.info(JSON.toJSONString(holder));
        GradingContext gContext = new GradingContext(new GradeRanking());
        holder = gContext.rankMatch(holder);
        updateRankInfo(holder);
        scoreChangeLog(openId,score,description);
        return holder.getOpenId();
    }

    @Override
    public String scoreChangeLog(String openId, Integer score, String description) {
        ScoreLogVo log = new ScoreLogVo();
        log.setScore(score);
        log.setOpenId(openId);
        log.setDescription(description);
        return RankingStrategy.logCreate(log);
    }

    @Override
    public Object getScoreLog(String openId) {
        LinkedList<HashMap<String, Object>> logs = SearchApi.searchByFieldSorted(ScoreLogVo.SCORE_CHANGED_LOG,
                ScoreLogVo.OPENID, openId,ScoreLogVo.RANKINGTIME, SortOrder.DESC, 0, 1000);
        return logs;
    }

    @Override
    public String updateUserPosition() {
        LinkedList<HashMap<String, Object>> users = SearchApi.searchByFieldSorted(DataSetConstant.USER_RANK_INFORMATION,
                null, null, RankInfoVo.SCORE, SortOrder.DESC, 0, 1000);
        int[] position = { 0 };
        LinkedList<RankInfoVo> vos = new LinkedList<RankInfoVo>();
        GradingContext gContext = new GradingContext(new GradeRanking());
        users.forEach(u -> {
            position[0] = position[0] + 1;
            u.put(RankInfoVo.POSITION, position[0]);
            RankInfoVo rank = JSON.parseObject(JSON.toJSONString(u), RankInfoVo.class);
            rank = gContext.rankMatch(rank);
            vos.add(rank);
        });
        RankingStrategy.bulkUpdateRankInfo(vos);
        return null;
    }

    /**
     * 
     * @return
     */
    public String updateDoubleUserPosition() {

        LinkedList<HashMap<String, Object>> users = SearchApi.searchByFieldSorted(DataSetConstant.USER_RANK_INFORMATION,
                null, null, RankInfoVo.DOUBLESCORE, SortOrder.DESC, 0, 200);
        int[] position = { 0 };
        LinkedList<RankInfoVo> vos = new LinkedList<RankInfoVo>();
        GradingContext gContext = new GradingContext(new DoubleGradeRanking());
        users.forEach(u -> {
            position[0] = position[0] + 1;
            u.put(RankInfoVo.POSITION, position[0]);
            RankInfoVo rank = JSON.parseObject(JSON.toJSONString(u), RankInfoVo.class);
            rank = gContext.rankMatch(rank);
            vos.add(rank);
        });
        RankingStrategy.bulkUpdateRankInfo(vos);
        return null;
    }

    @Override
    public String doubleMatchRank(String matchId, int holderScore, int challengerScore) {
        int[] scores = new int[4];
        int[] tempScore = new int[4];
        Map<String, Object> match = SearchApi.searchById(DataSetConstant.GAME_DOUBLE_MATCH_INFORMATION, matchId);
        DoubleMatchPostVo vo = JSONObject.parseObject(JSONObject.toJSONString(match), DoubleMatchPostVo.class);
        System.out.println(JSONObject.toJSONString(match));
        RankInfoVo holder = getUserRank(vo.getHolder());

        RankInfoVo holder2 = null;
        if (!TextUtils.isEmpty(vo.getHolder2())) {

            holder2 = getUserRank(vo.getHolder2());
        }
        RankInfoVo challenger = getUserRank(vo.getChallenger());
        RankInfoVo challenger2 = null;
        if (!TextUtils.isEmpty(vo.getChallenger2())) {
            challenger2 = getUserRank(vo.getChallenger2());
        }
        int scoreChanged = 0;
        RankingContext context = new RankingContext(new VictoryRanking());

        int[] baseScores = context.rankMatch(matchId, holderScore, challengerScore);
        scores[0] = baseScores[0];
        scores[1] = baseScores[0];
        scores[2] = baseScores[1];
        scores[3] = baseScores[1];
        // context = new RankingContext(new ConsecutiveRanking());
        // tempScore = context.rankMatch(matchId, holderScore, challengerScor);

        // scores[0] += tempScore[0];
        // scores[1] += tempScore[1];

        context = new RankingContext(new DoublePondRanking());

        tempScore = context.rankMatch(matchId, holderScore, challengerScore);
        scores[0] += tempScore[0];
        scores[1] += tempScore[1];
        scores[2] += tempScore[2];
        scores[3] += tempScore[3];

        GradingContext gContext = new GradingContext(new DoubleGradeRanking());

        holder.setDoubleScore(holder.getDoubleScore() + scores[0]);
        if (holder2 != null) {

            holder2.setDoubleScore(holder2.getDoubleScore() + scores[1]);
        }
        challenger.setDoubleScore(challenger.getDoubleScore() + scores[2]);
        if (challenger2 != null) {
            challenger2.setDoubleScore(challenger2.getDoubleScore() + scores[3]);
        }

        holder = gContext.rankMatch(holder);
        if (holder2 != null) {
            holder2 = gContext.rankMatch(holder2);
            if (holder2.getPoolRemain() >= scores[0]) {
                holder2.setPoolRemain(holder2.getPoolRemain() - scores[0]);
            } else {
                holder2.setPoolRemain(0);
            }
        }
        challenger = gContext.rankMatch(challenger);
        if (challenger2 != null) {
            challenger2 = gContext.rankMatch(challenger2);
            if (challenger2.getPoolRemain() >= scores[1]) {
                challenger2.setPoolRemain(challenger2.getPoolRemain() - scores[1]);
            } else {
                challenger2.setPoolRemain(0);
            }
        }

        if (holder.getPoolRemain() >= scores[0]) {
            holder.setPoolRemain(holder.getPoolRemain() - scores[0]);
        } else {
            holder.setPoolRemain(0);
        }

        if (challenger.getPoolRemain() >= scores[1]) {
            challenger.setPoolRemain(challenger.getPoolRemain() - scores[1]);
        } else {
            challenger.setPoolRemain(0);
        }

        if (holder2 != null) {
            updateRankInfo(holder2);
            ctx.publishEvent(new DoubleWinRateEvent(ctx, holder2));
            // redis.set(StringUtil.combiningSpecifiedUserKey(holder2.getOpenId(),
            // "ranked"), matchId, 60 * 60 * 24 * 7);
        }
        if (challenger2 != null) {
            updateRankInfo(challenger2);
            ctx.publishEvent(new DoubleWinRateEvent(ctx, challenger2));
            // redis.set(StringUtil.combiningSpecifiedUserKey(challenger2.getOpenId(),
            // "ranked"), matchId,
            // 60 * 60 * 24 * 7);
        }

        updateRankInfo(holder);

        updateRankInfo(challenger);

        ctx.publishEvent(new DoubleWinRateEvent(ctx, holder));

        ctx.publishEvent(new DoubleWinRateEvent(ctx, challenger));

        updateDoubleUserPosition();
        // redis.set(StringUtil.combiningSpecifiedUserKey(holder.getOpenId(), "ranked"),
        // matchId, 60 * 60 * 24 * 7);
        // redis.set(StringUtil.combiningSpecifiedUserKey(challenger.getOpenId(),
        // "ranked"), matchId, 60 * 60 * 24 * 7);
        return String.valueOf(scoreChanged);
    }

    @Override
    public Double updateDoubleWinRate(String userId) {
        SearchSourceBuilder searchSourceBuilder = new SearchSourceBuilder();
        BoolQueryBuilder user = new BoolQueryBuilder();
        user.should(QueryBuilders.termQuery(DoubleMatchPostVo.HOLDER, userId))
                .should(QueryBuilders.termQuery(DoubleMatchPostVo.HOLDER2, userId))
                .should(QueryBuilders.termQuery(DoubleMatchPostVo.CHALLENGER, userId))
                .should(QueryBuilders.termQuery(DoubleMatchPostVo.CHALLENGER2, userId));
        BoolQueryBuilder match = new BoolQueryBuilder();
        match.must(
                QueryBuilders.termQuery(DoubleMatchPostVo.STATUS, MatchStatusCodeEnum.MATCH_GAMED_MATCHING.getCode()))
                .must(user);

        BoolQueryBuilder win = new BoolQueryBuilder();

        win.should(new BoolQueryBuilder()
                .must(QueryBuilders.termQuery(DoubleMatchPostVo.WINNER, MatchStatusCodeEnum.HOLDER_WIN_MATCH.getCode()))
                .must(QueryBuilders.termQuery(DoubleMatchPostVo.HOLDER, userId)))
                .should(new BoolQueryBuilder()
                        .must(QueryBuilders.termQuery(DoubleMatchPostVo.WINNER,
                                MatchStatusCodeEnum.HOLDER_WIN_MATCH.getCode()))
                        .must(QueryBuilders.termQuery(DoubleMatchPostVo.HOLDER2, userId)))
                .should(new BoolQueryBuilder()
                        .must(QueryBuilders.termQuery(DoubleMatchPostVo.WINNER,
                                MatchStatusCodeEnum.CHALLENGER_WIN_MATCH.getCode()))
                        .must(QueryBuilders.termQuery(DoubleMatchPostVo.CHALLENGER, userId)))
                .should(new BoolQueryBuilder()
                        .must(QueryBuilders.termQuery(DoubleMatchPostVo.WINNER,
                                MatchStatusCodeEnum.CHALLENGER_WIN_MATCH.getCode()))
                        .must(QueryBuilders.termQuery(DoubleMatchPostVo.CHALLENGER2, userId)));
        AggregationBuilder b = AggregationBuilders.filter("winrate", win);
        searchSourceBuilder.query(match);
        searchSourceBuilder.size(5000);
        searchSourceBuilder.aggregation(b);
        return SearchApi.winRateAggregate(DataSetConstant.GAME_DOUBLE_MATCH_INFORMATION, searchSourceBuilder);
    }
}
