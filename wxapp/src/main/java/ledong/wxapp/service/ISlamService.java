package ledong.wxapp.service;

import java.util.List;
import java.util.Map;

/**
 * slam affairs
 * 
 * @author uidq1343
 *
 */
public interface ISlamService {

    /**
     * 
     * explore slam by time
     * 
     * @param date
     * @return
     */
    public List<String> exploreSlams(String date);

    /**
     * create a slam with specification time;
     * 
     * there must be only one active slam,which match time is later by now.
     * 
     * id,finals will be initiated.
     * 
     * @param date
     * @return matchId
     */
    public String createSlam(String date);

    /**
     * 
     * participate slam
     * 
     * 
     * @param openId
     * @param matchId
     * @return
     */
    public String participateSlam(String openId, String matchId);

    /**
     * 
     * generate groups ,initial group type,create group matches,and create appendix
     * matches
     * 
     * @param slamId
     * @return quantities of groups
     */
    public Integer generateGroups(String slamId);

    /**
     * 
     * grading group matches,set winner to next round
     * 
     * @param slamId
     * @return quantities of graded groups
     */
    public Integer gradingGroupMatches(String slamId);

    /**
     * 
     * grading appendix matches,set winner to next round
     * 
     * @param slamId
     * @return quantities of graded appendix
     */
    public Integer gradingAppendixMatches(String slamId);

    /**
     * 
     * grading quarter matches,set winner to next round
     * 
     * @param slamId
     * @return quantities of quarter groups
     */
    public Integer gradingQuarterMatches(String slamId);

    /**
     * 
     * grading semi matches,set winner to next round
     * 
     * @param slamId
     * @return quantities of semi groups
     */
    public Integer gradingSemiMatches(String slamId);

    /**
     * 
     * grading final match,set winner to next round
     * 
     * @param slamId
     * @return quantities of final group
     */
    public Integer gradingFinalMatch(String slamId);

    /**
     * 
     * get slam schedule and score
     * 
     * 
     * 
     * @param slamId
     * @return
     */
    public List<Map<String, Object>> getScheduleAndScore(String slamId);

}
