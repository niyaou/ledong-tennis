package ledong.wxapp.strategy.context;

import ledong.wxapp.strategy.RankingStrategy;

public class RankingContext {
    private RankingStrategy ranking;

    public RankingContext(RankingStrategy matching) {
        this.ranking = matching;
    }

    public int[] rankMatch(String matchId, int holderScore, int challengerScor) {
        return ranking.ranking(matchId, holderScore, challengerScor);
    }
}
