package ledong.wxapp.service.impl;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.alibaba.fastjson.JSON;

import VO.MatchPostVo;
import VO.MatchRequestVo;
import VO.SessionVo;
import ledong.wxapp.constant.DataSetConstant;
import ledong.wxapp.constant.enums.MatchStatusCodeEnum;
import ledong.wxapp.redis.RedisUtil;
import ledong.wxapp.search.SearchApi;
import ledong.wxapp.service.IMatchService;
import ledong.wxapp.utils.DateUtil;
import ledong.wxapp.utils.StringUtil;

@Service
public class MatchServiceImpl implements IMatchService {

    @Autowired
    private RedisUtil redis;

    @Override
    public String requestMatching(String user, String courtGps) {

        MatchRequestVo vo = new MatchRequestVo();
        vo.setCreateTime(DateUtil.getCurrentDate(DateUtil.FORMAT_DATE_TIME));
        vo.setLocation(courtGps);
        vo.setUserName("niyaou");

        redis.hdel(MatchRequestVo.MATCHREQUESTFROM, StringUtil.combiningSpecifiedUserKey(user));// child key expired
                                                                                                // time specification
                                                                                                // should add future by
                                                                                                // reddision

        redis.hset(MatchRequestVo.MATCHREQUESTFROM, StringUtil.combiningSpecifiedUserKey(vo.getUserName()), vo, 10);

        Map<Object, Object> map = redis.hmget(MatchRequestVo.MATCHREQUESTFROM);
        if (map.size() != 0) {
            for (Map.Entry<Object, Object> entry : map.entrySet()) {
                if (redis.lockKey((String) entry.getKey(), 30)) {
                    System.out.println("Key = " + entry.getKey() + ", Value = " + entry.getValue());

                    MatchRequestVo otherRequest = (MatchRequestVo) entry.getValue();

                    // some strategy to match request
                    otherRequest = otherRequest == null ? otherRequest : otherRequest;
                    String matchId = postMatches(null, user, otherRequest.getUserName(),
                            MatchStatusCodeEnum.MATCH_TYPE_RANDOM.getCode(),
                            MatchStatusCodeEnum.NON_CLUB_MATCH.getCode(), null, "南湖", "54.6,123.1");
                    System.out.println(String.format(" create match post : %s", user));
                    attachedMatchSession(matchId, user, otherRequest.getUserName());
                    return matchId;
                } else {
                    System.out.println("the Key = " + entry.getKey() + " has been locked ");
                }

            }
        } else {

        }

        System.out.print(map.toString());
        return "" + redis.hset(MatchRequestVo.MATCHREQUESTFROM, StringUtil.combiningSpecifiedUserKey(user), vo, 10);
    }

    @Override
    public String postMatches(String parendId, String holder, String challenger, int matchType, int clubMatch,
            String orderTime, String courtName, String courtGps) {
        MatchPostVo vo = new MatchPostVo();
        vo.setCreateTime(DateUtil.getCurrentDate(DateUtil.FORMAT_DATE_TIME));

        if (!StringUtil.isEmpty(parendId)) {
            vo.setParendId(parendId);
        }
        vo.setHolder(holder);
        if (!StringUtil.isEmpty(challenger)) {
            vo.setChallenger(challenger);
        }

        vo.setStatus(MatchStatusCodeEnum.MATCH_MATCHING_STATUS.getCode());
        vo.setMatchType(matchType);
        vo.setClubMatch(clubMatch);

        if (!StringUtil.isEmpty(orderTime)) {
            vo.setOrderTime(orderTime);
        }
        if (!StringUtil.isEmpty(courtName)) {
            vo.setCourtName(courtName);
        }
        if (!StringUtil.isEmpty(courtGps)) {
            vo.setCourtGPS(courtGps);
        }

        String id = DateUtil.getCurrentDate(DateUtil.FORMAT_DATETIME_NUM);
        id = String.format("%s-%s-%s", id, holder, StringUtil.isEmpty(challenger) ? "" : challenger);
        id = SearchApi.insertDocument(DataSetConstant.GAME_MATCH_INFORMATION, JSON.toJSONString(vo), id);
        return id;
    }

    @Override
    public String attachedMatchSession(String matchId, String holderId, String challengerId) {

        SessionVo vo = new SessionVo();

        if (!StringUtil.isEmpty(matchId)) {
            vo.setMatchId(matchId);
        }
        if (!StringUtil.isEmpty(holderId)) {
            vo.setHolderId(holderId);
        }

        if (!StringUtil.isEmpty(challengerId)) {
            vo.setChallenger(challengerId);
        }
        String id = SearchApi.insertDocument(DataSetConstant.SESSION_INFORMATION, JSON.toJSONString(vo));
        matchId = SearchApi.updateFieldValueById(DataSetConstant.GAME_MATCH_INFORMATION, MatchPostVo.SESSIONID, id,
                matchId);
        return id;
    }

    @Override
    public String postIntentionalMatch(String user, String orderTime, String courtName, String courtGps) {
        return postMatches(null, user, null, MatchStatusCodeEnum.MATCH_TYPE_PICK.getCode(),
                MatchStatusCodeEnum.NON_CLUB_MATCH.getCode(), orderTime, courtName, courtGps);
    }

    @Override
    public String postChallengeMatch(String holder, String challenger) {
        String matchId = postMatches(null, holder, challenger, MatchStatusCodeEnum.MATCH_TYPE_PICK.getCode(),
                MatchStatusCodeEnum.NON_CLUB_MATCH.getCode(), null, null, null);
        attachedMatchSession(matchId, holder, challenger);
        return matchId;
    }

    @Override
    public String acceptIntentionalMatch(String parentId,String challenger) {
        HashMap<String, Object> match = SearchApi.searchById(DataSetConstant.GAME_MATCH_INFORMATION, parentId);
        if(match==null){
            return null;
        }
        String holder=(String) match.get(MatchPostVo.HOLDER);
        String matchId = postMatches((String) match.get(MatchPostVo.ID), holder,
                challenger,
                MatchStatusCodeEnum.MATCH_TYPE_PICK
                        .getCode(),
                MatchStatusCodeEnum.NON_CLUB_MATCH.getCode(), null, null, null);
        attachedMatchSession(matchId, holder, challenger);
        return matchId;
    }

}
