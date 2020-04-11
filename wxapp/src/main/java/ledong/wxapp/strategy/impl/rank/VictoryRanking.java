package ledong.wxapp.strategy.impl.rank;

import ledong.wxapp.strategy.RankingStrategy;

public class VictoryRanking extends RankingStrategy {

    @Override
    public int[] ranking(String matchId, int holderScore, int challengerScor) {
        int[] scores = new int[2];
        int scoreChanged = 30;

        scores[0] = holderScore > challengerScor ? scoreChanged : -scoreChanged;
        scores[1] = holderScore < challengerScor ? scoreChanged : -scoreChanged;
        return scores;
    }

}
