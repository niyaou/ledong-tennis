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
import org.springframework.web.multipart.MultipartFile;

public interface IUserService {

    /**
     * create new user
     * 
     * @param user
     * @return
     */
    public String addUser(UserVo user);

    /**
     * create new user ld
     *
     * @param user
     * @return
     */
    public String addLDUser(UserVo user);

    /**
     * create new user ld
     *
     * @param user
     * @return
     */
    public String addLDTeenageUser(String parent, String openId, String name, String avator);

    /**
     *
     * @return
     */
    public Object exploreLDTeenageUser();

    /**
     * upload avator img
     * 
     * @param file
     * @return
     */
    public String updateTeenageAvator(MultipartFile files[]);

    /**
     * verified wx
     * 
     * @param token
     * @return
     */
    public String verified(String token);

    /**
     * verified ld wx
     *
     * @param token
     * @return
     */
    public String ldVerified(String token);

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
    public String getPhoneNumber(String sessionKey, String iv, String data) throws NoSuchAlgorithmException,
            NoSuchPaddingException, InvalidKeyException, InvalidAlgorithmParameterException, IllegalBlockSizeException,
            BadPaddingException, UnsupportedEncodingException;

    /**
     * 
     * @param openId
     * @return
     */
    public String login(String openId, String nickName, String avator, String gps);

    /**
     *
     * @param openId
     * @return
     */
    public String ldLogin(String openId, String nickName, String avator, String gps);

    /**
     *
     * @param keycode
     * @return
     */
    public String adminLogin(String keycode);

    /**
     * set real name
     * 
     * @param openId
     * @param realName
     * @return
     */
    public String ldRealName(String openId, String realName);

    /**
     * 
     * get wx open id
     * 
     * @param token
     * @return
     */
    public String[] getOpenId(String token);

    /**
     *
     * get ld wx open id
     *
     * @param token
     * @return
     */
    public String[] getLDOpenId(String token);

    /**
     * login by wx token ,create account if not existed;
     * 
     * @param token
     * @return
     */
    public String accessByWxToken(String token, String nickName, String avator, String gps);

    /**
     * login by wx token ,create account if not existed;
     *
     * @param token
     * @return
     */
    public String accessByLDWxToken(String token, String nickName, String avator, String gps);

    /**
     * 
     * @param object
     * @return
     */
    public HashMap<String, Object> getUserInfo(String object);

    /**
     *
     * @param object
     * @return
     */
    public HashMap<String, Object> getLDUserInfo(String object);

    /**
     * 
     * find nearby player
     * 
     * @param gps
     * @return
     */
    public LinkedList<HashMap<String, Object>> getNearyByUser(String gps);

    /**
     * get user information by master
     * 
     * @return
     */
    public LinkedList<HashMap<String, Object>> getUserList();

    /**
     * get user information by master
     * 
     * @return
     */
    public LinkedList<HashMap<String, Object>> getLDUserList();

    /**
     * search user by name
     * 
     * @param name
     * @return
     */
    public LinkedList<HashMap<String, Object>> getLDUsersByName(String name);

    /**
     * search user by type
     * 
     * @param types
     * @return
     */
    public LinkedList<HashMap<String, Object>> getLDUsersByType(Object types);
}
