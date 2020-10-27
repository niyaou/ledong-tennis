package ledong.wxapp.service.impl;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.security.AlgorithmParameters;
import java.security.InvalidAlgorithmParameterException;
import java.security.InvalidKeyException;
import java.security.Key;
import java.security.NoSuchAlgorithmException;
import java.security.Security;
import java.text.Collator;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.Locale;
import java.util.Optional;

import javax.crypto.BadPaddingException;
import javax.crypto.Cipher;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.KeyGenerator;
import javax.crypto.NoSuchPaddingException;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.SecretKeySpec;

import org.apache.commons.codec.binary.Base64;
import org.apache.http.util.TextUtils;
import org.apache.log4j.Logger;
import org.bouncycastle.jce.provider.BouncyCastleProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;

import VO.UserVo;
import ledong.wxapp.auth.JwtToken;
import ledong.wxapp.constant.CommonConstanst;
import ledong.wxapp.constant.DataSetConstant;
import ledong.wxapp.search.SearchApi;
import ledong.wxapp.service.IRankService;
import ledong.wxapp.service.IUserService;
import ledong.wxapp.utils.DateUtil;

@Service
public class UserServiceImpl implements IUserService {
    private static Logger logger = Logger.getLogger(UserServiceImpl.class);
    private static String KEY_NAME = "AES";
    public static final String CIPHER_ALGORITHM = "AES/CBC/PKCS7Padding";
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
        logger.info(JSON.toJSONString(user));
        try {
            if (user.getGps().contains("undefined")) {
                user.setGps(CommonConstanst.GPS);
            }
        } catch (Exception e) {

        }

        String userId = SearchApi.insertDocument(DataSetConstant.USER_INFORMATION, JSON.toJSONString(user),
                user.getOpenId());
        Optional.ofNullable(userId).ifPresent(id -> rankService.createRankInfo(user.getOpenId()));
        return userId;
    }

    @Override
    public String login(String openId, String nickName, String avator, String gps) {
        HashMap<String, String> vo = new HashMap<String, String>();
        vo.put(UserVo.OPENID, openId);
        LinkedList<HashMap<String, Object>> loginUser = SearchApi.searchByField(DataSetConstant.USER_INFORMATION,
                UserVo.OPENID, openId, null, null);
        if (loginUser != null) {
            loginUser.getFirst().put(UserVo.NICKNAME, nickName);
            loginUser.getFirst().put(UserVo.AVATOR, avator);
            if (!gps.contains("undefined")) {
                loginUser.getFirst().put(UserVo.GPS, gps);
            }
            SearchApi.updateDocument(DataSetConstant.USER_INFORMATION, JSON.toJSONString(loginUser.getFirst()), openId);
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
        try {
            // OpenId openId = restTemplate.getForObject(url, OpenId.class);
            String json = restTemplate.getForObject(url, String.class);

            JSONObject openId = (JSONObject) JSONObject.parse(json);

            return new String[] { openId.getString("openid"), openId.getString("session_key") };
        } catch (RestClientException e) {
            return null;
        }
    }

    @Override
    public String accessByWxToken(String token, String nickName, String avator, String gps) {
        // String[] userInfo = getOpenId(token);
        // userInfo = Optional.ofNullable(userInfo).orElse(new String[] { "" });
        String jwtString = login(token, nickName, avator, gps);
        if (TextUtils.isEmpty(jwtString)) {
            UserVo user = new UserVo();
            user.setOpenId(token);
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
        LinkedList<HashMap<String, Object>> loginUser = SearchApi.searchByField(DataSetConstant.USER_INFORMATION,
                UserVo.OPENID, openId, null, null);
        if (loginUser != null) {
            return loginUser.get(0);
        }
        return null;
    }

    @Override
    public LinkedList<HashMap<String, Object>> getNearyByUser(String gps) {

        return SearchApi.searchByLocation(DataSetConstant.USER_INFORMATION, UserVo.GPS, gps, "50",10);

    }

    @Override
    public String verified(String token) {
        String[] userInfo = getOpenId(token);
        return userInfo == null ? null : userInfo[1];
    }

    @Override
    public String getPhoneNumber(String sessionKey, String iv, String data) throws NoSuchAlgorithmException,
            NoSuchPaddingException, InvalidKeyException, InvalidAlgorithmParameterException, IllegalBlockSizeException,
            BadPaddingException, UnsupportedEncodingException {

        String json = null;
        byte[] encrypted64 = Base64.decodeBase64(data);
        byte[] key64 = Base64.decodeBase64(sessionKey);
        byte[] iv64 = Base64.decodeBase64(iv);

        try {
            init();
            json = new String(decrypt(encrypted64, key64, generateIV(iv64)));
        } catch (Exception e) {
            logger.info("解密微信手机号失败:" + e.getMessage());
        }
        return json;

    }

    /**
     * 初始化密钥
     */
    public void init() throws Exception {

        Security.addProvider(new BouncyCastleProvider());
        KeyGenerator.getInstance(KEY_NAME).init(128);
    }

    /**
     * 生成iv
     */
    public AlgorithmParameters generateIV(byte[] iv) throws Exception {
        // iv 为一个 16 字节的数组，这里采用和 iOS 端一样的构造方法，数据全为0
        // Arrays.fill(iv, (byte) 0x00);
        AlgorithmParameters params = AlgorithmParameters.getInstance(KEY_NAME);
        params.init(new IvParameterSpec(iv));
        return params;
    }

    /**
     * 生成解密
     */
    public byte[] decrypt(byte[] encryptedData, byte[] keyBytes, AlgorithmParameters iv) throws Exception {
        Key key = new SecretKeySpec(keyBytes, KEY_NAME);
        Cipher cipher = Cipher.getInstance(CIPHER_ALGORITHM);
        // 设置为解密模式
        cipher.init(Cipher.DECRYPT_MODE, key, iv);
        return cipher.doFinal(encryptedData);
    }

    @Override
    public LinkedList<HashMap<String, Object>> getUserList() {
        try {
            LinkedList<HashMap<String, Object>> userlist= SearchApi.searchAll(DataSetConstant.USER_INFORMATION, 0, 400);
            if (userlist!=null){
                // userlist.stream().sorted(Collator.getInstance(Locale.CHINESE).compare(o1, o2));
                userlist.sort((HashMap<String, Object>o1,HashMap<String, Object>o2)->{
                    return Collator.getInstance(Locale.CHINESE).compare(o1.get(UserVo.NICKNAME), o2.get(UserVo.NICKNAME));
                });
            }
          return  userlist;
        } catch (IOException e) {
       
            e.printStackTrace();
        }
        return null;
    }

}
