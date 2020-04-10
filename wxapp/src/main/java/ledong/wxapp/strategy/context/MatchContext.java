package ledong.wxapp.strategy.context;

import VO.MatchRequestVo;
import ledong.wxapp.strategy.MatchStrategy;

public class MatchContext {
    private MatchStrategy matching;

    public MatchContext(MatchStrategy matching) {
        this.matching = matching;
    }

    public String getMatchId(MatchRequestVo vo) {
        return matching.matchingGame(vo);
    }
}
