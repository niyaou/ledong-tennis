package com.ledong.service;

import com.ledong.bo.ChargeBo;
import com.ledong.bo.SpendBo;
import com.ledong.dao.ChargeDAO;
import com.ledong.dao.SpendDAO;
import com.ledong.dao.UserDAO;
import com.ledong.entity.Charge;
import com.ledong.entity.PrepaidCard;
import com.ledong.entity.Spend;
import com.ledong.exception.CustomException;
import com.ledong.exception.UseCaseCode;
import com.ledong.util.DefaultConverter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Date;
import java.util.List;


public class CardCases {
    @Autowired
    private ChargeDAO chargeDao;
    @Autowired
    private UserCases userCases;

    @Autowired
    private UserDAO userDAO;

    @Autowired
    private SpendDAO spendDAO;

//    @Transactional(rollbackFor = Exception.class)
    public ChargeBo  setRestCharge(String number,float charged,float times,float annualTimes, String description){
       var user= userCases.findByNumber(number);
       if(user==null){
           throw new CustomException(UseCaseCode.NOT_FOUND);
       }
        var chargeTemp =Charge.builder()
                .description(description)
                .prepaidCard(PrepaidCard.fromBO(user));
       if(charged!=0){
           chargeTemp.charge(charged);
           userCases.setRestChargeChange(number,charged);
       }
        if(times!=0){
            chargeTemp.times(times);
            userCases.setRestTimesChange(number,times);
        }
        if(annualTimes!=0){
            chargeTemp.annualTimes(annualTimes);
            userCases.setRestAnnualTimesChange(number,annualTimes);
        }
        var charge=chargeTemp.build();
        chargeDao.save(charge);

        return DefaultConverter.convert(charge,ChargeBo.class);
    }

    public List<Spend> getSpend(String number){
        var user=    userDAO.findByNumber(number);
        if(user==null){
            throw new CustomException(UseCaseCode.NOT_FOUND);
        }
        return spendDAO.findByPrepaidCard_Id(user.getId());
//        return DefaultConverter.convert( spend,SpendBo.class);
    }


}
