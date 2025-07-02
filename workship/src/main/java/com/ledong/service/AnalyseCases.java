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
        totalMap.put("equival", 0f);

        charge.stream().filter(member->member.getCoach()==null || member.getCoach().getIsActive()>0).forEach(charge1 -> {
            var court = revenue.get(charge1.getCourt());

            if (court == null) {
                var spec = new HashMap<String, Float>();

                spec.put("charge", charge1.getCharge() == 0f ? charge1.getWorth() : charge1.getCharge());
                spec.put("equival",0f);
                revenue.put(charge1.getCourt(), spec);


            } else {
                court.put("charge", court.get("charge") + (charge1.getCharge() == 0f ? charge1.getWorth() : charge1.getCharge()));
                revenue.put(charge1.getCourt(), court);
            }


            if (charge1.getCoach() != null) {
                var coach = revenue.get(charge1.getCoach().getName());

                if (coach == null) {
                    var spec = new HashMap<String, Float>();
                    spec.put("equival",0f);
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

       for(var court : revenue.keySet()){
         var users=  userDao.findAllByCourt(court);
         var equival = 0;
         for(var u : users){
             equival +=(float)u.getEquivalentBalance();
             equival+=u.getRestCharge();
         }
           var _court = revenue.get(court);
           if (_court == null) {
               var spec = new HashMap<String, Float>();
               spec.put("equival",  (float)equival);
               revenue.put(court, spec);
           } else {
               _court.put("equival",  _court.get("equival") +equival);
               revenue.put(court, _court);
           }
       }




        course.stream().filter(c->c.getCoach()==null||c.getCoach().getIsActive()>0).forEach(course1 -> {
//            体验课
            if (course1.getCourseType() < 0) {
                //统计教练的满班率
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

                //统计校区的满班率
                var school = analys.get(course1.getCourt().getName());
                if (school == null) {
                    var spec = new HashMap<String, Float>();
                    spec.put("workTime",course1.getDuration());
                    spec.put("courses", 0F);
                    spec.put("members",0f);
                    spec.put("analyse", 0f);
                    spec.put("trial", course1.getCourseType() < 0f ? 1f : 0f);
                    spec.put("deal", course1.getCourseType() == -1f ? 1f : 0f);
                    analys.put(course1.getCourt().getName(), spec);
                } else {
                    school.put("workTime", school.get("workTime") + course1.getDuration());
                    school.put("trial", school.get("trial") + (course1.getCourseType() < 0f ? 1f : 0f));
                    school.put("deal", school.get("deal") + (course1.getCourseType() == -1f ? 1f : 0f));
                    analys.put(course1.getCourt().getName(), school);

                }
            }
//            正式课
            if (course1.getCourseType() > 0) {

                var coach = analys.get(course1.getCoach().getName());

                var school =  analys.get(course1.getCourt().getName());
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
                    if(memberQuantities>0){
                        spec.put("courses", 1F);
                        spec.put("members", ((memberQuantities>1?1:course1.getCourseType()) *memberQuantities)* 1F);//如果客人数量大于1，就是普通
                    }else{
                        //   如果是现金消费，没有扣卡和spend记录，不计算满班率
                        spec.put("courses", 0F);
                        spec.put("members",0f);
                    }


                    spec.put("analyse",0f);
                    spec.put("trial", course1.getCourseType() < 0f ? 1f : 0f);
                    spec.put("deal", course1.getCourseType() == -1f ? 1f : 0f);
                    analys.put(course1.getCoach().getName(), spec);
                } else {
                    coach.put("workTime", coach.get("workTime") + course1.getDuration());
                    if(memberQuantities>0){
                        coach.put("courses", coach.get("courses") + 1);
                        coach.put("members", coach.get("members") +((memberQuantities>1?1:course1.getCourseType()) *memberQuantities) * 1F);
                        coach.put("analyse", coach.get("members") / coach.get("courses"));
                    }
                    coach.put("trial", coach.get("trial") + (course1.getCourseType() < 0f ? 1f : 0f));
                    coach.put("deal", coach.get("deal") + (course1.getCourseType() == -1f ? 1f : 0f));
                    analys.put(course1.getCoach().getName(), coach);

                }


                if (school == null) {
                    var spec = new HashMap<String, Float>();
                    spec.put("workTime", course1.getDuration());
                    spec.put("courses", 1F);
                    spec.put("members", ((memberQuantities>1?1:course1.getCourseType()) *memberQuantities)* 1F);
                    spec.put("analyse",spec.get("members"));
                    spec.put("trial", course1.getCourseType() < 0f ? 1f : 0f);
                    spec.put("deal", course1.getCourseType() == -1f ? 1f : 0f);
                    analys.put(course1.getCourt().getName(), spec);
                } else {
                    school.put("workTime", school.get("workTime") + course1.getDuration());
                    school.put("courses", school.get("courses") + 1);
                    school.put("members", school.get("members") +((memberQuantities>1?1:course1.getCourseType()) *memberQuantities) * 1F);
                    school.put("analyse", school.get("members") / school.get("courses"));
                    school.put("trial", school.get("trial") + (course1.getCourseType() < 0f ? 1f : 0f));
                    school.put("deal", school.get("deal") + (course1.getCourseType() == -1f ? 1f : 0f));
                    analys.put(course1.getCourt().getName(), school);

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
            if(!key.contains("校区")){
                continue;
            }
            var value = revenue.get(key);
            totalMap.put("spend", totalMap.get("spend") + (value.get("spend") == null ? 0 : value.get("spend")));
            totalMap.put("charge", totalMap.get("charge") + (value.get("charge") == null ? 0 : value.get("charge")));
            totalMap.put("equival", totalMap.get("equival") + (value.get("equival") == null ? 0 : value.get("equival")));
        }
        revenue.put("总共", totalMap);

        var revenuelist = new ArrayList<>(revenue.entrySet());
        Collections.sort(revenuelist, ((m1, m2) -> {
            return (int) ((m2.getValue().get("spend") == null ? 0 : m2.getValue().get("spend")) * 100 - (m1.getValue().get("spend") == null ? 0 : m1.getValue().get("spend")) * 100);
        }));
        total.put("revenue", revenuelist);

        return total;
    }

    // 内部静态类用于结构化结果
    public static class AnalyseResult {
        public float workTime = 0f;
        public float courses = 0f;
        public float members = 0f;
        public float analyse = 0f;
        public float trial = 0f;
        public float deal = 0f;
    }

    public static class RevenueResult {
        public float spend = 0f;
        public float charge = 0f;
        public float equival = 0f;
    }

    public Object analyseOptimizedEfficiancy(String startTime, String endTime) {
        Map<String, Object> total = new HashMap<>();
        var courseList = courseDao.findAllWithTimeRange(DateUtil.parse(startTime).toLocalDateTime(), DateUtil.parse(endTime).toLocalDateTime());
        var chargeList = chargeDao.findAllWithTimeRange(DateUtil.parse(startTime).toLocalDateTime(), DateUtil.parse(endTime).toLocalDateTime());

        // 批量查出所有用户并按court分组
        List<com.ledong.entity.PrepaidCard> allUsers = userDao.findAll();
        Map<String, List<com.ledong.entity.PrepaidCard>> usersByCourt = allUsers.stream()
            .filter(u -> u.getCourt() != null)
            .collect(java.util.stream.Collectors.groupingBy(com.ledong.entity.PrepaidCard::getCourt));

        Map<String, AnalyseResult> analyseMap = new LinkedHashMap<>();
        Map<String, RevenueResult> revenueMap = new LinkedHashMap<>();
        RevenueResult totalRevenue = new RevenueResult();

        // 收入统计
        for (var charge : chargeList) {
            if (charge.getCoach() == null || charge.getCoach().getIsActive() > 0) {
                // 校区统计
                String courtName = charge.getCourt();
                RevenueResult courtRevenue = revenueMap.computeIfAbsent(courtName, k -> new RevenueResult());
                courtRevenue.charge += (charge.getCharge() == 0f ? charge.getWorth() : charge.getCharge());

                // 教练统计
                if (charge.getCoach() != null) {
                    String coachName = charge.getCoach().getName();
                    RevenueResult coachRevenue = revenueMap.computeIfAbsent(coachName, k -> new RevenueResult());
                    coachRevenue.charge += (charge.getCharge() == 0f ? charge.getWorth() : charge.getCharge());
                }
            }
        }

        // 校区等价余额统计（用分组后的usersByCourt）
        for (var court : revenueMap.keySet()) {
            List<com.ledong.entity.PrepaidCard> users = usersByCourt.getOrDefault(court, java.util.Collections.emptyList());
            float equival = 0f;
            for (var u : users) {
                equival += (u.getEquivalentBalance() == null ? 0 : u.getEquivalentBalance());
                equival += u.getRestCharge();
            }
            revenueMap.get(court).equival += equival;
        }

        // 课程统计
        for (var course : courseList) {
            if (course.getCoach() == null || course.getCoach().getIsActive() > 0) {
                String coachName = course.getCoach() != null ? course.getCoach().getName() : "无教练";
                String courtName = course.getCourt() != null ? course.getCourt().getName() : "无校区";
                int courseType = course.getCourseType();
                float duration = course.getDuration();
                int memberQuantities = 0;
                if (course.getSpend() != null) {
                    for (var spend : course.getSpend()) {
                        memberQuantities += spend.getQuantities();
                    }
                }

                // 体验课
                if (courseType < 0) {
                    updateAnalyseResult(analyseMap, coachName, duration, 0, 0, 0, courseType < 0 ? 1 : 0, courseType == -1 ? 1 : 0);
                    updateAnalyseResult(analyseMap, courtName, duration, 0, 0, 0, courseType < 0 ? 1 : 0, courseType == -1 ? 1 : 0);
                }
                // 正式课
                if (courseType > 0) {
                    float members = ((memberQuantities > 1 ? 1 : courseType) * memberQuantities) * 1f;
                    float courses = memberQuantities > 0 ? 1f : 0f;
                    updateAnalyseResult(analyseMap, coachName, duration, courses, members, 0, courseType < 0 ? 1 : 0, courseType == -1 ? 1 : 0);
                    updateAnalyseResult(analyseMap, courtName, duration, courses, members, 0, courseType < 0 ? 1 : 0, courseType == -1 ? 1 : 0);

                    // 校区/教练消课统计
                    if (course.getSpend() != null) {
                        for (var spend : course.getSpend()) {
                            float spendValue = spend.getCharge() == 0F ? spend.getDescription() : spend.getCharge();
                            revenueMap.computeIfAbsent(courtName, k -> new RevenueResult()).spend += spendValue;
                            revenueMap.computeIfAbsent(coachName, k -> new RevenueResult()).spend += spendValue;
                        }
                    }
                }
            }
        }

        // 计算 analyse 字段
        for (var entry : analyseMap.entrySet()) {
            AnalyseResult ar = entry.getValue();
            if (ar.courses > 0) {
                ar.analyse = ar.members / ar.courses;
            }
        }

        // 排序
        List<Map.Entry<String, AnalyseResult>> analyseList = new ArrayList<>(analyseMap.entrySet());
        analyseList.sort((m1, m2) -> Float.compare(m2.getValue().analyse, m1.getValue().analyse));
        total.put("analyse", analyseList);

        // 汇总校区
        for (var entry : revenueMap.entrySet()) {
            if (entry.getKey().contains("校区")) {
                RevenueResult value = entry.getValue();
                totalRevenue.spend += value.spend;
                totalRevenue.charge += value.charge;
                totalRevenue.equival += value.equival;
            }
        }
        revenueMap.put("总共", totalRevenue);

        // 收入排序
        List<Map.Entry<String, RevenueResult>> revenueList = new ArrayList<>(revenueMap.entrySet());
        revenueList.sort((m1, m2) -> Float.compare(m2.getValue().spend, m1.getValue().spend));
        total.put("revenue", revenueList);

        return total;
    }

    // 抽取的更新方法
    private void updateAnalyseResult(Map<String, AnalyseResult> map, String key, float workTime, float courses, float members, float analyse, float trial, float deal) {
        AnalyseResult ar = map.computeIfAbsent(key, k -> new AnalyseResult());
        ar.workTime += workTime;
        ar.courses += courses;
        ar.members += members;
        ar.trial += trial;
        ar.deal += deal;
    }
}
