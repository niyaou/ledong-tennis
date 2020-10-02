package ledong.wxapp.strategy.impl.rank;

import java.util.Arrays;
import java.util.Map;

import com.alibaba.fastjson.JSONObject;

import org.apache.log4j.Logger;

import VO.DoubleMatchPostVo;
import VO.MatchPostVo;
import VO.RankInfoVo;
import ledong.wxapp.constant.DataSetConstant;
import ledong.wxapp.search.SearchApi;
import ledong.wxapp.strategy.RankingStrategy;

public class DoublePondRanking extends RankingStrategy {
    private static Logger logger = Logger.getLogger(DoublePondRanking.class);
    @Override
    public int[] ranking(String matchId, int holderScore, int challengerScor) {
        int[] scores = new int[4];
        int scoreChanged = 30;

        Map<String, Object> match = SearchApi.searchById(DataSetConstant.GAME_DOUBLE_MATCH_INFORMATION, matchId);
        DoubleMatchPostVo vo = JSONObject.parseObject(JSONObject.toJSONString(match), DoubleMatchPostVo.class);

        RankInfoVo holder = getUserRank(vo.getHolder());
        RankInfoVo challenger = getUserRank(vo.getChallenger());
        RankInfoVo holder2 = getUserRank(vo.getHolder2());
        RankInfoVo challenger2 = getUserRank(vo.getChallenger2());

        scores[0] = holderScore > challengerScor
                ? (holder.getPoolRemain() >= scoreChanged ? scoreChanged : (holder.getPoolRemain() + 5))
                : 0;
        scores[1] = holderScore > challengerScor
                ? (holder2.getPoolRemain() >= scoreChanged ? scoreChanged : (holder2.getPoolRemain() + 5))
                : 0;
        scores[2] = holderScore < challengerScor
                ? (challenger.getPoolRemain() >= scoreChanged ? scoreChanged : (challenger.getPoolRemain() + 5))
                : 0;
        scores[3] = holderScore < challengerScor
                ? (challenger2.getPoolRemain() >= scoreChanged ? scoreChanged : (challenger2.getPoolRemain() + 5))
                : 0;

        return scores;
    }

}
