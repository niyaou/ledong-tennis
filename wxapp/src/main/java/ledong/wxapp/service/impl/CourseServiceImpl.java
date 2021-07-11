package ledong.wxapp.service.impl;

import VO.LdCourseVo;
import VO.LdPrePaidCardVo;
import com.alibaba.fastjson.JSON;
import ledong.wxapp.auth.JwtToken;
import ledong.wxapp.constant.DataSetConstant;
import ledong.wxapp.search.SearchApi;
import ledong.wxapp.service.ICourseService;
import ledong.wxapp.service.IPrepaidCardService;
import ledong.wxapp.service.IRankService;
import ledong.wxapp.utils.DateUtil;
import org.apache.http.util.TextUtils;
import org.apache.log4j.Logger;
import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.search.aggregations.Aggregation;
import org.elasticsearch.search.aggregations.AggregationBuilders;
import org.elasticsearch.search.aggregations.BucketOrder;
import org.elasticsearch.search.aggregations.bucket.histogram.DateHistogramAggregationBuilder;
import org.elasticsearch.search.aggregations.bucket.histogram.DateHistogramInterval;
import org.elasticsearch.search.aggregations.bucket.histogram.Histogram;
import org.elasticsearch.search.aggregations.metrics.SumAggregationBuilder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;

@Service
public class CourseServiceImpl implements ICourseService {
    private static Logger logger = Logger.getLogger(ICourseService.class);

    @Autowired
    private JwtToken jwtToken;

    @Autowired
    private IRankService rankService;

    @Autowired
    private IPrepaidCardService prepaidCardService;

    @Override
    public String addCourse(String startTime, String endTime, String coach, Integer isExperience, Integer isDealing,
            Double spendingTime, Integer courtSpend, Integer coachSpend, String court,String grade,String descript,
            HashMap<String, Integer> membersObj) {

        LdCourseVo course = new LdCourseVo();
        course.setStart(startTime);
        course.setEnd(endTime);
        course.setCoach(coach);
        course.setExperience(isExperience);
        course.setAchieved(isDealing);
        course.setSpendingTime(spendingTime);
        course.setCourtSpend(courtSpend);
        course.setCourt(court);
        course.setGrade(grade);
        course.setCoachSpend(coachSpend);

        ArrayList<String> members = new ArrayList<>();
        Integer incoming = 0;
        for (String m : membersObj.keySet()) {
            members.add(m);
            incoming += membersObj.get(m);
        }
        String[] mA = new String[members.size()];
        course.setMember(members.toArray(mA));
        course.setIncoming(incoming);
        course.setEarned(incoming - coachSpend - courtSpend);
        logger.info(JSON.toJSONString(course));
        String id = SearchApi.insertDocument(DataSetConstant.LD_COURSE_INFORMATION, JSON.toJSONString(course));
        if (TextUtils.isEmpty(id)) {
            return null;
        }

        prepaidCardService.settleAccount(id, startTime, spendingTime, membersObj);
        return id;
    }

    @Override
    public String courseLogs(String cardId, String startTime, String endTime) {

        return null;
    }

    @Override
    public LdCourseVo getCourseById(String courseId) {

        HashMap<String, Object> vo = SearchApi.searchById(DataSetConstant.LD_COURSE_INFORMATION, courseId);
        if (vo == null) {
            return null;
        }
        return JSON.parseObject(JSON.toJSONString(vo), LdCourseVo.class);
    }


    @Override
    public Object dailyStatistics() {

        SumAggregationBuilder court = AggregationBuilders.sum(LdCourseVo.COURTSPEND)
                .field(LdCourseVo.COURTSPEND);

        SumAggregationBuilder coach = AggregationBuilders.sum(LdCourseVo.COACHSPEND)
                .field(LdCourseVo.COACHSPEND);

        SumAggregationBuilder incoming = AggregationBuilders.sum(LdCourseVo.INCOMING)
                .field(LdCourseVo.INCOMING);

        SumAggregationBuilder earned = AggregationBuilders.sum(LdCourseVo.EARNED)
                .field(LdCourseVo.EARNED);


        DateHistogramAggregationBuilder daily = AggregationBuilders
                .dateHistogram("intervalTime")
                .field("start") //可以是time
                .calendarInterval(DateHistogramInterval.DAY)
                .order(BucketOrder.key(false))
                .minDocCount(1L)
                .subAggregation(court)
                .subAggregation(coach)
                .subAggregation(incoming)
                .subAggregation(earned);

        SearchResponse result = SearchApi.dailyFinancialAggs(DataSetConstant.LD_COURSE_INFORMATION, daily);
HashMap<String ,Object> dailyMap=new HashMap<String ,Object>();

        if (result != null) {
            Aggregation agg = result.getAggregations().get("intervalTime");

            List<? extends Histogram.Bucket> buckets = ((Histogram) agg).getBuckets();
            dailyMap.put("day",buckets.get(0).getKeyAsString());
            dailyMap.put("aggs", buckets.get(0).getAggregations().asList());
//            for (Histogram.Bucket bucket : buckets) {
//                bucket.getAggregations();
//
//            }
            return  dailyMap;

        }


        return null;
    }

}
