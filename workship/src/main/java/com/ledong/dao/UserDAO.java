package com.ledong.dao;

import com.ledong.entity.PrepaidCard;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

import java.io.Serializable;
import java.util.List;

public interface UserDAO extends JpaRepository<PrepaidCard, Serializable>, JpaSpecificationExecutor<PrepaidCard> {

    public PrepaidCard findByNumber(String number);

    public List<PrepaidCard> findAllByCourt(String court);

    @Query("SELECT u.court, SUM(u.equivalentBalance + u.restCharge) as totalEquival FROM PrepaidCard u GROUP BY u.court")
    java.util.List<Object[]> statCourtEquival();

}
