package com.ledong.dao;

import com.ledong.entity.Coach;
import com.ledong.entity.Course;
import com.ledong.entity.PrepaidCard;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.io.Serializable;
import java.util.List;

public interface CoachDAO extends JpaRepository<Coach, Serializable>,JpaSpecificationExecutor<Coach> {
    public Coach findByNumber(String number);
    public Coach findByName(String name);
    public List<Coach> findByIsActive(Integer isActive);
}
