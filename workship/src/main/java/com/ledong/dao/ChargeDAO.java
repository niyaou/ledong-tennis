package com.ledong.dao;

import com.ledong.entity.Charge;
import com.ledong.entity.PrepaidCard;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.io.Serializable;

public interface ChargeDAO extends JpaRepository<Charge, Serializable>, JpaSpecificationExecutor<Charge> {
}
