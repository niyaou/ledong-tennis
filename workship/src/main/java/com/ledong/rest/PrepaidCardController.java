package com.ledong.rest;


import com.ledong.entity.Course;
import com.ledong.entity.response.CourseResponseDTO;
import com.ledong.service.CardCases;
import com.ledong.service.CourseCases;
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


@RestController
@RequestMapping("/prepaidCard")
@Slf4j
public class PrepaidCardController {

    @Autowired
    private CourseCases courseCases;
    @Autowired
    private CardCases cardCases;


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
        return  cardCases.getSpend(number,1,1000);

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
            return courseCases.totalCourse(startTime,pageNum,1000);
        }

    }

    @PostMapping("/course/sm")
    public Object courseSm(@RequestParam String number) throws TencentCloudSDKException {
        var id="1";
        var key="2";
        Credential cred = new Credential(id, key);
        HttpProfile httpProfile = new HttpProfile();
        httpProfile.setReqMethod("POST");
        httpProfile.setConnTimeout(60);
        httpProfile.setEndpoint("sms.tencentcloudapi.com");
        ClientProfile clientProfile = new ClientProfile();
        /* SDK默认用TC3-HMAC-SHA256进行签名
         * 非必要请不要修改这个字段 */
        clientProfile.setSignMethod("HmacSHA256");
        clientProfile.setHttpProfile(httpProfile);
        SmsClient client = new SmsClient(cred, "ap-guangzhou",clientProfile);
        SendSmsRequest req = new SendSmsRequest();
        String sdkAppId = "1400779674";
        req.setSmsSdkAppid(sdkAppId);
        String signName = "成都乐动精灵体育";
        req.setSign(signName);
        String templateId = "1639069";
        req.setTemplateID(templateId);
        String[] templateParamSet = {"12月14日麓坊校区","次卡5次","50元次卡30年卡100"};
        req.setTemplateParamSet(templateParamSet);
        String[] phoneNumberSet = {"+86"+number };
        req.setPhoneNumberSet(phoneNumberSet);
        SendSmsResponse res = client.SendSms(req);
        System.out.println(SendSmsResponse.toJsonString(res));
       return null;

    }

}
