package com.ledong.service;

import com.ledong.bo.ChargeBo;
import com.ledong.dao.ChargeDAO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;


public class CardCases {
    @Autowired
    private ChargeDAO chargeDao;

    @Transactional(rollbackFor = Exception.class)
    public ChargeBo  setRestCharge(String number,float charged){
return null;
    }

}
