package com.ledong.service;

import cn.hutool.core.date.DateUtil;
import com.ledong.dao.*;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.*;
import java.util.concurrent.*;
import java.util.stream.Collectors;


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

    // 线程池，用于并行处理任务
    private final ExecutorService executorService = Executors.newFixedThreadPool(
        Runtime.getRuntime().availableProcessors()
    );

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
        var total = new ConcurrentHashMap<String, Object>();
        
        // 一次性加载所有需要的数据，避免在循环中查询数据库
        var course = courseDao.findAllWithTimeRange(DateUtil.parse(startTime).toLocalDateTime(), DateUtil.parse(endTime).toLocalDateTime());
        var charge = chargeDao.findAllWithTimeRange(DateUtil.parse(startTime).toLocalDateTime(), DateUtil.parse(endTime).toLocalDateTime());
        
        // 一次性查询所有用户，避免N+1问题
        var allUsers = userDao.findAll();
        
        // 按校区分组用户，提前在内存中建立索引
        var usersByCourtMap = allUsers.stream()
            .collect(Collectors.groupingBy(
                user -> user.getCourt(),
                ConcurrentHashMap::new,
                Collectors.toList()
            ));

        // 使用线程安全的Map
        var analys = new ConcurrentHashMap<String, ConcurrentHashMap<String, Float>>();
        var revenue = new ConcurrentHashMap<String, ConcurrentHashMap<String, Float>>();

        try {
            // 1. 处理充值数据（校区和教练充值统计）
            processChargeData(charge, revenue);

            // 2. 计算等价余额 - 传入预加载的用户分组数据
            calculateEquivalentBalance(revenue, usersByCourtMap);

            // 3. 处理课程数据（体验课和正式课）- 使用并行流
            processCourseData(course, analys, revenue);

            // 4和5可以并行执行：排序分析数据 和 计算总营收
            CompletableFuture<ArrayList> analysisFuture = CompletableFuture.supplyAsync(
                () -> sortAnalysisData(analys), executorService
            );

            CompletableFuture<ConcurrentHashMap<String, Float>> revenueFuture = CompletableFuture.supplyAsync(
                () -> calculateTotalRevenue(revenue), executorService
            );

            // 等待两个任务完成
            var entrylist = analysisFuture.get();
            var totalMap = revenueFuture.get();

            total.put("analyse", entrylist);

            // 6. 对营收数据进行排序
            var revenuelist = sortRevenueData(revenue);
            total.put("revenue", revenuelist);

            return total;
        } catch (InterruptedException | ExecutionException e) {
            throw new RuntimeException("并行处理效率分析数据时出错", e);
        }
    }

    /**
     * 处理充值数据，统计校区和教练的充值金额
     */
    private void processChargeData(List charge, ConcurrentHashMap<String, ConcurrentHashMap<String, Float>> revenue) {
        charge.parallelStream().filter(member->member.getCoach()==null || member.getCoach().getIsActive()>0).forEach(charge1 -> {
            // 统计校区充值
            revenue.compute(charge1.getCourt(), (k, court) -> {
                if (court == null) {
                    court = new ConcurrentHashMap<>();
                    court.put("charge", charge1.getCharge() == 0f ? charge1.getWorth() : charge1.getCharge());
                    court.put("equival", 0f);
                } else {
                    court.merge("charge", charge1.getCharge() == 0f ? charge1.getWorth() : charge1.getCharge(), Float::sum);
                }
                return court;
            });

            // 统计教练充值
            if (charge1.getCoach() != null) {
                revenue.compute(charge1.getCoach().getName(), (k, coach) -> {
                    if (coach == null) {
                        coach = new ConcurrentHashMap<>();
                        coach.put("equival", 0f);
                        coach.put("spend", 0f);
                        coach.put("charge", charge1.getCharge() == 0f ? charge1.getWorth() : charge1.getCharge());
                    } else {
                        coach.merge("charge", charge1.getCharge() == 0f ? charge1.getWorth() : charge1.getCharge(), Float::sum);
                    }
                    return coach;
                });
            }
        });
    }

    /**
     * 计算每个校区用户的等价余额 - 使用预加载数据，避免N+1查询
     */
    private void calculateEquivalentBalance(
            ConcurrentHashMap<String, ConcurrentHashMap<String, Float>> revenue,
            ConcurrentHashMap<String, List> usersByCourtMap) {
        
        revenue.keySet().parallelStream().forEach(court -> {
            // 从预加载的Map中获取用户列表，避免数据库查询
            var users = usersByCourtMap.getOrDefault(court, Collections.emptyList());
            
            // 并行计算该校区所有用户的等价余额
            float equival = users.parallelStream()
                .map(u -> (float)u.getEquivalentBalance() + u.getRestCharge())
                .reduce(0f, Float::sum);
            
            revenue.compute(court, (k, _court) -> {
                if (_court == null) {
                    _court = new ConcurrentHashMap<>();
                    _court.put("equival", equival);
                } else {
                    _court.merge("equival", equival, Float::sum);
                }
                return _court;
            });
        });
    }

    /**
     * 处理课程数据（包括体验课和正式课）- 使用并行流
     */
    private void processCourseData(List course, ConcurrentHashMap<String, ConcurrentHashMap<String, Float>> analys, ConcurrentHashMap<String, ConcurrentHashMap<String, Float>> revenue) {
        course.parallelStream().filter(c->c.getCoach()==null||c.getCoach().getIsActive()>0).forEach(course1 -> {
            // 处理体验课
            if (course1.getCourseType() < 0) {
                processTrialCourse(course1, analys);
            }
            // 处理正式课
            if (course1.getCourseType() > 0) {
                processFormalCourse(course1, analys, revenue);
            }
        });
    }

    /**
     * 处理体验课数据 - 线程安全
     */
    private void processTrialCourse(Object course1, ConcurrentHashMap<String, ConcurrentHashMap<String, Float>> analys) {
        // 统计教练的满班率
        analys.compute(course1.getCoach().getName(), (k, coach) -> {
            if (coach == null) {
                coach = new ConcurrentHashMap<>();
                coach.put("workTime", course1.getDuration());
                coach.put("courses", 0F);
                coach.put("members", 0f);
                coach.put("analyse", 0f);
                coach.put("trial", course1.getCourseType() < 0f ? 1f : 0f);
                coach.put("deal", course1.getCourseType() == -1f ? 1f : 0f);
            } else {
                coach.merge("workTime", course1.getDuration(), Float::sum);
                coach.merge("trial", course1.getCourseType() < 0f ? 1f : 0f, Float::sum);
                coach.merge("deal", course1.getCourseType() == -1f ? 1f : 0f, Float::sum);
            }
            return coach;
        });

        // 统计校区的满班率
        analys.compute(course1.getCourt().getName(), (k, school) -> {
            if (school == null) {
                school = new ConcurrentHashMap<>();
                school.put("workTime", course1.getDuration());
                school.put("courses", 0F);
                school.put("members", 0f);
                school.put("analyse", 0f);
                school.put("trial", course1.getCourseType() < 0f ? 1f : 0f);
                school.put("deal", course1.getCourseType() == -1f ? 1f : 0f);
            } else {
                school.merge("workTime", course1.getDuration(), Float::sum);
                school.merge("trial", course1.getCourseType() < 0f ? 1f : 0f, Float::sum);
                school.merge("deal", course1.getCourseType() == -1f ? 1f : 0f, Float::sum);
            }
            return school;
        });
    }

    /**
     * 处理正式课数据 - 优化后避免重复计算
     */
    private void processFormalCourse(Object course1, ConcurrentHashMap<String, ConcurrentHashMap<String, Float>> analys, ConcurrentHashMap<String, ConcurrentHashMap<String, Float>> revenue) {
        var spends = course1.getSpend();
        
        // 一次性计算所有需要的值，避免重复遍历
        var memberQuantities = calculateMemberQuantities(spends);
        var totalSpend = calculateTotalSpend(spends);
        
        // 由于课程本身已经使用并行流处理，这里按顺序执行即可
        // 更新校区和教练的消课金额（使用预计算的totalSpend）
        updateCourtSpend(course1, revenue, totalSpend);
        updateCoachSpend(course1, revenue, totalSpend);
        
        // 更新分析数据
        processCoachAnalysis(course1, analys, memberQuantities);
        processSchoolAnalysis(course1, analys, memberQuantities);
    }
    
    /**
     * 计算总消费金额 - 提取公共方法避免重复计算
     */
    private float calculateTotalSpend(List spends) {
        return spends.stream()
            .map(spend1 -> spend1.getCharge() == 0F ? spend1.getDescription() : spend1.getCharge())
            .reduce(0f, Float::sum);
    }
    
    /**
     * 更新校区消费金额
     */
    private void updateCourtSpend(Object course1, ConcurrentHashMap<String, ConcurrentHashMap<String, Float>> revenue, float totalSpend) {
        revenue.compute(course1.getCourt().getName(), (k, court) -> {
            if (court == null) {
                court = new ConcurrentHashMap<>();
                court.put("spend", totalSpend);
            } else {
                court.merge("spend", totalSpend, Float::sum);
            }
            return court;
        });
    }
    
    /**
     * 更新教练消费金额
     */
    private void updateCoachSpend(Object course1, ConcurrentHashMap<String, ConcurrentHashMap<String, Float>> revenue, float totalSpend) {
        revenue.compute(course1.getCoach().getName(), (k, coachRevenue) -> {
            if (coachRevenue == null) {
                coachRevenue = new ConcurrentHashMap<>();
                coachRevenue.put("spend", totalSpend);
                coachRevenue.put("charge", 0f);
            } else {
                coachRevenue.merge("spend", totalSpend, Float::sum);
            }
            return coachRevenue;
        });
    }

    /**
     * 计算课程的会员数量 - 使用流式计算优化
     */
    private int calculateMemberQuantities(List spends) {
        return spends.stream()
            .mapToInt(spend -> spend.getQuantities())
            .sum();
    }

    /**
     * 统计教练满班率 - 线程安全
     */
    private void processCoachAnalysis(Object course1, ConcurrentHashMap<String, ConcurrentHashMap<String, Float>> analys, int memberQuantities) {
        analys.compute(course1.getCoach().getName(), (k, coach) -> {
            if (coach == null) {
                coach = new ConcurrentHashMap<>();
                coach.put("workTime", course1.getDuration());
                if(memberQuantities>0){
                    coach.put("courses", 1F);
                    coach.put("members", ((memberQuantities>1?1:course1.getCourseType()) *memberQuantities)* 1F);
                }else{
                    coach.put("courses", 0F);
                    coach.put("members",0f);
                }
                coach.put("analyse",0f);
                coach.put("trial", course1.getCourseType() < 0f ? 1f : 0f);
                coach.put("deal", course1.getCourseType() == -1f ? 1f : 0f);
            } else {
                coach.merge("workTime", course1.getDuration(), Float::sum);
                if(memberQuantities>0){
                    coach.merge("courses", 1F, Float::sum);
                    coach.merge("members", ((memberQuantities>1?1:course1.getCourseType()) *memberQuantities) * 1F, Float::sum);
                    coach.put("analyse", coach.get("members") / coach.get("courses"));
                }
                coach.merge("trial", course1.getCourseType() < 0f ? 1f : 0f, Float::sum);
                coach.merge("deal", course1.getCourseType() == -1f ? 1f : 0f, Float::sum);
            }
            return coach;
        });
    }

    /**
     * 统计校区满班率 - 线程安全
     */
    private void processSchoolAnalysis(Object course1, ConcurrentHashMap<String, ConcurrentHashMap<String, Float>> analys, int memberQuantities) {
        analys.compute(course1.getCourt().getName(), (k, school) -> {
            if (school == null) {
                school = new ConcurrentHashMap<>();
                float members = ((memberQuantities>1?1:course1.getCourseType()) *memberQuantities)* 1F;
                school.put("workTime", course1.getDuration());
                school.put("courses", 1F);
                school.put("members", members);
                school.put("analyse", members);
                school.put("trial", course1.getCourseType() < 0f ? 1f : 0f);
                school.put("deal", course1.getCourseType() == -1f ? 1f : 0f);
            } else {
                school.merge("workTime", course1.getDuration(), Float::sum);
                school.merge("courses", 1F, Float::sum);
                school.merge("members", ((memberQuantities>1?1:course1.getCourseType()) *memberQuantities) * 1F, Float::sum);
                school.put("analyse", school.get("members") / school.get("courses"));
                school.merge("trial", course1.getCourseType() < 0f ? 1f : 0f, Float::sum);
                school.merge("deal", course1.getCourseType() == -1f ? 1f : 0f, Float::sum);
            }
            return school;
        });
    }

    /**
     * 对分析数据进行排序
     */
    private ArrayList sortAnalysisData(ConcurrentHashMap<String, ConcurrentHashMap<String, Float>> analys) {
        var entrylist = new ArrayList<>(analys.entrySet());
        Collections.sort(entrylist, ((m1, m2) -> {
            return (int) ((m2.getValue().get("analyse")==null?0:m2.getValue().get("analyse")) * 100 - (m1.getValue().get("analyse")==null?0:m1.getValue().get("analyse") )* 100);
        }));
        return entrylist;
    }

    /**
     * 计算总营收 - 使用并行流
     */
    private ConcurrentHashMap<String, Float> calculateTotalRevenue(ConcurrentHashMap<String, ConcurrentHashMap<String, Float>> revenue) {
        var totalMap = new ConcurrentHashMap<String, Float>();
        totalMap.put("spend", 0f);
        totalMap.put("charge", 0f);
        totalMap.put("equival", 0f);

        // 使用并行流计算总和
        revenue.entrySet().parallelStream()
            .filter(entry -> entry.getKey().contains("校区"))
            .forEach(entry -> {
                var value = entry.getValue();
                totalMap.merge("spend", value.get("spend") == null ? 0 : value.get("spend"), Float::sum);
                totalMap.merge("charge", value.get("charge") == null ? 0 : value.get("charge"), Float::sum);
                totalMap.merge("equival", value.get("equival") == null ? 0 : value.get("equival"), Float::sum);
            });
        
        revenue.put("总共", totalMap);
        return totalMap;
    }

    /**
     * 对营收数据进行排序
     */
    private ArrayList sortRevenueData(ConcurrentHashMap<String, ConcurrentHashMap<String, Float>> revenue) {
        var revenuelist = new ArrayList<>(revenue.entrySet());
        Collections.sort(revenuelist, ((m1, m2) -> {
            return (int) ((m2.getValue().get("spend") == null ? 0 : m2.getValue().get("spend")) * 100 - (m1.getValue().get("spend") == null ? 0 : m1.getValue().get("spend")) * 100);
        }));
        return revenuelist;
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
