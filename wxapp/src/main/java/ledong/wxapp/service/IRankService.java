package ledong.wxapp.service;

import VO.RankInfoVo;

public interface IRankService {

    /**
     * 
     * rank for the given match
     * 
     * 1.get holder and challenger by matchid 2.get both players' current rank 3.use
     * strategy to rank 4.update players' rank 5.return both current rank
     * 
     * @param matchId
     * @param holderScore
     * @param challengerScore
     * @return
     */
    public String matchRank(String matchId, int holderScore, int challengerScore);

    /**
     * get user rank information by id
     * 
     * @param userId
     * @return
     */
    public RankInfoVo getUserRank(String userId);

    /**
     * update user rank information
     * 
     * @param userId
     * @param RankInfoVo
     * @return
     */
    public String updateRankInfo(RankInfoVo vo);

    /**
     * get ranking list
     * 
     * @return
     */
    public Object getRankingList();

    /**
     * create user rank info
     * 
     * @param userId
     * @return
     */
    public String createRankInfo(String userId);

}
