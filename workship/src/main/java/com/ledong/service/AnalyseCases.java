package com.ledong.service;

import cn.hutool.core.date.DateUtil;
import com.ledong.dao.*;
import org.springframework.beans.factory.annotation.Autowired;

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
    private ChargeDAO chargeDao;


    @Autowired
    private UserCases useCase;


    public Object analyseEfficiancy(String startTime, String endTime) {

        var total = new HashMap<String, Object>();
        var course = courseDao.findAllWithTimeRange(DateUtil.parse(startTime).toLocalDateTime(), DateUtil.parse(endTime).toLocalDateTime());
        var charge = chargeDao.findAllWithTimeRange(DateUtil.parse(startTime).toLocalDateTime(), DateUtil.parse(endTime).toLocalDateTime());

        var analys = new LinkedHashMap<String, HashMap<String, Float>>();

        var revenue = new LinkedHashMap<String, HashMap<String, Float>>();

        var totalMap = new HashMap<String, Float>();
        totalMap.put("spend", 0f);
        totalMap.put("charge", 0f);


        charge.stream().forEach(charge1 -> {
            var court = revenue.get(charge1.getCourt());

            if (court == null) {
                var spec = new HashMap<String, Float>();

                spec.put("charge", charge1.getCharge() == 0f ? charge1.getWorth() : charge1.getCharge());

                revenue.put(charge1.getCourt(), spec);

            } else {
                court.put("charge", court.get("charge") + (charge1.getCharge() == 0f ? charge1.getWorth() : charge1.getCharge()));

                revenue.put(charge1.getCourt(), court);
            }


            if (charge1.getCoach() != null) {
                var coach = revenue.get(charge1.getCoach().getName());
                if (coach == null) {
                    var spec = new HashMap<String, Float>();
                    spec.put("spend", 0f);
                    spec.put("charge", 0f);
                    spec.put("charge", charge1.getCharge() == 0f ? charge1.getWorth() : charge1.getCharge());

                    revenue.put(charge1.getCoach().getName(), spec);

                } else {
                    coach.put("charge", coach.get("charge") + (charge1.getCharge() == 0f ? charge1.getWorth() : charge1.getCharge()));

                    revenue.put(charge1.getCoach().getName(), coach);
                }
            }

        });


        course.stream().forEach(course1 -> {
//            体验课
            if (course1.getCourseType() < 0) {
                var coach = analys.get(course1.getCoach().getName());
                if (coach == null) {
                    var spec = new HashMap<String, Float>();
                    spec.put("workTime",course1.getDuration());
                    spec.put("courses", 0F);
                    spec.put("members",0f);
                    spec.put("analyse", 0f);
                    spec.put("trial", course1.getCourseType() < 0f ? 1f : 0f);
                    spec.put("deal", course1.getCourseType() == -1f ? 1f : 0f);
                    analys.put(course1.getCoach().getName(), spec);
                } else {
                    coach.put("workTime", coach.get("workTime") + course1.getDuration());
                    coach.put("trial", coach.get("trial") + (course1.getCourseType() < 0f ? 1f : 0f));
                    coach.put("deal", coach.get("deal") + (course1.getCourseType() == -1f ? 1f : 0f));
                    analys.put(course1.getCoach().getName(), coach);

                }
            }
//            正式课
            if (course1.getCourseType() > 0) {
                var coach = analys.get(course1.getCoach().getName());

                var court = revenue.get(course1.getCourt().getName());
                var spends = course1.getSpend();
                if (court == null) {
                    var spec = new HashMap<String, Float>();

                    spends.stream().forEach(spend1 -> {
                        spec.put("spend", spend1.getCharge() == 0F ? spend1.getDescription() : spend1.getCharge());
                    });

                    revenue.put(course1.getCourt().getName(), spec);
                } else {
                    spends.stream().forEach(spend1 -> {
                        court.put("spend", (court.get("spend") == null ? 0 : court.get("spend")) + (spend1.getCharge() == 0F ? spend1.getDescription() : spend1.getCharge()));
                    });

                    revenue.put(course1.getCourt().getName(), court);
                }

                var memberQuantities = 0;
                for(var spend:course1.getSpend()){
                    memberQuantities += spend.getQuantities();
                }
                if (coach == null) {
                    var spec = new HashMap<String, Float>();
                    spec.put("workTime", course1.getDuration());
                    spec.put("courses", 1F);
                    spec.put("members", (course1.getCourseType() *memberQuantities)* 1F);
                    spec.put("analyse",spec.get("members"));
                    spec.put("trial", course1.getCourseType() < 0f ? 1f : 0f);
                    spec.put("deal", course1.getCourseType() == -1f ? 1f : 0f);
                    analys.put(course1.getCoach().getName(), spec);
                } else {
                    coach.put("workTime", coach.get("workTime") + course1.getDuration());
                    coach.put("courses", coach.get("courses") + 1);
                    coach.put("members", coach.get("members") +(course1.getCourseType() *memberQuantities) * 1F);
                    coach.put("analyse", coach.get("members") / coach.get("courses"));
                    coach.put("trial", coach.get("trial") + (course1.getCourseType() < 0f ? 1f : 0f));
                    coach.put("deal", coach.get("deal") + (course1.getCourseType() == -1f ? 1f : 0f));
                    analys.put(course1.getCoach().getName(), coach);

                }


                //教练消课
                var coachRevenue = revenue.get(course1.getCoach().getName());
                if (coachRevenue == null) {
                    var spec = new HashMap<String, Float>();
                    spec.put("spend", 0f);
                    spec.put("charge", 0f);
                    spends.stream().forEach(spend1 -> {
                        spec.put("spend", spend1.getCharge() == 0F ? spend1.getDescription() : spend1.getCharge());
                    });
                    revenue.put(course1.getCoach().getName(), spec);
                } else {
                    spends.stream().forEach(spend1 -> {
                        coachRevenue.put("spend", (coachRevenue.get("spend") == null ? 0 : coachRevenue.get("spend")) + (spend1.getCharge() == 0F ? spend1.getDescription() : spend1.getCharge()));
                    });
                    revenue.put(course1.getCoach().getName(), coachRevenue);
                }

            }
        });

        var entrylist = new ArrayList<>(analys.entrySet());
        Collections.sort(entrylist, ((m1, m2) -> {
            return (int) ((m2.getValue().get("analyse")==null?0:m2.getValue().get("analyse")) * 100 - (m1.getValue().get("analyse")==null?0:m1.getValue().get("analyse") )* 100);
        }));


        total.put("analyse", entrylist);

        for (var key : revenue.keySet()) {
            var value = revenue.get(key);
            totalMap.put("spend", totalMap.get("spend") + (value.get("spend") == null ? 0 : value.get("spend")));
            totalMap.put("charge", totalMap.get("charge") + (value.get("charge") == null ? 0 : value.get("charge")));
        }
        revenue.put("总共", totalMap);

        var revenuelist = new ArrayList<>(revenue.entrySet());
        Collections.sort(revenuelist, ((m1, m2) -> {
            return (int) ((m2.getValue().get("spend") == null ? 0 : m2.getValue().get("spend")) * 100 - (m1.getValue().get("spend") == null ? 0 : m1.getValue().get("spend")) * 100);
        }));
        total.put("revenue", revenuelist);

        return total;
    }
}
