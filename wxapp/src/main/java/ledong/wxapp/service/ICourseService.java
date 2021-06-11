package ledong.wxapp.service;

import java.util.HashMap;

public interface ICourseService {


    /**
     * CREATE course
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
    public String addCourse(String startTime, String endTime, String coach, Integer isExperience, Integer isDealing, Double spendingTime,
                            Integer courtSpend, Integer coachSpend, Integer court,HashMap<String,Integer> membersObj);



}
