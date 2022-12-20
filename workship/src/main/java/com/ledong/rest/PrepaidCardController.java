package com.ledong.rest;


import com.ledong.bo.SpendBo;
import com.ledong.entity.Course;
import com.ledong.entity.response.CourseResponseDTO;
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
public class PrepaidCardController {

    @Autowired
    private CourseCases courseCases;
    @Autowired
    private CardCases cardCases;
    @Autowired
    private SmsCases smsdCases;



    @PostMapping("/course/create")
    public CourseResponseDTO register(@RequestParam  String startTime,
                                      @RequestParam String endTime,
                                      @RequestParam   String coachName,
                                      @RequestParam  float spendingTime,
                                      @RequestParam  String courtName,
                                      @RequestParam  String descript,
                                      @RequestParam  String membersObj){
        var course = Course.fromBO(courseCases.createCourse(startTime,endTime,coachName,spendingTime,courtName,descript,membersObj));
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
    public CourseResponseDTO removeMember(@PathVariable("id")Long courseId,@PathVariable("member")String number
                              ){
       var bo= courseCases.removeCourseMember(courseId,number);
        return CourseResponseDTO.builder()
                .build();
    }

    @DeleteMapping("/course/{id}")
    public CourseResponseDTO removeCourse(@PathVariable("id")Long courseId
    ){
        var bo= courseCases.removeCourse(courseId);
        return CourseResponseDTO.builder()
                .build();
    }

    @GetMapping("/course/total")
    public Object totalCourse(@RequestParam  String startTime,@RequestParam(required = false) String number,@RequestParam(required = false) Integer pageNum){
        if(StringUtils.hasText(number)){
            return courseCases.memberCourse(startTime,number,1,100);
        }else{
            if(pageNum==null ||pageNum<1){
                pageNum=1;
            }
            return courseCases.totalCourse(startTime,pageNum,500);
        }
    }

    @PostMapping("/course/sm")
    public Object courseSm(@RequestParam String number,@RequestParam String[] params) throws TencentCloudSDKException {
       return smsdCases.sendSms(number,params);

    }

    @PostMapping("/course/notify")
    public Object courseNotify(@RequestParam Long courseId) throws TencentCloudSDKException {
        return courseCases.notify(courseId);

    }


}
