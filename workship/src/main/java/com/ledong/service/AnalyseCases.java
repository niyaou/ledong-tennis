package com.ledong.service;

import cn.hutool.core.date.DateUtil;
import cn.hutool.json.JSONArray;
import cn.hutool.json.JSONObject;
import cn.hutool.json.JSONUtil;
import com.ledong.bo.CourseBo;
import com.ledong.bo.SpendBo;
import com.ledong.dao.*;
import com.ledong.entity.Coach;
import com.ledong.entity.Course;
import com.ledong.entity.PrepaidCard;
import com.ledong.entity.Spend;
import com.ledong.exception.CustomException;
import com.ledong.exception.UseCaseCode;
import com.ledong.util.DefaultConverter;
import com.tencentcloudapi.common.exception.TencentCloudSDKException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;
import java.util.*;


public class AnalyseCases {

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


    @Autowired
    private UserCases useCase;


    public Object analyseEfficiancy(String startTime, String endTime) {

        var course = courseDao.findAllWithTimeRange(DateUtil.parse(startTime).toLocalDateTime(), DateUtil.parse(endTime).toLocalDateTime());
        var analys = new LinkedHashMap<String, HashMap<String, Float>>();

        course.stream().forEach(course1 -> {
            if (course1.getCourseType() > 0) {

                var coach = analys.get(course1.getCoach().getName());
                if (coach == null) {
                    var spec = new HashMap<String, Float>();
                    spec.put("courses", 1F);
                    spec.put("members", course1.getCourseType() * 1F);
                    spec.put("analyse",course1.getCourseType() * 1F/1);
                    analys.put(course1.getCoach().getName(), spec);
                } else {
                    coach.put("courses", coach.get("courses") + 1);
                    coach.put("members", coach.get("members") + course1.getCourseType() * 1);
                    coach.put("analyse",coach.get("members")/ coach.get("courses"));
                    analys.put(course1.getCoach().getName(), coach);

                }
            }
        });

      var entrylist=new ArrayList<>(analys.entrySet())  ;
        Collections.sort(entrylist, ((m1,m2)->{return (int) (m2.getValue().get("analyse")*100-m1.getValue().get("analyse")*100);}));

        return entrylist;
    }
}
