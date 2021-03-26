package ledong.wxapp.strategy.impl.match;

import java.util.Map;

import VO.DoubleMatchRequestVo;
import VO.MatchRequestVo;
import ledong.wxapp.constant.enums.MatchStatusCodeEnum;
import ledong.wxapp.redis.RedisUtil;
import ledong.wxapp.service.IRankService;
import ledong.wxapp.strategy.DoubleMatchStrategy;
import ledong.wxapp.strategy.MatchFilter;
import ledong.wxapp.strategy.MatchStrategy;
import ledong.wxapp.strategy.impl.filter.LocationFilter;
import ledong.wxapp.strategy.impl.filter.RankFilter;
import ledong.wxapp.utils.StringUtil;

public class DoublePickRandomMatch extends DoubleMatchStrategy {

    // private RedisUtil redis;
    private IRankService rankService;

    public DoublePickRandomMatch(IRankService rankService) {
        // this.redis = redis;
        this.rankService = rankService;
    }

    @Override
    public String matchingGame(DoubleMatchRequestVo vo) {

        // String user = vo.getUserName();
        // redis.hdel(DoubleMatchRequestVo.DOUBLEMATCHREQUESTFROM,
        // StringUtil.combiningSpecifiedUserKey(user, null));
        // // child key
        // // expired
        // // time specification
        // // should add future by
        // // reddision

        // Map<Object, Object> map =
        // redis.hmget(DoubleMatchRequestVo.DOUBLEMATCHREQUESTFROM);
        // if (map.size() != 0) {
        // for (Map.Entry<Object, Object> entry : map.entrySet()) {
        // if (redis.lockKey((String) entry.getKey(), 30)) {

        // DoubleMatchRequestVo otherRequest = (DoubleMatchRequestVo) entry.getValue();

        // MatchFilter filter = new LocationFilter();

        // filter = new RankFilter();
        // if (!filter.filtering(rankService.getUserRank(user).getScore(),
        // rankService.getUserRank(otherRequest.getUserName()).getScore())) {
        // continue;
        // }

        // otherRequest = otherRequest == null ? otherRequest : otherRequest;
        // String matchId = postDoubleMatches(null, otherRequest.getUserName(),null,
        // user,null,
        // MatchStatusCodeEnum.MATCH_TYPE_RANDOM.getCode(),
        // MatchStatusCodeEnum.NON_CLUB_MATCH.getCode(), null, null, null);
        // redis.set(StringUtil.combiningSpecifiedUserKey(otherRequest.getUserName(),
        // "receive"), matchId, 7);
        // redis = null;
        // return matchId;
        // }

        // }
        // }
        // redis = null;
        // rankService = null;
        return null;
    }

}
