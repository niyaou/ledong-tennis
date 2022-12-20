package com.ledong.dao;

import com.ledong.entity.Charge;
import com.ledong.entity.PrepaidCard;
import com.ledong.entity.Spend;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.io.Serializable;

public interface ChargeDAO extends JpaRepository<Charge, Serializable>, JpaSpecificationExecutor<Charge> {

    public Page<Charge> findByPrepaidCard_Id(Long id, Pageable pageParams );

    public Charge findByPrepaidCard_Id(Long id);


}
