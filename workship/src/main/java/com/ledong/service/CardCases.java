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
import org.springframework.util.StringUtils;

import java.sql.Date;


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
    public ChargeBo setRestCharge(String number, Float charged, Float times, Float annualTimes, String annualExpireTime,Integer worth,String court,String description) {
        var user = userCases.findByNumber(number);
        if (user == null) {
            throw new CustomException(UseCaseCode.NOT_FOUND);
        }
        var chargeTemp = Charge.builder()
                .charge(0)
                .times(0)
                .annualTimes(0)
                .court(court)
                .description(description)
                .prepaidCard(PrepaidCard.fromBO(user));
        if (worth!=null && worth != 0) {
            chargeTemp.worth(worth);
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

//        return DefaultConverter.convert( spend,SpendBo.class);
    }

}
