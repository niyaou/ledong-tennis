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
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;

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
    public String addCourse(String startTime, String endTime, String coach, Integer isExperience, Integer isDealing, Double spendingTime,
                          Integer courtSpend, Integer coachSpend, String court,HashMap<String,Integer> membersObj) {

        LdCourseVo course = new LdCourseVo();
        course.setStart(startTime);
        course.setEnd(endTime);
        course.setCoach(coach);
        course.setExperience(isExperience);
        course.setAchieved(isDealing);
        course.setSpendingTime(spendingTime);

        course.setCourtSpend(courtSpend);
        course.setCourt(court);
        course.setCoachSpend(coachSpend);

        ArrayList<String> members= new ArrayList<>();
        Integer incoming = 0;
        for(String m : membersObj.keySet()){
            members.add(m);
            incoming+=  membersObj.get(m);
        }
        String[] mA=new String[members.size()];
        course.setMember(members.toArray(mA));
        course.setIncoming(incoming);
        course.setEarned(incoming-coachSpend-courtSpend);
        logger.info(JSON.toJSONString(course));
         String id= SearchApi.insertDocument(DataSetConstant.LD_COURSE_INFORMATION, JSON.toJSONString(course));
         if(TextUtils.isEmpty(id)){
             return null;
         }


        prepaidCardService.settleAccount(id,startTime,spendingTime,membersObj);
        return id;
    }


//    @Override
//    public String addCard(String cardName, String... members) {
//        LdPrePaidCardVo card = new LdPrePaidCardVo();
//        card.setTitle(cardName);
//        if(members!=null){
//            card.setMember(members);
//        }
//        String createTime = DateUtil.getCurrentDate(DateUtil.FORMAT_DATE_TIME);
//        card.setCreateTime(createTime);
//        logger.info(card.toString());
//        String userId = SearchApi.insertDocument(DataSetConstant.LD_PREPAID_CARD_INFORMATION, JSON.toJSONString(card),
//                cardName);
//        logger.info(userId);
//        return userId;
//    }
//
//    @Override
//    public String assignMember(String cardName, String openId) {
//        HashMap<String, Object>  card=  SearchApi.searchById(DataSetConstant.LD_PREPAID_CARD_INFORMATION,cardName);
//        if(card==null){
//            return null;
//        }else{
//            ArrayList<String> member= ( ArrayList<String>) card.get(LdPrePaidCardVo.MEMBER);
//            if(member.indexOf(openId)<0){
//                member.add(openId);
//                String[] newMember =new  String[member.size()];
//                card.put(LdPrePaidCardVo.MEMBER,member.toArray(newMember));
//                return   SearchApi.updateDocument(DataSetConstant.LD_PREPAID_CARD_INFORMATION,JSON.toJSONString(card), cardName);
//            }else{
//                return cardName;
//            }
//
//        }
//    }
}
