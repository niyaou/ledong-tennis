package ledong.wxapp.service.impl;

import java.util.HashMap;
import java.util.LinkedList;
import java.util.Map;
import java.util.Optional;

import org.apache.http.util.TextUtils;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;

import VO.UserVo;

import ledong.wxapp.auth.JwtToken;
import ledong.wxapp.constant.DataSetConstant;
import ledong.wxapp.search.SearchApi;
import ledong.wxapp.service.IRankService;
import ledong.wxapp.service.IUserService;
import ledong.wxapp.utils.DateUtil;

@Service
public class UserServiceImpl implements IUserService {
    private static Logger logger = Logger.getLogger(UserServiceImpl.class);

    @Value("${wxapp.appid}")
    private String appId;

    @Value("${wxapp.secret}")
    private String appSecret;

    @Autowired
    private JwtToken jwtToken;

    @Autowired
    private IRankService rankService;

    @Override
    public String addUser(UserVo user) {
        String createTime = DateUtil.getCurrentDate(DateUtil.FORMAT_DATE_TIME);
        user.setCreateTime(createTime);
        String userId = SearchApi.insertDocument(DataSetConstant.USER_INFORMATION, JSON.toJSONString(user),
                user.getOpenId());
        Optional.ofNullable(userId).ifPresent(id -> rankService.createRankInfo(user.getOpenId()));
        return userId;
    }

    @Override
    public String login(String openId,String nickName, String avator,String gps) {
        HashMap<String, String> vo = new HashMap<String, String>();
        vo.put(UserVo.OPENID, openId);
        LinkedList<HashMap<String, Object>> loginUser = SearchApi.searchByField(DataSetConstant.USER_INFORMATION,
                UserVo.OPENID, openId, null, null);
        if (loginUser != null) {
            loginUser.getFirst().put(UserVo.NICKNAME, nickName);
            loginUser.getFirst().put(UserVo.AVATOR, avator);
            loginUser.getFirst().put(UserVo.GPS, gps);
            SearchApi.updateDocument(DataSetConstant.USER_INFORMATION,JSON.toJSONString(loginUser.getFirst()),openId);
            return jwtToken.generateToken(openId);
        }
        return null;
    }

    @Override
    public String[] getOpenId(String token) {
        RestTemplate restTemplate = new RestTemplate();
        String url = String.format(
                "https://api.weixin.qq.com/sns/jscode2session?appid=%s&secret=%s&js_code=%s&grant_type=authorization_code",
                appId, appSecret, token);
        logger.error(url);
        try {
            // OpenId openId = restTemplate.getForObject(url, OpenId.class);
            String json = restTemplate.getForObject(url, String.class);
            logger.info(json);

            JSONObject openId = (JSONObject) JSONObject.parse(json);

            return new String[] { openId.getString("openid"), openId.getString("session_key") };
        } catch (RestClientException e) {
            logger.error(e.getMessage());
            return null;
        }

    }

    @Override
    public String accessByWxToken(String token, String nickName, String avator,String gps) {
        String[] userInfo = getOpenId(token);
        userInfo = Optional.ofNullable(userInfo).orElse(new String[] { "" });
        String jwtString = login(userInfo[0],nickName,avator,gps);
        if (TextUtils.isEmpty(jwtString)) {
            UserVo user = new UserVo();
            user.setOpenId(userInfo[0]);
            user.setNickName(nickName);
            user.setAvator(avator);
            user.setGps(gps);
            jwtString = jwtToken.generateToken(addUser(user));
        }
        return jwtString;
    }

    @Override
    public HashMap<String, Object> getUserInfo(String openId) {
        HashMap<String, String> vo = new HashMap<String, String>();
        vo.put(UserVo.OPENID, openId);
        System.out.println(openId);
        LinkedList<HashMap<String, Object>> loginUser = SearchApi.searchByField(DataSetConstant.USER_INFORMATION,
                UserVo.OPENID, openId, null, null);
        if (loginUser != null) {
            return loginUser.get(0);
        }
        return null;
    }

    @Override
    public LinkedList<HashMap<String, Object>> getNearyByUser(String gps) {

        return  SearchApi.searchByLocation(DataSetConstant.USER_INFORMATION, UserVo.GPS, gps,"10");
       
    }
}
