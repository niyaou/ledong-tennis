package ledong.wxapp.strategy.impl.match;

import java.util.Map;

import VO.MatchRequestVo;
import ledong.wxapp.constant.enums.MatchStatusCodeEnum;
import ledong.wxapp.redis.RedisUtil;
import ledong.wxapp.service.IRankService;
import ledong.wxapp.strategy.MatchFilter;
import ledong.wxapp.strategy.MatchStrategy;
import ledong.wxapp.strategy.impl.filter.LocationFilter;
import ledong.wxapp.strategy.impl.filter.RankFilter;
import ledong.wxapp.utils.StringUtil;

public class PickRandomMatch extends MatchStrategy {

    // private RedisUtil redis;
    private IRankService rankService;

    public PickRandomMatch(IRankService rankService) {
        // this.redis = redis;
        this.rankService = rankService;
    }

    @Override
    public String matchingGame(MatchRequestVo vo) {

        // String user = vo.getUserName();
        // String courtGps = vo.getLocation();
        // redis.hdel(MatchRequestVo.MATCHREQUESTFROM,
        // StringUtil.combiningSpecifiedUserKey(user, null));
        // // child key
        // // expired
        // // time specification
        // // should add future by
        // // reddision

        // Map<Object, Object> map = redis.hmget(MatchRequestVo.MATCHREQUESTFROM);
        // if (map.size() != 0) {
        // for (Map.Entry<Object, Object> entry : map.entrySet()) {
        // if (redis.lockKey((String) entry.getKey(), 30)) {

        // MatchRequestVo otherRequest = (MatchRequestVo) entry.getValue();

        // MatchFilter filter = new LocationFilter();
        // if (!filter.filtering(courtGps, otherRequest.getLocation())) {
        // continue;
        // }

        // filter = new RankFilter();
        // if (!filter.filtering(rankService.getUserRank(user).getScore(),
        // rankService.getUserRank(otherRequest.getUserName()).getScore())) {
        // continue;
        // }

        // otherRequest = otherRequest == null ? otherRequest : otherRequest;
        // String matchId = postMatches(null, otherRequest.getUserName(), user,
        // MatchStatusCodeEnum.MATCH_TYPE_RANDOM.getCode(),
        // MatchStatusCodeEnum.NON_CLUB_MATCH.getCode(), null, null, courtGps);
        // redis.set(StringUtil.combiningSpecifiedUserKey(otherRequest.getUserName(),
        // "receive"), matchId, 7);
        // redis = null;
        // // attachedMatchSession(matchId, user, otherRequest.getUserName());
        // return matchId;
        // }

        // }
        // }
        // redis = null;
        // rankService = null;
        return null;
    }

}
