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
    public String addUser(UserVo user);

    /**
     * 
     * @param user
     * @param password
     * @return
     */
    public String login(String user, String password);
}
