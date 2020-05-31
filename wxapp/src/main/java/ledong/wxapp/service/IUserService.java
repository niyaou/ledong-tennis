package ledong.wxapp.service;

import java.io.UnsupportedEncodingException;
import java.security.InvalidAlgorithmParameterException;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.Map;

import javax.crypto.BadPaddingException;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.NoSuchPaddingException;

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
     * verified wx
     * 
     * @param token
     * @return
     */
    public String verified(String token);

    /**
     * get phone number
     * 
     * @param sessionKey
     * @param iv
     * @param data
     * @return
     * @throws NoSuchPaddingException
     * @throws NoSuchAlgorithmException
     * @throws InvalidAlgorithmParameterException
     * @throws InvalidKeyException
     * @throws BadPaddingException
     * @throws IllegalBlockSizeException
     * @throws UnsupportedEncodingException
     */
    public String getPhoneNumber(String sessionKey, String iv, String data) throws NoSuchAlgorithmException, NoSuchPaddingException, InvalidKeyException, InvalidAlgorithmParameterException, IllegalBlockSizeException, BadPaddingException, UnsupportedEncodingException;

    /**
     * 
     * @param openId
     * @return
     */
    public String login(String openId, String nickName, String avator, String gps);

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
    public String accessByWxToken(String token, String nickName, String avator, String gps);

    /**
     * 
     * @param object
     * @return
     */
    public HashMap<String, Object> getUserInfo(String object);

    /**
     * 
     * find nearby player
     * 
     * @param gps
     * @return
     */
    public LinkedList<HashMap<String, Object>> getNearyByUser(String gps);

}
