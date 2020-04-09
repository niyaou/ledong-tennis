package ledong.wxapp.service.impl;

import java.util.Map;

import org.elasticsearch.search.sort.SortOrder;
import org.springframework.stereotype.Service;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;

import VO.MatchPostVo;
import VO.RankInfoVo;
import ledong.wxapp.constant.DataSetConstant;
import ledong.wxapp.search.SearchApi;
import ledong.wxapp.service.IRankService;

@Service
public class RankServiceImpl implements IRankService {

    @Override
    public String matchRank(String matchId, int holderScore, int challengerScor) {
        Map<String, Object> match = SearchApi.searchById(DataSetConstant.GAME_MATCH_INFORMATION, matchId);
        MatchPostVo vo = JSONObject.parseObject(JSONObject.toJSONString(match), MatchPostVo.class);

        RankInfoVo holder = getUserRank(vo.getHolder());
        RankInfoVo challenger = getUserRank(vo.getChallenger());
        int scoreChanged = 0;
        // do some strategy
        if (holderScore > challengerScor) {
            scoreChanged = 30;
            holder.setScore(holder.getScore() + scoreChanged);
            challenger.setScore(challenger.getScore() - scoreChanged);
        } else {
            scoreChanged = -30;
            holder.setScore(holder.getScore() + scoreChanged);
            challenger.setScore(challenger.getScore() - scoreChanged);
        }
        updateRankInfo(holder.getId(), holder);
        updateRankInfo(challenger.getId(), challenger);
        return String.valueOf(scoreChanged);
    }

    @Override
    public RankInfoVo getUserRank(String userId) {
        Map<String, Object> match = SearchApi.searchById(DataSetConstant.USER_RANK_INFORMATION, userId);
        RankInfoVo vo = JSONObject.parseObject(JSONObject.toJSONString(match), RankInfoVo.class);
        return vo;
    }

    @Override
    public String updateRankInfo(String userId, RankInfoVo vo) {
        return SearchApi.updateDocument(DataSetConstant.USER_RANK_INFORMATION, JSON.toJSONString(vo), userId);
    }

    @Override
    public Object getRankingList() {
        return  SearchApi.searchByFieldSorted(DataSetConstant.USER_RANK_INFORMATION,RankInfoVo.SCORE,SortOrder.DESC,500 );
    }

}
