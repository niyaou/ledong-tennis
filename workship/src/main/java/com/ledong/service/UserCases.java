package com.ledong.service;

import com.ledong.bo.PrepaidCardBo;
import com.ledong.bo.SpendBo;
import com.ledong.dao.SpendDAO;
import com.ledong.dao.UserDAO;
import com.ledong.entity.PrepaidCard;
import com.ledong.exception.CustomException;
import com.ledong.exception.UseCaseCode;
import com.ledong.util.DefaultConverter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Date;
import java.util.List;


public class UserCases {

    @Autowired
    private UserDAO userDAO;

    @Autowired
    private SpendDAO spendDAO;


    public PrepaidCardBo create(String name, String number,String court) {
        var existUser = findByNumber(number);
        if (existUser != null) {
            throw new CustomException(UseCaseCode.USER_EXIST);
        }
        var user = PrepaidCard.builder().name(name).number(number).court(court).build();
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


    @Transactional(rollbackFor = Exception.class)
    public PrepaidCardBo setRestTimesChange(String number,float times){
        var user=    userDAO.findByNumber(number);
        if(user==null){
            throw new CustomException(UseCaseCode.NOT_FOUND);
        }
        user.setTimesCount(user.getTimesCount()+times);
        userDAO.save(user);
        return DefaultConverter.convert( user,PrepaidCardBo.class);
    }


    @Transactional(rollbackFor = Exception.class)
    public PrepaidCardBo setRestAnnualTimesChange(String number,float annualTimes){
        var user=    userDAO.findByNumber(number);
        if(user==null){
            throw new CustomException(UseCaseCode.NOT_FOUND);
        }
        user.setAnnualCount(user.getAnnualCount()+annualTimes);
        userDAO.save(user);
        return DefaultConverter.convert( user,PrepaidCardBo.class);
    }


    @Transactional(rollbackFor = Exception.class)
    public PrepaidCardBo setTimesExpired(String number, Date expiredTime){
        var user=    userDAO.findByNumber(number);
        if(user==null){
            throw new CustomException(UseCaseCode.NOT_FOUND);
        }
        user.setTimesExpireTime(expiredTime);
        userDAO.save(user);
        return DefaultConverter.convert( user,PrepaidCardBo.class);
    }


    @Transactional(rollbackFor = Exception.class)
    public PrepaidCardBo setAnnualTimesExpired(String number, Date expiredTime){
        var user=    userDAO.findByNumber(number);
        if(user==null){
            throw new CustomException(UseCaseCode.NOT_FOUND);
        }
        user.setAnnualExpireTime(expiredTime);
        userDAO.save(user);
        return DefaultConverter.convert( user,PrepaidCardBo.class);
    }

    public List<PrepaidCard> getMembers(){
        return userDAO.findAll();
    }



    public PrepaidCard getMember(String number){
        var member= userDAO.findByNumber(number);
        if (member==null){
            throw new CustomException(UseCaseCode.NOT_FOUND);
        }
        return member;
    }


}
