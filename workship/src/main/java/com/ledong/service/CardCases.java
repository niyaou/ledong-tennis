package com.ledong.service;

import com.ledong.bo.ChargeBo;
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
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.transaction.annotation.Transactional;


public class CardCases {
    @Autowired
    private ChargeDAO chargeDao;
    @Autowired
    private UserCases userCases;

    @Autowired
    private UserDAO userDAO;

    @Autowired
    private SpendDAO spendDAO;

    @Transactional(rollbackFor = Exception.class)
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


    @Transactional(rollbackFor = Exception.class)
    public ChargeBo retreatCharge(Long id){
      var _charge=  chargeDao.findById(id);
      if(_charge.isPresent()){
         var charge= _charge.get();
          var number =charge.getPrepaidCard().getNumber();
          userCases.setRestChargeChange(number,charge.getCharge());
          userCases.setRestTimesChange(number,charge.getTimes());
          userCases.setRestAnnualTimesChange(number,charge.getAnnualTimes());
          chargeDao.delete(charge);
          return  DefaultConverter.convert(charge,ChargeBo.class);
      }else{
          throw new CustomException(UseCaseCode.NOT_FOUND);
      }
    }

    public Page<Spend> getSpend(String number,Integer pageNum,Integer pageSize){
        var user=    userDAO.findByNumber(number);
        if(user==null){
            throw new CustomException(UseCaseCode.NOT_FOUND);
        }
        var sort = Sort.by(Sort.Direction.DESC,"course.startTime");
        Pageable pageReq = PageRequest.of(pageNum - 1, pageSize,sort);

        return spendDAO.findByPrepaidCard_Id(user.getId(),pageReq);
//        return DefaultConverter.convert( spend,SpendBo.class);
    }

    public Spend getSpend(String number){
        var user=    userDAO.findByNumber(number);
        if(user==null){
            throw new CustomException(UseCaseCode.NOT_FOUND);
        }
        return spendDAO.findByPrepaidCard_Id(user.getId());
//        return DefaultConverter.convert( spend,SpendBo.class);
    }

}
