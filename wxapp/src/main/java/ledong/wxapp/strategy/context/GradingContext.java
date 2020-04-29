package ledong.wxapp.strategy.context;

import VO.RankInfoVo;
import ledong.wxapp.strategy.GradingStrategy;

public class GradingContext {
    private GradingStrategy ranking;

    public GradingContext(GradingStrategy matching) {
        this.ranking = matching;
    }

    public RankInfoVo rankMatch(RankInfoVo userRanking) {
        return ranking.ranking(userRanking);
    }
}
