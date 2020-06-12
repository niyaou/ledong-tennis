package ledong.wxapp.strategy.impl.rank;

import java.util.Map;

import com.alibaba.fastjson.JSONObject;

import VO.MatchPostVo;
import VO.RankInfoVo;
import ledong.wxapp.constant.DataSetConstant;
import ledong.wxapp.search.SearchApi;
import ledong.wxapp.strategy.RankingStrategy;

public class PondRanking extends RankingStrategy {

    @Override
    public int[] ranking(String matchId, int holderScore, int challengerScor) {
        int[] scores = new int[2];
        int scoreChanged = 30;

        Map<String, Object> match = SearchApi.searchById(DataSetConstant.GAME_MATCH_INFORMATION, matchId);
        MatchPostVo vo = JSONObject.parseObject(JSONObject.toJSONString(match), MatchPostVo.class);

        RankInfoVo holder = getUserRank(vo.getHolder());
        RankInfoVo challenger = getUserRank(vo.getChallenger());

        scores[0] = holderScore > challengerScor
                ? (holder.getPoolRemain() >= scoreChanged ? scoreChanged : (holder.getPoolRemain() + 5))
                : 0;
        scores[1] = holderScore < challengerScor
                ? (challenger.getPoolRemain() >= scoreChanged ? scoreChanged : (challenger.getPoolRemain() + 5))
                : 0;

                if(holder.getPoolRemain()>=scores[0]){
                    holder.setPoolRemain(holder.getPoolRemain() - scores[0]);
                }
    
            updateRankInfo(holder);
      
            if(challenger.getPoolRemain()>= scores[1]){
                challenger.setPoolRemain(challenger.getPoolRemain() - scores[1]);
            }
           
            updateRankInfo(challenger);
     

        return scores;
    }

}
