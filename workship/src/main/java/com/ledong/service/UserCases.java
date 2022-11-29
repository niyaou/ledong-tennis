package com.ledong.service;

import com.ledong.bo.PrepaidCardBo;
import com.ledong.dao.UserDAO;
import com.ledong.entity.PrepaidCard;
import com.ledong.exception.CustomException;
import com.ledong.exception.UseCaseCode;
import com.ledong.util.DefaultConverter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;


public class UserCases {

    @Autowired
    private UserDAO userDAO;


    public PrepaidCardBo create(String name, String number) {
        var existUser = findByNumber(number);
        if (existUser != null) {
            throw new CustomException(UseCaseCode.USER_EXIST);
        }
        var user = PrepaidCard.builder().name(name).number(number).build();
        userDAO.save(user);
        return findByNumber(number);
    }

    public PrepaidCardBo findByNumber(String number) {
        var user = userDAO.findByNumber(number);
        return DefaultConverter.convert(user, PrepaidCardBo.class);
    }

    @Transactional(rollbackFor = Exception.class)
    public PrepaidCardBo setRestChargeChange(String number,float changed){
        var user=    userDAO.findByNumber(number);
        if(user==null){
            throw new CustomException(UseCaseCode.NOT_FOUND);
        }
        user.setRestCharge(user.getRestCharge()+changed);
        userDAO.save(user);
        return DefaultConverter.convert( user,PrepaidCardBo.class);
    }

}
