package ledong.wxapp.service;

import VO.UserVo;
import org.springframework.web.multipart.MultipartFile;

import javax.crypto.BadPaddingException;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.NoSuchPaddingException;
import java.io.UnsupportedEncodingException;
import java.security.InvalidAlgorithmParameterException;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.util.HashMap;
import java.util.LinkedList;

public interface IPrepaidCardService {

        /**
         * create new card
         * 
         * @param cardName
         * @param members
         * @return
         */
        public String addCard(String cardName, String... members);

        /**
         * assign member to card
         * 
         * @param cardName
         * @param openId
         * @return
         */
        public String assignMember(String cardName, String openId);

        /**
         * course Log
         * 
         * @param courseId
         * @param spendTime
         * @param membersObj
         * @return
         */
        public String settleAccount(String courseId, String startTime, Double spendTime,
                        HashMap<String, Integer> membersObj);

        /**
         * user charge log
         * 
         * 
         * 
         */
        public String chargeAnnotation(String cardId, String openId, String operatorName, String time, Integer amount,
                        String coachId, String courseId, String description);

        /**
         * get spending and charge logs
         * 
         * @param cardId
         * @param startTime
         * @param endTime
         * @return
         */
        public Object finacialLogs(String cardId, String startTime, String endTime);

}
