package com.ledong.dao;

import com.ledong.entity.PrepaidCard;
import com.ledong.entity.Spend;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.io.Serializable;

public interface SpendDAO extends JpaRepository<Spend, Serializable>, JpaSpecificationExecutor<Spend> {

}
