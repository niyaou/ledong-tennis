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

import javax.persistence.criteria.*;
import java.time.temporal.Temporal;
import java.util.*;
import java.util.stream.Collectors;

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


    @Autowired
    private UserCases useCase;

    @Autowired
    private SmsCases smsCase;

    @Transactional(rollbackFor = Exception.class)
    public CourseBo createCourse(
            String startTime,
            String endTime,
            String coachName,
            float spendingTime,
            String courtName,
            String descript,
            int courseType,
            String membersObj
    ) {
        var coach = coachDao.findByNumber(coachName);
        var court = courtDao.findByName(courtName);

        var courseBo = CourseBo.builder().court(court)
                .coach(coach)
                .startTime(DateUtil.parse(startTime).toLocalDateTime())
                .endTime(DateUtil.parse(endTime).toLocalDateTime())
                .duration(spendingTime)
                .description(descript)
                .courseType(courseType)
                .member(new ArrayList<>())
                .build();
        var course = Course.fromBO(courseBo);
        course = courseDao.save(course);
        if (course.getCourseType() >= 0) {
            var _mObj = JSONUtil.parse(membersObj);
            for (Map.Entry<String, Object> entry : ((JSONObject) _mObj).entrySet()) {
                //set spend description
                var key = entry.getKey();
                var value = entry.getValue();
                var member = userDao.findByNumber(key);
                var spend = SpendBo.builder().course(course).prepaidCard(member)
                        .build();
                var charge = ((JSONArray) value).get(0, Float.class);
                var times = ((JSONArray) value).get(1, Float.class);
                var annualTimes = ((JSONArray) value).get(2, Float.class);
                var spendDescript = ((JSONArray) value).get(3, Float.class);
                var quantities = ((JSONArray) value).get(4, Integer.class);
                if (charge != 0) {
                    member.setRestCharge(member.getRestCharge() - charge);
                    spend.setCharge((Float) charge);
                }
                if (times != 0) {
                    member.setTimesCount(member.getTimesCount() - times);
                    spend.setTimes(times);
                }
                if (annualTimes != 0) {
                    member.setAnnualCount(member.getAnnualCount() - annualTimes);
                    spend.setAnnualTimes(annualTimes);
                }
                if(quantities!=0){
                    member.setEquivalentBalance(member.getEquivalentBalance()- spendDescript.intValue());
                }

                spend.setDescription(spendDescript);
                spend.setQuantities(quantities);
                userDao.save(member);
                spendDao.save(Spend.fromBO(spend));
                var members = course.getMember();
                members.add(member);
                course.setMember(members);
            }
        }
        courseDao.save(course);
        return courseBo;
    }


    @Transactional(rollbackFor = Exception.class)
    public CourseBo removeCourseMember(Long courseId, String number) {
        var _course = courseDao.findById(courseId);
        if (_course.isPresent()) {
            var course = _course.get();
            var members = course.getMember();
            members = members.stream().filter((prepaidCard) -> {
                if (!prepaidCard.getNumber().equals(number)) {
                    return true;
                }

                var id = prepaidCard.getId();
                var spend = spendDao.findByPrepaidCard_IdAndCourse_Id(id, courseId);
                if (spend != null) {
                    useCase.setRestChargeChange(number, spend.getCharge());
                    useCase.setRestTimesChange(number, spend.getTimes());
                    useCase.setRestAnnualTimesChange(number, spend.getAnnualTimes());
                    spendDao.delete(spend);
                    return false;
                }


                return true;
//               return !prepaidCard.getNumber().equals(number);

            }).collect(Collectors.toList());
            course.setMember(members);
            courseDao.save(course);
            return DefaultConverter.convert(course, CourseBo.class);
        } else {
            throw new CustomException(UseCaseCode.NOT_FOUND);
        }
    }


    @Transactional(rollbackFor = Exception.class)
    public CourseBo removeCourse(Long courseId) {
        var _course = courseDao.findById(courseId);
        if (_course.isPresent()) {
            var course = _course.get();
            var members = course.getMember();
            members.forEach((prepaidCard) -> {
                var id = prepaidCard.getId();
                var number = prepaidCard.getNumber();
                var spend = spendDao.findByPrepaidCard_IdAndCourse_Id(id, courseId);
                useCase.setRestChargeChange(number, spend.getCharge());
                useCase.setRestTimesChange(number, spend.getTimes());
                useCase.setRestAnnualTimesChange(number, spend.getAnnualTimes());
                spendDao.delete(spend);
            });
            courseDao.delete(course);
            return DefaultConverter.convert(course, CourseBo.class);
        } else {
            throw new CustomException(UseCaseCode.NOT_FOUND);
        }
    }

    @Transactional(rollbackFor = Exception.class)
    public CourseBo trialCourseUpdate(Long courseId) {
        var _course = courseDao.findById(courseId);
        if (_course.isPresent()) {
            var course = _course.get();
            course.setCourseType(course.getCourseType()+1);
            courseDao.save(course);
            return DefaultConverter.convert(course, CourseBo.class);
        } else {
            throw new CustomException(UseCaseCode.NOT_FOUND);
        }
    }

    public Page<Course> totalCourse(String startTime, Integer pageNum, Integer pageSize) {
        var sort = Sort.by(Sort.Direction.DESC, "startTime");
        Pageable pageReq = PageRequest.of(pageNum - 1, pageSize, sort);
        return courseDao.findAllWithStartTimeAfter(DateUtil.parseDateTime(startTime).toLocalDateTime(), pageReq);
    }

    public Page<Course> memberCourse(String startTime, String number, Integer pageNum, Integer pageSize) {
        var sort = Sort.by(Sort.Direction.DESC, "startTime");
        Pageable pageReq = PageRequest.of(pageNum - 1, pageSize, sort);

        Specification<Course> spec = new Specification<Course>() {
            @Override
            public Predicate toPredicate(Root<Course> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
                Root<PrepaidCard> members = query.from(PrepaidCard.class);
                Join<Course, PrepaidCard> join = root.join("member", JoinType.INNER);
                List<Predicate> predicates = new ArrayList<>();
                predicates.add(cb.equal(join.get("number"), number)); // AB两表的关联条件，就是sql join 中的on条件
                predicates.add(cb.greaterThanOrEqualTo(root.get("startTime"), DateUtil.parse(startTime).toLocalDateTime()));
                query.distinct(true);
                return cb.and(predicates.toArray(new Predicate[predicates.size()]));
            }
        };
        return courseDao.findAll(spec, pageReq);
//        return  courseDao.findMemberWithStartTimeAfter(DateUtil.parseDateTime(startTime).toLocalDateTime(),number,pageReq);
    }


    public Object notify(Long id) {
        var sort = Sort.by(Sort.Direction.DESC, "startTime");
        Pageable pageReq = PageRequest.of(1, 1000, sort);
        Specification<Course> spec = new Specification<Course>() {
            @Override
            public Predicate toPredicate(Root<Course> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
                Root<PrepaidCard> members = query.from(PrepaidCard.class);
                List<Predicate> predicates = new ArrayList<>();
                predicates.add(cb.equal(root.get("notified"), 0)); // AB两表的关联条件，就是sql join 中的on条件
                if (id != null) {
                    predicates.add(cb.equal(root.get("id"), id));
                }

                query.distinct(true);
                return cb.and(predicates.toArray(new Predicate[0]));
            }
        };

        var courses = courseDao.findAll(spec);
        courses.forEach(course -> {
            try {
                smsCase.notifyCourse(course);
            } catch (TencentCloudSDKException e) {
                e.printStackTrace();
            }
        });
        return null;
    }
}
