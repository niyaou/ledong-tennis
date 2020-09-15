package ledong.wxapp.strategy.context;

import VO.DoubleMatchRequestVo;
import ledong.wxapp.strategy.DoubleMatchStrategy;

public class DoubleMatchContext {
    private DoubleMatchStrategy matching;

    public DoubleMatchContext(DoubleMatchStrategy matching) {
        this.matching = matching;
    }

    public String getMatchId(DoubleMatchRequestVo vo) {
        return matching.matchingGame(vo);
    }
}
