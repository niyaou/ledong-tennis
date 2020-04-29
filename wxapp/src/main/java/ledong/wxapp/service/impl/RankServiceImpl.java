package ledong.wxapp.service.impl;

import java.util.Map;

import org.elasticsearch.search.sort.SortOrder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.alibaba.fastjson.JSONObject;

import VO.MatchPostVo;
import VO.RankInfoVo;
import ledong.wxapp.constant.DataSetConstant;
import ledong.wxapp.redis.RedisUtil;
import ledong.wxapp.search.SearchApi;
import ledong.wxapp.service.IRankService;
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
        redis.set(StringUtil.combiningSpecifiedUserKey(holder.getOpenId(), "ranked"), matchId, 60 * 60 * 24 * 7);
        redis.set(StringUtil.combiningSpecifiedUserKey(challenger.getOpenId(), "ranked"), matchId, 60 * 60 * 24 * 7);
        return String.valueOf(scoreChanged);
    }

    @Override
    public RankInfoVo getUserRank(String userId) {
        // Map<String, Object> match =
        // SearchApi.searchById(DataSetConstant.USER_RANK_INFORMATION, userId);
        // RankInfoVo vo = JSONObject.parseObject(JSONObject.toJSONString(match),
        // RankInfoVo.class);
        return RankingStrategy.getUserRank(userId);
    }

    @Override
    public String updateRankInfo(RankInfoVo vo) {
        return RankingStrategy.updateRankInfo(vo);
    }

    @Override
    public Object getRankingList() {
        return SearchApi.searchByFieldSorted(DataSetConstant.USER_RANK_INFORMATION, RankInfoVo.SCORE, SortOrder.DESC,
                500);
    }

    @Override
    public String createRankInfo(String userId) {
        RankInfoVo vo = new RankInfoVo();
        vo.setOpenId(userId);
        GradingContext gContext = new GradingContext(new GradeRanking());
        vo = gContext.rankMatch(vo);
        return RankingStrategy.createRankInfo(vo);
    }

}
