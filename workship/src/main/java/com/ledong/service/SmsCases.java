package com.ledong.service;


import com.ledong.dao.ChargeDAO;
import com.ledong.dao.CourseDAO;
import com.ledong.entity.Course;
import com.tencentcloudapi.common.Credential;
import com.tencentcloudapi.common.exception.TencentCloudSDKException;
import com.tencentcloudapi.common.profile.ClientProfile;
import com.tencentcloudapi.common.profile.HttpProfile;
import com.tencentcloudapi.sms.v20190711.SmsClient;
import com.tencentcloudapi.sms.v20190711.models.SendSmsRequest;
import com.tencentcloudapi.sms.v20190711.models.SendSmsResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;

import java.time.format.DateTimeFormatter;

public class SmsCases {

    @Autowired
    private CourseDAO courseDao;


    private final String ID="1";
    private final String CODE="1";
    private final String SDKAPPID = "1400779674";
    private final String SIGNNAME = "成都乐动精灵体育";
    private final   String TEMPLATEID = "1640539";
    private  SmsClient client;
    public SmsCases(){
        HttpProfile httpProfile = new HttpProfile();
        httpProfile.setReqMethod("POST");
        httpProfile.setConnTimeout(60);
        httpProfile.setEndpoint("sms.tencentcloudapi.com");
        ClientProfile clientProfile = new ClientProfile();
        clientProfile.setSignMethod("HmacSHA256");
        clientProfile.setHttpProfile(httpProfile);
        Credential cred = new Credential(ID, CODE);
        client = new SmsClient(cred, "ap-guangzhou", clientProfile);
    }

        public String sendSms(String number,String[] parmas) throws TencentCloudSDKException {

            /* SDK默认用TC3-HMAC-SHA256进行签名
             * 非必要请不要修改这个字段 */
            SendSmsRequest req = new SendSmsRequest();
            req.setSmsSdkAppid(SDKAPPID);
            req.setSign(SIGNNAME);
            req.setTemplateID(TEMPLATEID);
//            String[] templateParamSet = {"12月14日麓坊校区","次卡5次","50元次卡30年卡100"};
            req.setTemplateParamSet(parmas);
            String[] phoneNumberSet = {"+86"+number };
            req.setPhoneNumberSet(phoneNumberSet);
            SendSmsResponse res = client.SendSms(req);
            var result=SendSmsResponse.toJsonString(res);
            System.out.println(result);
            return result;
        };


    @Transactional(rollbackFor = Exception.class)
    public void notifyCourse(Course course) throws TencentCloudSDKException {
       var members= course.getMember();
       var spends = course.getSpend();
//        DateTimeFormatter dfDate = DateTimeFormatter.ofPattern("MM月dd日HH:mm");
        DateTimeFormatter dfDate = DateTimeFormatter.ofPattern("MM月dd日");
        var startTime = course.getStartTime().format(dfDate);
        var court = course.getCourt().getName();
        var courseStr = startTime;
        for (com.ledong.entity.Spend spend : spends) {
            var charge = spend.getCharge() != 0 ? (spend.getCharge() + "") : "";
            var times = spend.getTimes() != 0 ? (spend.getTimes() + "次") : "";
            var annual = spend.getAnnualTimes() != 0 ? (spend.getAnnualTimes() + "次") : "";
            var spendStr = charge + times + annual;
            var member = spend.getPrepaidCard();
            var rest = member.getRestCharge() + (member.getTimesCount() + member.getAnnualCount()) + "次";
            sendSms(member.getNumber(), new String[]{startTime,court, spendStr,  ""+member.getRestCharge(),""+member.getTimesCount() ,""+member.getAnnualCount()});
        }
        course.setNotified(course.getNotified()+1);
        courseDao.save(course);
    }


}
