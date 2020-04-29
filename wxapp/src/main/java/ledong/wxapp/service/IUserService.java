package ledong.wxapp.service;

import java.util.HashMap;
import java.util.LinkedList;
import java.util.Map;

import VO.UserVo;

public interface IUserService {

    /**
     * create new user
     * 
     * @param user
     * @return
     */
    public String addUser(UserVo user);

    /**
     * 
     * @param openId
     * @return
     */
    public String login(String openId,String nickName, String avator,String gps);


    /**
     * 
     * get wx open id
     * 
     * @param token
     * @return
     */
    public String[] getOpenId(String token);


    /**
     * login by wx token ,create account if not existed;
     * 
     * @param token
     * @return
     */
    public String accessByWxToken(String token,String nickName,String avator,String gps);


    /**
     * 
     * @param openId
     * @return
     */
    public HashMap<String, Object> getUserInfo(String openId);



    /**
     * 
     * find nearby player 
     * 
     * @param gps
     * @return
     */
    public LinkedList<HashMap<String, Object>> getNearyByUser(String gps);


   
}
