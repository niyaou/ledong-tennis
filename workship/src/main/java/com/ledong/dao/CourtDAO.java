package com.ledong.dao;

import com.ledong.entity.Court;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.io.Serializable;

public interface CourtDAO extends JpaRepository<Court, Serializable>,JpaSpecificationExecutor<Court> {
    public Court findByName(String name);
}
