package ledong.wxapp.service.impl;

import org.elasticsearch.index.query.BoolQueryBuilder;
import org.elasticsearch.index.query.QueryBuilder;
import org.elasticsearch.index.query.QueryBuilders;
import org.elasticsearch.search.aggregations.AggregationBuilder;
import org.elasticsearch.search.aggregations.AggregationBuilders;
import org.elasticsearch.search.builder.SearchSourceBuilder;
import org.elasticsearch.search.sort.SortOrder;
import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.context.event.ApplicationContextEvent;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import javax.annotation.Resource;

import java.util.ArrayList;
import java.util.HashMap;
import com.alibaba.fastjson.JSONObject;

import VO.MatchPostVo;
import VO.RankInfoVo;
import VO.UserVo;
import VO.WinRateEvent;
import ledong.wxapp.constant.DataSetConstant;
import ledong.wxapp.constant.enums.GradeCodeEnum;
import ledong.wxapp.constant.enums.MatchStatusCodeEnum;
import ledong.wxapp.redis.RedisUtil;
import ledong.wxapp.search.SearchApi;
import ledong.wxapp.service.IRankService;
import ledong.wxapp.service.IUserService;
import ledong.wxapp.strategy.RankingStrategy;
import ledong.wxapp.strategy.context.GradingContext;
import ledong.wxapp.strategy.context.RankingContext;
import ledong.wxapp.strategy.impl.rank.ConsecutiveRanking;
import ledong.wxapp.strategy.impl.rank.GradeRanking;
import ledong.wxapp.strategy.impl.rank.PondRanking;
import ledong.wxapp.strategy.impl.rank.VictoryRanking;
import ledong.wxapp.utils.StringUtil;

@Service
public class RankServiceImpl implements IRankService {

    @Autowired
    private RedisUtil redis;
    @Autowired
    private IUserService iUserService;
    @Resource
    private ApplicationContext ctx;

    @Override
    public String matchRank(String matchId, int holderScore, int challengerScor) {
        int[] scores = new int[2];
        int[] tempScore = new int[2];
        System.out.println("-----ranking match :" + matchId);
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

        context = new RankingContext(new PondRanking());

        tempScore = context.rankMatch(matchId, holderScore, challengerScor);
        scores[0] += tempScore[0];
        scores[1] += tempScore[1];

        holder.setPoolRemain(holder.getPoolRemain() + scores[0]);
        challenger.setPoolRemain(challenger.getPoolRemain() + scores[1]);
        holder.setScore(holder.getScore() + scores[0]);
        challenger.setScore(challenger.getScore() + scores[1]);

        GradingContext gContext = new GradingContext(new GradeRanking());

        holder = gContext.rankMatch(holder);
        challenger = gContext.rankMatch(challenger);

        updateRankInfo(holder);
        updateRankInfo(challenger);

        ctx.publishEvent(new WinRateEvent(ctx, holder));
        ctx.publishEvent(new WinRateEvent(ctx, challenger));

        redis.set(StringUtil.combiningSpecifiedUserKey(holder.getOpenId(), "ranked"), matchId, 60 * 60 * 24 * 7);
        redis.set(StringUtil.combiningSpecifiedUserKey(challenger.getOpenId(), "ranked"), matchId, 60 * 60 * 24 * 7);
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
    public Object getRankingList(String grade) {

        List<HashMap<String, Object>> users = SearchApi.searchByFieldSorted(DataSetConstant.USER_RANK_INFORMATION,
                RankInfoVo.RANKTYPE0, grade, RankInfoVo.SCORE, SortOrder.DESC, 0, 50);
        if (users != null) {
            String[] idsArr = new String[users.size()];
            List<String> ids = new ArrayList<String>();
            users = (List<HashMap<String, Object>>) users.stream().map(match -> {
                ids.add((String) match.get(RankInfoVo.OPENID));
                return match;
            }).collect(Collectors.toList());

            LinkedList<Map<String, Object>> userInfos = SearchApi.getDocsByMultiIds(DataSetConstant.USER_INFORMATION,
                    ids.toArray(idsArr));

            users = (List<HashMap<String, Object>>) users.stream().map(match -> {
                List<Map<String, Object>> holder = userInfos.stream()
                        .filter(i -> i.get(RankInfoVo.OPENID).equals(match.get(UserVo.OPENID)))
                        .collect(Collectors.toList());
                // HashMap<String, Object> holder = iUserService.getUserInfo((String)
                // match.get(RankInfoVo.OPENID));
                match.put(MatchPostVo.HOLDERAVATOR, holder.get(0).get(UserVo.AVATOR));
                match.put(MatchPostVo.HOLDERNAME, holder.get(0).get(UserVo.NICKNAME));
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
        searchSourceBuilder.aggregation(b);
        return SearchApi.winRateAggregate(DataSetConstant.GAME_MATCH_INFORMATION, searchSourceBuilder);
    }

    @Override
    public Integer getUserPositionInRankList(String userId) {
        Integer rankPosition = 0;
        List<HashMap<String, Object>> users = SearchApi.searchByField(DataSetConstant.USER_RANK_INFORMATION,
                RankInfoVo.OPENID, userId, null, null);
        System.out.print(users);
        if (users != null) {
            SearchSourceBuilder searchSourceBuilder = new SearchSourceBuilder();
            QueryBuilder range = SearchApi.createSearchByFieldRangeGtSource(RankInfoVo.SCORE,
                    String.valueOf(users.get(0).get(RankInfoVo.SCORE)));
            searchSourceBuilder.query(range);
            System.out.print(searchSourceBuilder.toString());
            rankPosition = SearchApi.totalRawResponse(searchSourceBuilder, DataSetConstant.USER_RANK_INFORMATION);
        }
        System.out.print(rankPosition);
        return rankPosition == null ? 1 : (rankPosition + 1);
    }


}
