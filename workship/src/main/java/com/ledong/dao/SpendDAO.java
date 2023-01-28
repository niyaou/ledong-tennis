package com.ledong.dao;

import com.ledong.entity.Course;
import com.ledong.entity.PrepaidCard;
import com.ledong.entity.Spend;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.List;

public interface SpendDAO extends JpaRepository<Spend, Serializable>, JpaSpecificationExecutor<Spend> {

    public Page<Spend> findByPrepaidCard_Id(Long id, Pageable pageParams );

    public Spend findByPrepaidCard_Id(Long id);

    public Spend findByPrepaidCard_IdAndCourse_Id(Long prepaidCardId,Long cId);

    @Query("select a from Charge a where a.chargedTime >= :startTime and a.chargedTime <=:endTime")
    List<Course> findAllWithTimeRange(@Param("startTime") LocalDateTime startTime, @Param("endTime") LocalDateTime endTime );



}
