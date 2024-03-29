package ledong.wxapp.service.impl;

import VO.LdCourseVo;
import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import ledong.wxapp.auth.JwtToken;
import ledong.wxapp.constant.DataSetConstant;
import ledong.wxapp.search.SearchApi;
import ledong.wxapp.service.ICourseService;
import ledong.wxapp.service.IPrepaidCardService;
import ledong.wxapp.service.IRankService;
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
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

@Service
public class CourseServiceImpl implements ICourseService {


    @Autowired
    private IPrepaidCardService prepaidCardService;

    @Override
    public String addCourse(String startTime, String endTime, String coach, Integer isExperience, Integer isDealing,
                            Double spendingTime, Integer courtSpend, Integer coachSpend, String court, String grade, String descript,
                            HashMap<String, JSONArray> membersObj) {

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
        if (!TextUtils.isEmpty(descript)) {
            course.setDescript(descript);
        }
        ArrayList<String> members = new ArrayList<>();
        Integer incoming = 0;
        Integer incomingTimes = 0;
        for (String m : membersObj.keySet()) {
            members.add(m);
            incoming += (int)membersObj.get(m).get(0);
            incomingTimes += (int)membersObj.get(m).get(1);


        }
        String[] mA = new String[members.size()];
        course.setMember(members.toArray(mA));
        course.setIncoming(incoming+incomingTimes*160);
        course.setIncomingTimes(incomingTimes);
        course.setEarned(incoming+incomingTimes*160 - coachSpend - courtSpend);
        String id = SearchApi.insertDocument(DataSetConstant.LD_COURSE_INFORMATION, JSON.toJSONString(course));
        if (TextUtils.isEmpty(id)) {
            return null;
        }

        prepaidCardService.settleAccount(id, startTime, spendingTime, membersObj);
        return id;
    }

    @Override
    public String uploadCourse(String courseId,String startTime, String endTime) {
       try{
           LdCourseVo course=  JSON.parseObject(JSON.toJSONString(SearchApi.searchById(DataSetConstant.LD_COURSE_INFORMATION,courseId)),
                   LdCourseVo.class);
           course.setStart(startTime);
           course.setEnd(endTime);
           SearchApi.updateDocument(DataSetConstant.LD_COURSE_INFORMATION, JSON.toJSONString(course),courseId);

           return courseId;
       }catch(Exception e){
           return null;
       }

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
                .dateHistogram("intervalDay")
                .field("start") //可以是time
                .calendarInterval(DateHistogramInterval.DAY)
                .order(BucketOrder.key(false))
                .minDocCount(1L)
                .subAggregation(court)
                .subAggregation(coach)
                .subAggregation(incoming)
                .subAggregation(earned);

        DateHistogramAggregationBuilder weekly = AggregationBuilders
                .dateHistogram("intervalWeek")
                .field("start") //可以是time
                .calendarInterval(DateHistogramInterval.WEEK)
                .order(BucketOrder.key(false))
                .minDocCount(1L)
                .subAggregation(court)
                .subAggregation(coach)
                .subAggregation(incoming)
                .subAggregation(earned);


        DateHistogramAggregationBuilder monthly = AggregationBuilders
                .dateHistogram("intervalMonth")
                .field("start") //可以是time
                .calendarInterval(DateHistogramInterval.MONTH)
                .order(BucketOrder.key(false))
                .minDocCount(1L)
                .subAggregation(court)
                .subAggregation(coach)
                .subAggregation(incoming)
                .subAggregation(earned);


        SearchResponse result = SearchApi.dailyFinancialAggs(DataSetConstant.LD_COURSE_INFORMATION, new DateHistogramAggregationBuilder[]{daily, weekly, monthly});
        HashMap<String, Object> dailyMap = new HashMap<String, Object>();

        if (result != null) {
            Aggregation aggD = result.getAggregations().get("intervalDay");
            Aggregation aggW = result.getAggregations().get("intervalWeek");
            Aggregation aggM = result.getAggregations().get("intervalMonth");

            List<? extends Histogram.Bucket> buckets = ((Histogram) aggD).getBuckets();
            dailyMap.put("day", buckets.get(0).getKeyAsString());
            dailyMap.put("aggsD", buckets.get(0).getAggregations().asList());

            List<? extends Histogram.Bucket> bucketsW = ((Histogram) aggW).getBuckets();
            dailyMap.put("week", bucketsW.get(0).getKeyAsString());
            dailyMap.put("aggW", bucketsW.get(0).getAggregations().asList());

            List<? extends Histogram.Bucket> bucketsM = ((Histogram) aggM).getBuckets();
            dailyMap.put("month", bucketsM.get(0).getKeyAsString());
            dailyMap.put("aggM", bucketsM.get(0).getAggregations().asList());


            return dailyMap;

        }


        return null;
    }

}
