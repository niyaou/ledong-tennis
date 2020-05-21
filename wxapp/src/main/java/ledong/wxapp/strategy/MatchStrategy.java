package ledong.wxapp.strategy;

import java.util.HashMap;

import com.alibaba.fastjson.JSON;

import VO.MatchPostVo;
import VO.MatchRequestVo;
import VO.SessionVo;
import ledong.wxapp.config.CustomException;
import ledong.wxapp.constant.DataSetConstant;
import ledong.wxapp.constant.enums.MatchStatusCodeEnum;
import ledong.wxapp.constant.enums.ResultCodeEnum;
import ledong.wxapp.search.SearchApi;
import ledong.wxapp.utils.DateUtil;
import ledong.wxapp.utils.StringUtil;

/**
 * matching game base interface
 * 
 * @author uidq1343
 *
 */
public abstract class MatchStrategy {

    public abstract String matchingGame(MatchRequestVo vo);

    public static String postMatches(String parendId, String holder, String challenger, int matchType, int clubMatch,
            String orderTime, String courtName, String courtGps) {
        MatchPostVo vo = new MatchPostVo();
        vo.setCreateTime(DateUtil.getCurrentDate(DateUtil.FORMAT_DATE_TIME));
 
        if(MatchStatusCodeEnum.MATCH_TYPE_INTENTIONAL.getCode().equals(matchType)){
            HashMap<String,Object> queries=new HashMap<String,Object>();
            queries.put(MatchPostVo.HOLDER, holder);
            queries.put(MatchPostVo.STATUS, MatchStatusCodeEnum.MATCH_MATCHING_STATUS.getCode());
          Object intentional =   SearchApi.searchByMultiField(DataSetConstant.GAME_MATCH_INFORMATION, queries, null, null, null, null);
          if(intentional!=null){
              throw new CustomException(ResultCodeEnum.ONLY_ONE_INTENTIONAL_MATCH);
          }
        }
 

        if (!StringUtil.isEmpty(parendId)) {
            vo.setParendId(parendId);
        }
        vo.setHolder(holder);
        if (!StringUtil.isEmpty(challenger)) {
            vo.setChallenger(challenger);
        }
        MatchStatusCodeEnum status=null;
        if(!StringUtil.isEmpty(challenger) && !StringUtil.isEmpty(holder)){
            status = MatchStatusCodeEnum.MATCH_ACKNOWLEDGED_MATCHING;
        }else{
            status = MatchStatusCodeEnum.MATCH_MATCHING_STATUS;
        }
        System.out.println(holder);
        System.out.println(challenger);
        System.out.println(status.getMessage());
        vo.setStatus(status.getCode());
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

    public static String attachedMatchSession(String matchId, String holderId, String challengerId) {

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

}
