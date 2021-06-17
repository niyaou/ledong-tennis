package ledong.wxapp.service.impl;

import VO.*;
import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.google.common.io.Files;
import ledong.wxapp.auth.JwtToken;
import ledong.wxapp.constant.CommonConstanst;
import ledong.wxapp.constant.DataSetConstant;
import ledong.wxapp.search.SearchApi;
import ledong.wxapp.service.IPrepaidCardService;
import ledong.wxapp.service.IRankService;
import ledong.wxapp.service.IUserService;
import ledong.wxapp.utils.DateUtil;
import org.apache.commons.codec.binary.Base64;
import org.apache.http.util.TextUtils;
import org.apache.log4j.Logger;
import org.bouncycastle.jce.provider.BouncyCastleProvider;
import org.elasticsearch.search.sort.SortOrder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.DigestUtils;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import javax.crypto.*;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import java.io.File;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.security.*;
import java.text.Collator;
import java.util.*;

@Service
public class PrepaidCardServiceImpl implements IPrepaidCardService {
    private static Logger logger = Logger.getLogger(PrepaidCardServiceImpl.class);
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

    @Autowired
    private IUserService userService;

    @Override
    public String addCard(String cardName, String... members) {
        LdPrePaidCardVo card = new LdPrePaidCardVo();
        card.setTitle(cardName);
        if (members != null) {
            card.setMember(members);
        }
        String createTime = DateUtil.getCurrentDate(DateUtil.FORMAT_DATE_TIME);
        card.setCreateTime(createTime);

        String cardId = SearchApi.insertDocument(DataSetConstant.LD_PREPAID_CARD_INFORMATION, JSON.toJSONString(card),
                cardName);
        for (String openId : members) {
            HashMap<String, Object> vo = userService.getLDUserInfo(openId);
            vo.put(UserVo.PREPAIDCARD, cardId);
            SearchApi.updateDocument(DataSetConstant.LD_USER_INFORMATION, JSON.toJSONString(vo), openId);
        }
        return cardId;
    }

    @Override
    public String assignMember(String cardName, String openId) {
        HashMap<String, Object> card = SearchApi.searchById(DataSetConstant.LD_PREPAID_CARD_INFORMATION, cardName);
        if (card == null) {
            return null;
        } else {
            ArrayList<String> member = (ArrayList<String>) card.get(LdPrePaidCardVo.MEMBER);

            if (member.indexOf(openId) < 0) {
                HashMap<String, Object> vo = userService.getLDUserInfo(openId);
                vo.put(UserVo.PREPAIDCARD, card.get(LdPrePaidCardVo.TITLE));
                SearchApi.updateDocument(DataSetConstant.LD_USER_INFORMATION, JSON.toJSONString(vo), openId);
                member.add(openId);
                String[] newMember = new String[member.size()];
                card.put(LdPrePaidCardVo.MEMBER, member.toArray(newMember));
                return SearchApi.updateDocument(DataSetConstant.LD_PREPAID_CARD_INFORMATION, JSON.toJSONString(card),
                        cardName);
            } else {
                return cardName;
            }

        }
    }

    @Override
    public String settleAccount(String courseId, String startTime, Double spendTime,
            HashMap<String, Integer> membersObj) {
        // log each spend
        ArrayList<String> members = new ArrayList<>();
        HashMap<String, Integer> cardCharge = new HashMap<>();
        for (String m : membersObj.keySet()) {
            members.add(m);
            HashMap<String, Object> memberVo = userService.getLDUserInfo(m);
            String cardId = (String) memberVo.get(UserVo.PREPAIDCARD);
            if (TextUtils.isEmpty(cardId)) {
                continue;
            }
            int temp = cardCharge.get(cardId) == null ? 0 : cardCharge.get(cardId);
            cardCharge.put(cardId, temp + membersObj.get(m));
            LdSpendingVo spendVo = new LdSpendingVo();
            spendVo.setOpenId(m);
            spendVo.setTime(startTime);
            spendVo.setSpend(spendTime);
            spendVo.setCharge(membersObj.get(m));
            spendVo.setCourse(cardId);
            SearchApi.appendFieldValueById(DataSetConstant.LD_PREPAID_CARD_INFORMATION, LdPrePaidCardVo.SPENDING,
                    spendVo, cardId);
        }
        // update total spend
        for (String card : cardCharge.keySet()) {
            HashMap<String, Object> cardVo = SearchApi.searchById(DataSetConstant.LD_PREPAID_CARD_INFORMATION, card);
            int temp = (int) cardVo.get(LdPrePaidCardVo.BALANCE);
            SearchApi.updateFieldValueById(DataSetConstant.LD_PREPAID_CARD_INFORMATION, LdPrePaidCardVo.BALANCE,
                    String.valueOf(temp + cardCharge.get(card)), card);
        }
        return courseId;
    }
}
