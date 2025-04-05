package com.ledong.service;
import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;


import cn.hutool.core.date.DateUtil;
import com.ledong.dao.*;
import com.ledong.entity.Charge;
import com.ledong.entity.Course;
import com.ledong.entity.PrepaidCard;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.*;

public class OptimizedAnalysisService {

    // @Autowired
    // private CoachDAO coachDao;

    // @Autowired
    // private CourtDAO courtDao;

    // @Autowired
    // private SpendDAO spendDao;

    // @Autowired
    // private UserDAO userDao;

    // @Autowired
    // private CourseDAO courseDao;

    // @Autowired
    // private ChargeDAO chargeDao;


    // @Autowired
    // private UserCases useCase;

    // public Object analyseEfficiency(String startTime, String endTime) {
    //     LocalDateTime start = LocalDateTime.parse(startTime);
    //     LocalDateTime end = LocalDateTime.parse(endTime);

    //     Map<String, Object> total = new ConcurrentHashMap<>();
    //     List<Course> courses = courseDao.findAllWithTimeRange(start, end);
    //     List<Charge> charges = chargeDao.findAllWithTimeRange(start, end);

    //     Map<String, Map<String, Float>> analys = new ConcurrentHashMap<>();
    //     Map<String, Map<String, Float>> revenue = new ConcurrentHashMap<>();

    //     Map<String, Float> totalMap = new ConcurrentHashMap<>();
    //     totalMap.put("spend", 0f);
    //     totalMap.put("charge", 0f);
    //     totalMap.put("equival", 0f);

    //     // 并行处理charges
    //     charges.parallelStream()
    //             .filter(member -> member.getCoach() == null || member.getCoach().getIsActive() > 0)
    //             .forEach(charge -> processCharge(charge, revenue));


    //     // 预加载所有用户数据
    //     Map<String, List<PrepaidCard>> usersByCourt = userDao.findAllByCourt(revenue.keySet());



    //     // 并行处理courts
    //     revenue.keySet().parallelStream().forEach(court -> 
    //         processCourt(court, revenue, usersByCourt.getOrDefault(court, Collections.emptyList())));

    //     // 并行处理courses
    //     courses.parallelStream()
    //             .filter(c -> c.getCoach() == null || c.getCoach().getIsActive() > 0)
    //             .forEach(course -> processCourse(course, analys, revenue));

    //     // 排序和汇总
    //     List<Map.Entry<String, Map<String, Float>>> analysList = sortAnalysList(analys);
    //     total.put("analyse", analysList);

    //     List<Map.Entry<String, Map<String, Float>>> revenueList = sortRevenueList(revenue, totalMap);
    //     total.put("revenue", revenueList);

    //     return total;
    // }

    // private void processCharge(Charge charge, Map<String, Map<String, Float>> revenue) {
    //     if (charge.getCourt() != null) {
    //           updateRevenue(charge.getCourt(), "charge", getChargeAmount(charge), revenue);
    //       }

    //     if (charge.getCoach() != null) {
    //         updateRevenue(charge.getCoach().getName(), "charge", getChargeAmount(charge), revenue);
    //     }
    // }

    // private void processCourt(String court, Map<String, Map<String, Float>> revenue, List<User> users) {
    //     float equival = (float) users.stream()
    //             .mapToDouble(u -> u.getEquivalentBalance() + u.getRestCharge())
    //             .sum();
    //     updateRevenue(court, "equival", equival, revenue);
    // }

    // private void processCourse(Course course, Map<String, Map<String, Float>> analys, Map<String, Map<String, Float>> revenue) {
    //     if (course.getCourseType() < 0) {
    //         processTrialCourse(course, analys);
    //     } else if (course.getCourseType() > 0) {
    //         processFormalCourse(course, analys, revenue);
    //     }
    // }

    // private void processTrialCourse(Course course, Map<String, Map<String, Float>> analys) {
    //     updateAnalys(course.getCoach().getName(), course, analys);
    //     updateAnalys(course.getCourt().getName(), course, analys);
    // }

    // private void processFormalCourse(Course course, Map<String, Map<String, Float>> analys, Map<String, Map<String, Float>> revenue) {
    //     updateRevenue(course.getCourt().getName(), "spend", calculateTotalSpend(course), revenue);
    //     updateAnalys(course.getCoach().getName(), course, analys);
    //     updateAnalys(course.getCourt().getName(), course, analys);
    //     updateRevenue(course.getCoach().getName(), "spend", calculateTotalSpend(course), revenue);
    // }

    // private void updateRevenue(String key, String subKey, float value, Map<String, Map<String, Float>> revenue) {
    //     revenue.computeIfAbsent(key, k -> new ConcurrentHashMap<>())
    //            .merge(subKey, value, Float::sum);
    // }

    // private void updateAnalys(String key, Course course, Map<String, Map<String, Float>> analys) {
    //     Map<String, Float> spec = analys.computeIfAbsent(key, k -> new ConcurrentHashMap<>());
    //     spec.merge("workTime", course.getDuration(), Float::sum);
    //     spec.merge("courses", course.getCourseType() > 0 ? 1f : 0f, Float::sum);
    //     float memberCount = calculateMemberCount(course);
    //     spec.merge("members", memberCount, Float::sum);
    //     spec.put("analyse", spec.get("members") / spec.get("courses"));
    //     spec.merge("trial", course.getCourseType() < 0 ? 1f : 0f, Float::sum);
    //     spec.merge("deal", course.getCourseType() == -1 ? 1f : 0f, Float::sum);
    // }

    // private float getChargeAmount(Charge charge) {
    //     return charge.getCharge() == 0f ? charge.getWorth() : charge.getCharge();
    // }

    // private float calculateTotalSpend(Course course) {
    //     return (float) course.getSpend().stream()
    //             .mapToDouble(spend -> spend.getCharge() == 0F ? spend.getDescription() : spend.getCharge())
    //             .sum();
    // }

    // private float calculateMemberCount(Course course) {
    //     int memberQuantities = course.getSpend().stream().mapToInt(Spend::getQuantities).sum();
    //     return memberQuantities > 0 ? ((memberQuantities > 1 ? 1 : course.getCourseType()) * memberQuantities) : 0f;
    // }

    // private List<Map.Entry<String, Map<String, Float>>> sortAnalysList(Map<String, Map<String, Float>> analys) {
    //     return analys.entrySet().stream()
    //             .sorted((m1, m2) -> Float.compare(
    //                 m2.getValue().getOrDefault("analyse", 0f),
    //                 m1.getValue().getOrDefault("analyse", 0f)))
    //             .collect(Collectors.toList());
    // }

    // private List<Map.Entry<String, Map<String, Float>>> sortRevenueList(Map<String, Map<String, Float>> revenue, Map<String, Float> totalMap) {
    //     revenue.entrySet().stream()
    //             .filter(entry -> entry.getKey().contains("校区"))
    //             .forEach(entry -> {
    //                 Map<String, Float> value = entry.getValue();
    //                 totalMap.merge("spend", value.getOrDefault("spend", 0f), Float::sum);
    //                 totalMap.merge("charge", value.getOrDefault("charge", 0f), Float::sum);
    //                 totalMap.merge("equival", value.getOrDefault("equival", 0f), Float::sum);
    //             });
    //     revenue.put("总共", totalMap);

    //     return revenue.entrySet().stream()
    //             .sorted((m1, m2) -> Float.compare(
    //                 m2.getValue().getOrDefault("spend", 0f),
    //                 m1.getValue().getOrDefault("spend", 0f)))
    //             .collect(Collectors.toList());
    // }
}