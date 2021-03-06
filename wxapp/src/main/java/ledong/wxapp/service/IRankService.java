package ledong.wxapp.service;

import java.util.HashMap;

import VO.LdRankInfoVo;
import VO.RankInfoVo;
import ledong.wxapp.entity.CommonResponse;
import org.springframework.http.HttpStatus;

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
    public String matchLDRank(String matchId, int holderScore, int challengerScore);


    /**
     * 
     * rank for the given double match
     * 
     * 1.get holder and challenger by matchid 2.get both players' current rank 3.use
     * strategy to rank 4.update players' rank 5.return both current rank
     * 
     * @param matchId
     * @param holderScore
     * @param challengerScore
     * @return
     */
    public String doubleMatchRank(String matchId, int holderScore, int challengerScore);

    /**
     * ranking slam matches,which stored in slam index 1.get holder and challenger
     * by matchid 2.get both players' current rank 3.use strategy to rank 4.update
     * players' rank 5.return both current rank
     * 
     * @param matchId
     * @param slamId
     * @param holderScore
     * @param challengerScore
     * @return
     */
    public String rankingSlamMatches(String slamId, String matchId, Integer holderScore, Integer challengerScore);

    /**
     * get user rank information by id
     * 
     * @param userId
     * @return
     */
    public RankInfoVo getUserRank(String userId);

    /**
     * get user rank information by id
     *
     * @param userId
     * @return
     */
    public LdRankInfoVo getLDUserRank(String userId);

    /**
     * update user rank information
     * 
     * @param userId
     * @param RankInfoVo
     * @return
     */
    public String updateRankInfo(RankInfoVo vo);

    /**
     * update user rank information
     *
     * @param userId
     * @param RankInfoVo
     * @return
     */
    public String updateLDRankInfo(LdRankInfoVo vo);

    /**
     * update user tag by others user
     * 
     * @param userId
     * @param tag
     * @return
     */
    public String updateUserTags(String userId, String tag);

    /**
     * update ld user tag by others user
     *
     * @param userId
     * @param tag
     * @return
     */
    public String updateLDUserTags(String userId, String tag);



    /**
     * get tag list
     */
    public Object getTagsList();

    /**
     * get ld tag list
     */
    public Object getLDTagsList();

    /**
     * get ranking list
     * 
     * @param grade
     * @return
     */
    public Object getRankingList(String grade);

    /**
     * get Double Ranking List
     * 
     * @param grade
     * @return
     */
    public Object getDoubleRankingList(String grade);

    /**
     * get ranking list by count
     * 
     * @param count
     * @return
     */
    public Object getRankingList(Integer count);

    /**
     * get ranking list by count
     *
     * @param count
     * @return
     */
    public Object getLDRankingList(Integer count);

    /**
     * create user rank info
     * 
     * @param userId
     * @return
     */
    public String createRankInfo(String userId);

    /**
     * create user LD rank info
     *
     * @param userId
     * @return
     */
    public String createLDRankInfo(String  openId);


    /**
     * updateTeenageParent
     * @param parent
     * @param openId
     * @param name
     * @param avator
     * @return
     */
    public String updateTeenageParent(String  parent,String  openId,String name,String avator);


    public String verifiedMember(String  openId);

    /**
     * create user LD rank info
     *
     * @param userId
     * @return
     */
    public String createLDTeenageRankInfo(String parent,String  openId);


    /**
     * update user win rate
     * 
     * @param userId
     * @return
     */
    public Double updateWinRate(String userId);
    public Double updateLDWinRate(String userId);


    /**
     * update user double win rate
     * 
     * @param userId
     * @return
     */
    public Double updateDoubleWinRate(String userId);

    /**
     * update user slam win rate
     * 
     * @param userId
     * @return
     */
    public Double updateSlamWinRate(String userId);

    /**
     * 
     * 
     * @param userId
     * @return
     */
    public Integer getUserPositionInRankList(String userId);

    /**
     *
     *
     * @param userId
     * @return
     */
    public Integer getLDUserPositionInRankList(String userId);

    /**
     * get system user
     * 
     * @return
     */
    public Long getTotalUser();

    /**
     * update score only operated by master
     * 
     * @param openId
     * @param score
     * @return
     */
    public String updateScoreByMaster(String openId, Integer score, String description);

    /**
     * update score only operated by master
     *
     * @param openId
     * @param score
     * @return
     */
    public String updateLDScoreByMaster(String openId, Integer score, String description);


    /**
     * score change log
     * 
     */
    public String scoreChangeLog(String openId, Integer score, String description);


    /**
     * score change log
     *
     */
    public String scoreLDChangeLog(String openId, Integer score, String description);

    /**
     * get score change log
     * @param openId
     * @return
     */
    public Object getScoreLog(String openId);

    /**
     * get ld score change log
     * @param openId
     * @return
     */
    public Object getLDScoreLog(String openId);


    /**
     * 
     * @return
     */
    public String updateUserPosition();

    /**
     *
     * @return
     */
    public String updateLDUserPosition();

    /**
     * 
     * @return
     */
    public String updateDoubleUserPosition();
}
