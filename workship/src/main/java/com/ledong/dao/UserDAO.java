package com.ledong.dao;

import com.ledong.entity.PrepaidCard;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.io.Serializable;

public interface UserDAO extends JpaRepository<PrepaidCard, Serializable>, JpaSpecificationExecutor<PrepaidCard> {

    public PrepaidCard findByNumber(String number);

}
