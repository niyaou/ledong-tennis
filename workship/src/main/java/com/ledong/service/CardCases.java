package com.ledong.service;

import cn.hutool.core.date.DateUtil;
import com.ledong.bo.ChargeBo;
import com.ledong.dao.ChargeDAO;
import com.ledong.dao.CoachDAO;
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
import org.springframework.util.StringUtils;

import java.sql.Date;
import java.util.ArrayList;
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
    @Autowired
    private CoachDAO coachDAO;

    @Transactional(rollbackFor = Exception.class)
    public ChargeBo setRestCharge(String number, Float charged, Float times, Float annualTimes, String annualExpireTime,Integer worth,String court,String description,String coachName,String time) {
        var user = userCases.findByNumber(number);
        if (user == null) {
            throw new CustomException(UseCaseCode.NOT_FOUND);
        }
        var coach  = coachDAO.findByName(coachName);
        var chargeTemp = Charge.builder()
                .charge(0)
                .chargedTime(DateUtil.parse(time).toLocalDateTime())
                .times(0)   
                .annualTimes(0)
                .court(court)
                .coach(coach)
                .description(description)
                .prepaidCard(PrepaidCard.fromBO(user));
        if (worth!=null && worth != 0) {
            chargeTemp.worth(worth);
            userCases.setEquivalentChange(number,worth);
        }
        if (charged!=null && charged != 0) {
            chargeTemp.charge(charged);
            userCases.setRestChargeChange(number, charged);
        }
        if (times!=null &&times != 0) {
            chargeTemp.times(times);
            userCases.setRestTimesChange(number, times);
        }
        if (annualTimes!=null &&annualTimes != 0) {
            chargeTemp.annualTimes(annualTimes);
            userCases.setRestAnnualTimesChange(number, annualTimes);
        }
        if (StringUtils.hasText(annualExpireTime)) {
            userCases.setAnnualTimesExpired(number, Date.valueOf(annualExpireTime));
        }
        var charge = chargeTemp.build();
        charge.setChargedTime(DateUtil.parse(time).toLocalDateTime());
        System.out.println(charge.toString());
        chargeDao.save(charge);

        return DefaultConverter.convert(charge, ChargeBo.class);
    }


    @Transactional(rollbackFor = Exception.class)
    public ChargeBo retreatCharge(Long id) {
        var _charge = chargeDao.findById(id);
        if (_charge.isPresent()) {
            var charge = _charge.get();
            var number = charge.getPrepaidCard().getNumber();
            userCases.setRestChargeChange(number, -charge.getCharge());
            userCases.setRestTimesChange(number, -charge.getTimes());
            userCases.setRestAnnualTimesChange(number, -charge.getAnnualTimes());
            userCases.setEquivalentChange(number,-charge.getWorth());
            chargeDao.delete(charge);
            return DefaultConverter.convert(charge, ChargeBo.class);
        } else {
            throw new CustomException(UseCaseCode.NOT_FOUND);
        }
    }

    public Page<Spend> getSpend(String number, Integer pageNum, Integer pageSize) {
        var user = userDAO.findByNumber(number);
        if (user == null) {
            throw new CustomException(UseCaseCode.NOT_FOUND);
        }
        var sort = Sort.by(Sort.Direction.DESC, "course.startTime");
        Pageable pageReq = PageRequest.of(pageNum - 1, pageSize, sort);
        if (StringUtils.hasText(number)) {
            return spendDAO.findByPrepaidCard_Id(user.getId(), pageReq);
        } else {
            return spendDAO.findAll(pageReq);
        }

//        return DefaultConverter.convert( spend,SpendBo.class);
    }

    public Spend getSpend(String number) {
        var user = userDAO.findByNumber(number);
        if (user == null) {
            throw new CustomException(UseCaseCode.NOT_FOUND);
        }
        return spendDAO.findByPrepaidCard_Id(user.getId());
//        return DefaultConverter.convert( spend,SpendBo.class);
    }


    public Page<Charge> getCharged(String number, Integer pageNum, Integer pageSize) {
        var user = userDAO.findByNumber(number);
        if (user == null) {
            throw new CustomException(UseCaseCode.NOT_FOUND);
        }
        var sort = Sort.by(Sort.Direction.DESC, "chargedTime");
        Pageable pageReq = PageRequest.of(pageNum - 1, pageSize, sort);
        if (StringUtils.hasText(number)) {
            return chargeDao.findByPrepaidCard_Id(user.getId(), pageReq);
        } else {
            return chargeDao.findAll(pageReq);
        }
     }

    public Page<Charge> getCharged(Integer pageNum, Integer pageSize) {

        var sort = Sort.by(Sort.Direction.DESC, "chargedTime");
        Pageable pageReq = PageRequest.of(pageNum - 1, pageSize, sort);
            return chargeDao.findAll(pageReq);

    }

    public String getChargedByCoach(String coach, String startTime, String endTime) {
        var user = coachDAO.findByName(coach);
        if (user == null) {
            throw new CustomException(UseCaseCode.NOT_FOUND);
        }
        var sort = Sort.by(Sort.Direction.DESC, "chargedTime");
        var result =  chargeDao.findAllWithTimeRangeAndId(DateUtil.parse(startTime).toLocalDateTime(),DateUtil.parse(endTime).toLocalDateTime(),user.getId());
        var chargeLists = new ArrayList<String>();
        var buff = new StringBuffer();
        result.forEach(r->{
            buff.append( r.getPrepaidCard().getName()+"   充值时间: "+r.getChargedTime()+"   充值:"+r.getCharge()+"元,  "+r.getTimes()+"次, "+r.getAnnualTimes()+"年卡次,  "+r.getWorth()+"等值  备注："+r.getDescription()+"\r\n");
        });
        return buff.toString();


    }

}
