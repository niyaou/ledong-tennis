package ledong.wxapp.service.impl;

import java.util.HashMap;
import java.util.LinkedList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.alibaba.fastjson.JSON;

import VO.UserVo;
import ledong.wxapp.auth.JwtToken;
import ledong.wxapp.constant.DataSetConstant;
import ledong.wxapp.search.SearchApi;
import ledong.wxapp.service.IUserService;
import ledong.wxapp.utils.DateUtil;

@Service
public class UserServiceImpl implements IUserService {

    @Autowired
    private JwtToken jwtToken;

    @Override
    public String addUser(UserVo user) {
        String createTime = DateUtil.getCurrentDate(DateUtil.FORMAT_DATE_TIME);
        user.setCreateTime(createTime);
        return SearchApi.insertDocument(DataSetConstant.USER_INFORMATION, JSON.toJSONString(user));
    }

    @Override
    public String login(String user, String password) {

        HashMap<String, String> vo = new HashMap<String, String>();
        vo.put(UserVo.USERNAME, user);
        vo.put(UserVo.PASSWORD, password);
        LinkedList<HashMap<String, Object>> loginUser = SearchApi.searchByField(DataSetConstant.USER_INFORMATION,
                UserVo.USERNAME, user, null, null);
        if (loginUser != null) {
            String passwordStore = (String) loginUser.get(0).get(UserVo.PASSWORD);
            if (passwordStore.equals(password)) {
               
                return  jwtToken.generateToken(user);
            }
        }
        return null;
    }

}
