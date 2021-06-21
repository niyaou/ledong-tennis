package ledong.wxapp.service;

import java.util.HashMap;

import VO.LdCourseVo;

public interface ICourseService {

    /**
     * CREATE course
     * 
     * @param startTime
     * @param endTime
     * @param coach
     * @param isExperience
     * @param isDealing
     * @param spendingTime
     * @param courtSpend
     * @param coachSpend
     * @param court
     * @param membersObj
     * @return
     */
    public String addCourse(String startTime, String endTime, String coach, Integer isExperience, Integer isDealing,
            Double spendingTime, Integer courtSpend, Integer coachSpend, String court,
            HashMap<String, Integer> membersObj);

    /**
     * get course log by card id
     * 
     * @param cardId
     * @param startTime
     * @param endTime
     * @return
     */
    public String courseLogs(String cardId, String startTime, String endTime);

    /**
     * as name
     * 
     */
    public LdCourseVo getCourseById(String courseId);

}
