package ledong.wxapp.service;

import java.util.HashMap;

import VO.LdCourseVo;
import com.alibaba.fastjson.JSONArray;

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
            Double spendingTime, Integer courtSpend, Integer coachSpend, String court,String grade,String descript,
            HashMap<String, JSONArray> membersObj);


    /**
     * upload course time
     * @param startTime
     * @param endTime
     * @return
     */
    public String uploadCourse(String courseId,String startTime, String endTime);

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

    /**
     * daily statistics
     * @return
     */
    public Object dailyStatistics();

}
