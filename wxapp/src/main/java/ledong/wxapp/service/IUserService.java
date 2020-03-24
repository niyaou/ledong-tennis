package ledong.wxapp.service;

import java.util.HashMap;

import VO.UserVo;

public interface IUserService {

    /**
     * create new user
     * 
     * @param user
     * @param password
     * @param nickName
     * @return
     */
    public boolean addUser(UserVo user);

    /**
     * 
     * @param user
     * @param password
     * @return
     */
    public HashMap<String, Object> login(String user, String password);
}
