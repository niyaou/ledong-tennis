package com.ledong.service;

import cn.hutool.core.date.DateTime;
import cn.hutool.core.date.DateUtil;
import cn.hutool.json.JSONArray;
import cn.hutool.json.JSONObject;
import cn.hutool.json.JSONUtil;
import com.ledong.bo.CourseBo;
import com.ledong.bo.SpendBo;
import com.ledong.dao.*;
import com.ledong.entity.Course;
import com.ledong.entity.Spend;
import org.springframework.beans.factory.annotation.Autowired;

import java.time.temporal.Temporal;
import java.util.*;

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
            float spendingTime,
            String courtName,
            String descript,
            String membersObj
    ) {
        var coach = coachDao.findByNumber(coachName);
        var court = courtDao.findByName(courtName);
        var _mObj = JSONUtil.parse(membersObj);
        var courseBo = CourseBo.builder().court(court)
                .coach(coach)
                .startTime(DateUtil.parse(startTime).toLocalDateTime())
                .endTime(DateUtil.parse(endTime).toLocalDateTime())
                .duration(spendingTime)
                .description(descript)
                .member(new ArrayList<>())
                .build();
        var course = Course.fromBO(courseBo);
        course=  courseDao.save(course);
        for (Map.Entry<String, Object> entry : ((JSONObject) _mObj).entrySet()) {
            var key = entry.getKey();
            var value = entry.getValue();
            var member = userDao.findByNumber(key);
            var spend = SpendBo.builder().course(course).prepaidCard(member)
                    .description(course.getDescription())
                    .build();
            var charge =((List<Integer>) value).get(0);
            var times =((List<Integer>) value).get(1);
            var annualTimes =((List<Integer>) value).get(2);
            if (charge!= 0) {
                member.setRestCharge(member.getRestCharge() -charge);
                spend.setCharge(charge);
            }
            if (times != 0) {
                member.setTimesCount(member.getTimesCount() - times);
                spend.setTimes(times);
            }
            if (annualTimes != 0) {
                member.setAnnualCount(member.getAnnualCount() -annualTimes);
                spend.setAnnualTimes(annualTimes);
            }
            userDao.save(member);
            spendDao.save(Spend.fromBO(spend));
            var members = course.getMember();
            members.add(member);
            course.setMember(members);
        }
        courseDao.save(course);
        return courseBo;
    }

}
