package com.ledong.rest;


import com.ledong.bo.SpendBo;
import com.ledong.entity.Course;
import com.ledong.entity.response.CourseResponseDTO;
import com.ledong.service.AnalyseCases;
import com.ledong.service.CardCases;
import com.ledong.service.CourseCases;
import com.ledong.service.SmsCases;
import com.ledong.util.DefaultConverter;
import com.tencentcloudapi.common.Credential;
import com.tencentcloudapi.common.exception.TencentCloudSDKException;
import com.tencentcloudapi.common.profile.ClientProfile;
import com.tencentcloudapi.common.profile.HttpProfile;
import com.tencentcloudapi.sms.v20190711.SmsClient;

import com.tencentcloudapi.sms.v20190711.models.SendSmsRequest;
import com.tencentcloudapi.sms.v20190711.models.SendSmsResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;

import static com.alibaba.druid.sql.ast.SQLPartitionValue.Operator.List;


@RestController
@RequestMapping("/prepaidCard")
@Slf4j
public class PrepaidCardController extends BaseController{

    @Autowired
    private CourseCases courseCases;
    @Autowired
    private CardCases cardCases;
    @Autowired
    private SmsCases smsdCases;
    @Autowired
    private AnalyseCases analyseCases;



    @PostMapping("/course/create")
    public CourseResponseDTO register( @RequestHeader(value = "secure", required = false)String secure,
                                       @RequestParam  String startTime,
                                      @RequestParam String endTime,
                                      @RequestParam   String coachName,
                                      @RequestParam  float spendingTime,
                                      @RequestParam  String courtName,
                                      @RequestParam  String descript,
                                      @RequestParam  int courseType,
                                      @RequestParam  String membersObj){
        verifiedSecure(secure);
        var course = Course.fromBO(courseCases.createCourse(startTime,endTime,coachName,spendingTime,courtName,descript,courseType,membersObj));
        return CourseResponseDTO.builder()
               .build();
    }


    @GetMapping("/spend")
    @ResponseBody
    public Object spend(@RequestParam(required = false)  String number ){
        var spends=cardCases.getSpend(number,1,1000);
        var bos=new ArrayList<>();
        for(var spend : spends){
            var spendBo = DefaultConverter.convert(spend, SpendBo.class);
            bos.add(spendBo);
        }
        return  bos;
    }

    @DeleteMapping("/course/{id}/{member}")
    public CourseResponseDTO removeMember( @RequestHeader(value = "secure", required = false)String secure,@PathVariable("id")Long courseId,@PathVariable("member")String number
                              ){
        verifiedSecure(secure);
       var bo= courseCases.removeCourseMember(courseId,number);
        return CourseResponseDTO.builder()
                .build();
    }

    @DeleteMapping("/course/{id}")
    public CourseResponseDTO removeCourse( @RequestHeader(value = "secure", required = false)String secure,@PathVariable("id")Long courseId
    ){
        verifiedSecure(secure);
        var bo= courseCases.removeCourse(courseId);
        return CourseResponseDTO.builder()
                .build();
    }


    @PostMapping("/course/trial/{id}")
    public CourseResponseDTO trialCourseUpdate( @RequestHeader(value = "secure", required = false)String secure,@PathVariable("id")Long courseId
    ){
        verifiedSecure(secure);
        var bo= courseCases.trialCourseUpdate(courseId);
        return CourseResponseDTO.builder()
                .build();
    }

    @GetMapping("/course/total")
    public Object totalCourse(@RequestParam  String startTime,@RequestParam(required = false) String number,@RequestParam(required = false) Integer pageNum){
        if(StringUtils.hasText(number)){
            return courseCases.memberCourse(startTime,number,1,200);
        }else{
            if(pageNum==null ||pageNum<1){
                pageNum=1;
            }
            return courseCases.totalCourse(startTime,pageNum,500);
        }
    }

    @PostMapping("/course/sm")
    public Object courseSm( @RequestHeader(value = "secure", required = false)String secure,@RequestParam String number,@RequestParam String[] params) throws TencentCloudSDKException {
        verifiedSecure(secure);
       return smsdCases.sendSms(number,params);

    }

    @PostMapping("/course/notify")
    public Object courseNotify( @RequestHeader(value = "secure", required = false)String secure,@RequestParam Long courseId) throws TencentCloudSDKException {
        verifiedSecure(secure);
        return courseCases.notify(courseId);

    }

    @GetMapping("/coach/efficient")
    public Object efficient( @RequestHeader(value = "secure", required = false)String secure,@RequestParam(required = true) String startTime,@RequestParam(required = true) String endTime)   {
        verifiedSecure(secure);
        return analyseCases.analyseEfficiancy( startTime, endTime);

    }


}
