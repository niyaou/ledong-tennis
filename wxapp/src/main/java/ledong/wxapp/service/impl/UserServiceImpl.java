package ledong.wxapp.service.impl;

import java.io.File;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.security.AlgorithmParameters;
import java.security.InvalidAlgorithmParameterException;
import java.security.InvalidKeyException;
import java.security.Key;
import java.security.NoSuchAlgorithmException;
import java.security.Security;
import java.text.Collator;
import java.util.*;

import javax.crypto.BadPaddingException;
import javax.crypto.Cipher;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.KeyGenerator;
import javax.crypto.NoSuchPaddingException;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.SecretKeySpec;

import VO.LdRankInfoVo;
import VO.RankInfoVo;
import org.apache.commons.codec.binary.Base64;
import org.apache.http.util.TextUtils;
import org.apache.log4j.Logger;


import com.google.common.io.Files;
import org.bouncycastle.jce.provider.BouncyCastleProvider;
import org.elasticsearch.search.sort.SortOrder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.DigestUtils;
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
import org.springframework.web.multipart.MultipartFile;

@Service
public class UserServiceImpl implements IUserService {
    private static Logger logger = Logger.getLogger(UserServiceImpl.class);
    private static String KEY_NAME = "AES";
    public static final String CIPHER_ALGORITHM = "AES/CBC/PKCS7Padding";
    @Value("${file.upload.url}")
    private String uploadFilePath;
    @Value("${wxapp.appid}")
    private String appId;

    @Value("${wxapp.secret}")
    private String appSecret;

    @Value("${wxapp.ld.appid}")
    private String ldAppId;

    @Value("${wxapp.ld.secret}")
    private String ldAppSecret;

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
    public String addLDUser(UserVo user) {
        String createTime = DateUtil.getCurrentDate(DateUtil.FORMAT_DATE_TIME);
        user.setCreateTime(createTime);
        try {
            if (user.getGps().contains("undefined")) {
                user.setGps(CommonConstanst.GPS);
            }
        } catch (Exception e) {

        }

        String userId = SearchApi.insertDocument(DataSetConstant.LD_USER_INFORMATION, JSON.toJSONString(user),
                user.getOpenId());
        Optional.ofNullable(userId).ifPresent(id -> rankService.createLDRankInfo(user.getOpenId()));
        return userId;
    }

    @Override
    public String updateTeenageAvator(MultipartFile files[]) {

        String fileName = files[0].getOriginalFilename();//获取文件名称
        String suffixName=fileName.substring(fileName.lastIndexOf("."));//获取文件后缀
        try {
            fileName=DigestUtils.md5DigestAsHex(files[0].getInputStream())+suffixName;
        } catch (IOException e) {
            e.printStackTrace();
            return "";
        }
        String directory=uploadFilePath;
        File targetFile = new File(directory,fileName);
        try {
            Files.write(files[0].getBytes(),targetFile);
            return fileName;
        } catch (Exception e) {
            e.printStackTrace();
            return "";
        }
    }



    @Override
    public String addLDTeenageUser(String  parent,String  openId,String name,String avator) {
        logger.info(openId+name+avator);
        UserVo user =new UserVo();
        String createTime = DateUtil.getCurrentDate(DateUtil.FORMAT_DATE_TIME);
        user.setCreateTime(createTime);
        user.setAvator(avator);
        user.setNickName(name);
        user.setOpenId(openId);
        logger.info(user.toString());
        try {
            if (user.getGps().contains("undefined")) {
                user.setGps(CommonConstanst.GPS);
            }
        } catch (Exception e) {
            logger.info("get gps error");
        }
        String userId = SearchApi.insertDocument(DataSetConstant.LD_USER_INFORMATION, JSON.toJSONString(user),
                openId);
                logger.info(userId);
        Optional.ofNullable(openId).ifPresent(id -> {
            logger.info("before create tennage");
            rankService.createLDTeenageRankInfo(parent,openId);
            logger.info("after create tennage");
        });
        logger.info("after create tennage   2"+userId);
        return userId;
    }


