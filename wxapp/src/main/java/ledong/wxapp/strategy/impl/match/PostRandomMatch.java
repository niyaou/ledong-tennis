package ledong.wxapp.strategy.impl.match;

import VO.MatchRequestVo;
import ledong.wxapp.redis.RedisUtil;
import ledong.wxapp.strategy.MatchStrategy;
import ledong.wxapp.utils.StringUtil;

public class PostRandomMatch extends MatchStrategy {

    // private RedisUtil redis;

    public PostRandomMatch() {
        // this.redis = redis;
    }

    @Override
    public String matchingGame(MatchRequestVo vo) {
        // redis.hset(MatchRequestVo.MATCHREQUESTFROM,
        // StringUtil.combiningSpecifiedUserKey(vo.getUserName(), null), vo,
        // 10);
        // long interval = 6000;
        // int count = 0;
        // long startTime = System.currentTimeMillis();
        // long endTime = 0;
        // while ((endTime - startTime) < interval) {
        // // System.out.println(String.format(" interval remains : %d", interval));
        // String receiveKey = StringUtil.combiningSpecifiedUserKey(vo.getUserName(),
        // "receive");

        // count++;
        // // System.out.println(String.format("endTime: %d startTime : %d delta: %d ,
        // // check redis %d times",endTime,startTime,(endTime - startTime)
        // // , count));
        // if (redis.hasKey(receiveKey)) {
        // String matchId = (String) redis.get(receiveKey);
        // redis = null;
        // return matchId;
        // } else {
        // endTime = System.currentTimeMillis();
        // try {
        // Thread.sleep(100);
        // } catch (InterruptedException e) {
        // e.printStackTrace();
        // }

        // // System.out.println(String.format(" interval minus : %d", interval));
        // }

        // }
        // System.out.println(String.format(" check redis %d times", count));
        // redis = null;
        return null;
    }

}
