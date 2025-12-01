package com.ledong.dao;

import com.ledong.entity.Charge;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.List;

public interface ChargeDAO extends JpaRepository<Charge, Serializable>, JpaSpecificationExecutor<Charge> {

    public Page<Charge> findByPrepaidCard_Id(Long id, Pageable pageParams );

    @Query("select a from Charge a where a.chargedTime >= :startTime and a.chargedTime <=:endTime and a.coach.id=:id")
    public List<Charge> findAllWithTimeRangeAndId(@Param("startTime") LocalDateTime startTime,@Param("endTime") LocalDateTime endTime,Long id );

    public Charge findByPrepaidCard_Id(Long id);

    @Query("select a from Charge a where a.chargedTime >= :startTime and a.chargedTime <=:endTime")
    List<Charge> findAllWithTimeRange(@Param("startTime") LocalDateTime startTime, @Param("endTime") LocalDateTime endTime );

   

}
