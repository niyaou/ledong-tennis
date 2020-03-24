package ledong.wxapp.service.impl;

import java.util.HashMap;
import java.util.LinkedList;

import org.springframework.stereotype.Service;

import com.alibaba.fastjson.JSON;

import VO.UserVo;
import ledong.wxapp.constant.DataSetConstant;
import ledong.wxapp.search.SearchApi;
import ledong.wxapp.service.IUserService;
import ledong.wxapp.utils.DateUtil;

@Service
public class UserServiceImpl implements IUserService {

    @Override
    public boolean addUser(UserVo user) {
        String createTime = DateUtil.getCurrentDate(DateUtil.FORMAT_DATE_TIME);
        user.setCreateTime(createTime);
        return SearchApi.insertDocument(DataSetConstant.USER_INFORMATION, JSON.toJSONString(user));
    }

    @Override
    public HashMap<String, Object> login(String user, String password) {
        // TODO Auto-generated method stub

        HashMap<String, String> vo = new HashMap<String, String>();
        vo.put(UserVo.USERNAME, user);
        vo.put(UserVo.PASSWORD, password);
        LinkedList<HashMap<String, Object>> loginUser = SearchApi.searchByField(DataSetConstant.USER_INFORMATION,
                UserVo.USERNAME, user, null, null);
        if (loginUser != null) {
            String passwordStore = (String) loginUser.get(0).get(UserVo.PASSWORD);
            if (passwordStore.equals(password)) {
                return loginUser.get(0);
            }
        }
        return null;
    }

}
