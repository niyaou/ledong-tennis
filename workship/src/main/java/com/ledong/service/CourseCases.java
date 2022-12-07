package com.ledong.service;

import cn.hutool.json.JSONArray;
import cn.hutool.json.JSONUtil;
import com.ledong.bo.CourseBo;
import com.ledong.dao.*;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.HashMap;

public class CourseCases {

    @Autowired
    private CoachDAO coachDao;

    @Autowired
    private CourtDAO courtDao;

    @Autowired
    private SpendDAO spendDao;

    @Autowired
    private UserDAO userDao;

    @Autowired
    private CourseDAO courseDao;

    @Autowired
    private CoachDAO chargeDao;

    public CourseBo createCourse(
            String startTime,
            String endTime,
            String coachName,
            Double spendingTime,
            String courtName,
            String descript,
            String membersObj
    ) {
        var coach = coachDao.findByNumber(coachName);
        var court = courtDao.findByName(courtName);
        HashMap<String, Object> _mObj= (HashMap<String, Object>) JSONUtil.parse(membersObj);
        for (String m : _mObj.keySet()) {
//            members.add(m);
//            incoming += (int)membersObj.get(m).get(0);
//            incomingTimes += (int)membersObj.get(m).get(1);


        }
        return null;
    }

}
