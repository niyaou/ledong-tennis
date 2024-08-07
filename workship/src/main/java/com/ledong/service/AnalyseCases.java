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
}