    @Override
    public Object exploreLDTeenageUser(){
        HashMap<String, HashMap<String, Object>> users = SearchApi.searchByFieldSortedInMap(
                DataSetConstant.LD_USER_RANK_INFORMATION, LdRankInfoVo.CLUBID, String.valueOf(LdRankInfoVo.TEENAGE), RankInfoVo.SCORE, SortOrder.DESC, 0, 500);
        List<HashMap<String, Object>> result = new ArrayList<>();
        if (users != null) {
            String[] idsArr = new String[users.size()];
            List<String> ids = new ArrayList<String>();
            for (String key : users.keySet()) {
                ids.add(key);
            }
            HashMap<String, HashMap<String, Object>> userInfos = SearchApi
                    .getDocsByMultiIdsWithMap(DataSetConstant.LD_USER_INFORMATION, UserVo.OPENID, ids.toArray(idsArr));
            for (String key : users.keySet()) {
                HashMap<String, Object> u = users.get(key);
                HashMap<String, Object> info = userInfos.get(key);
                u.putAll(info);
                result.add(u);

            }
        }
        return result;

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
    public String ldLogin(String openId, String nickName, String avator, String gps) {
        HashMap<String, String> vo = new HashMap<String, String>();
        vo.put(UserVo.OPENID, openId);
        LinkedList<HashMap<String, Object>> loginUser = SearchApi.searchByField(DataSetConstant.LD_USER_INFORMATION,
                UserVo.OPENID, openId, null, null);
        if (loginUser != null) {
            loginUser.getFirst().put(UserVo.NICKNAME, nickName);
            loginUser.getFirst().put(UserVo.AVATOR, avator);
            if (!gps.contains("undefined")) {
                loginUser.getFirst().put(UserVo.GPS, gps);
            }
            SearchApi.updateDocument(DataSetConstant.LD_USER_INFORMATION, JSON.toJSONString(loginUser.getFirst()), openId);
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
            String json = restTemplate.getForObject(url, String.class);
            JSONObject openId = (JSONObject) JSONObject.parse(json);
            return new String[] { openId.getString("openid"), openId.getString("session_key") };
        } catch (RestClientException e) {
            return null;
        }
    }

    @Override
    public String[] getLDOpenId(String token) {
        RestTemplate restTemplate = new RestTemplate();
        String url = String.format(
                "https://api.weixin.qq.com/sns/jscode2session?appid=%s&secret=%s&js_code=%s&grant_type=authorization_code",
                ldAppId, ldAppSecret, token);
        try {
            String json = restTemplate.getForObject(url, String.class);
            JSONObject openId = (JSONObject) JSONObject.parse(json);
            return new String[] { openId.getString("openid"), openId.getString("session_key") };
        } catch (RestClientException e) {
            return null;
        }
    }

    @Override
    public String accessByWxToken(String token, String nickName, String avator, String gps) {
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
    public String accessByLDWxToken(String token, String nickName, String avator, String gps) {
        String jwtString = ldLogin(token, nickName, avator, gps);
        if (TextUtils.isEmpty(jwtString)) {
            UserVo user = new UserVo();
            user.setOpenId(token);
            user.setNickName(nickName);
            user.setAvator(avator);
            user.setGps(gps);
            jwtString = jwtToken.generateToken(addLDUser(user));
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
    public HashMap<String, Object> getLDUserInfo(String openId) {
        HashMap<String, String> vo = new HashMap<String, String>();
        vo.put(UserVo.OPENID, openId);
        LinkedList<HashMap<String, Object>> loginUser = SearchApi.searchByField(DataSetConstant.LD_USER_INFORMATION,
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
    public String ldVerified(String token) {
        String[] userInfo = getLDOpenId(token);
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

    @Override
    public LinkedList<HashMap<String, Object>> getLDUserList() {
        try {
            LinkedList<HashMap<String, Object>> userlist= SearchApi.searchAll(DataSetConstant.LD_USER_INFORMATION, 0, 400);
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

    @Override
    public LinkedList<HashMap<String, Object>> getLDUsersByName(String name) {

            LinkedList<HashMap<String, Object>> userlist= SearchApi.searchByFieldFussy(DataSetConstant.LD_USER_INFORMATION, UserVo.REALNAME, name,0,100);
            if (userlist!=null){
                userlist.sort((HashMap<String, Object>o1,HashMap<String, Object>o2)->{
                    return Collator.getInstance(Locale.CHINESE).compare(o1.get(UserVo.REALNAME), o2.get(UserVo.REALNAME));
                });
            return  userlist;
            }
        return null;
    }

    @Override
    public LinkedList<HashMap<String, Object>> getLDUsersByType(Object types) {

        LinkedList<HashMap<String, Object>> userlist= SearchApi.searchByField(DataSetConstant.LD_USER_INFORMATION, UserVo.COACH, types,0,100);
        if (userlist!=null){
            userlist.sort((HashMap<String, Object>o1,HashMap<String, Object>o2)->{
                return Collator.getInstance(Locale.CHINESE).compare(o1.get(UserVo.NICKNAME), o2.get(UserVo.NICKNAME));
            });
            return  userlist;
        }
        return null;
    }

}
