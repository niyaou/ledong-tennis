package ledong.wxapp.strategy.impl;

import ledong.wxapp.strategy.MatchFilter;

public class RankFilter extends MatchFilter {

    @Override
    public boolean filtering(Object holderScore, Object challengerScore) {
        return Math.abs(Integer.parseInt((String) holderScore) - Integer.parseInt((String) challengerScore)) < 3000;
    }

}
