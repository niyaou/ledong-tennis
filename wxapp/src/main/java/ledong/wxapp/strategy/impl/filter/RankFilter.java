package ledong.wxapp.strategy.impl.filter;

import ledong.wxapp.strategy.MatchFilter;

public class RankFilter extends MatchFilter {

    @Override
    public boolean filtering(Object holderScore, Object challengerScore) {
        return Math.abs( (Integer)holderScore - (Integer) challengerScore) < 3000;
    }

}
