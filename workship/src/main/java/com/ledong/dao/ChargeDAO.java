package com.ledong.dao;

import com.ledong.entity.Charge;
import com.ledong.entity.Course;
import com.ledong.entity.PrepaidCard;
import com.ledong.entity.Spend;
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

    @Query("SELECT c.court, SUM(CASE WHEN c.charge = 0 THEN c.worth ELSE c.charge END) as totalCharge FROM Charge c WHERE c.time BETWEEN :start AND :end GROUP BY c.court")
    java.util.List<Object[]> statCourtCharge(@Param("start") java.time.LocalDateTime start, @Param("end") java.time.LocalDateTime end);

    @Query("SELECT c.coach.name, SUM(CASE WHEN c.charge = 0 THEN c.worth ELSE c.charge END) as totalCharge FROM Charge c WHERE c.time BETWEEN :start AND :end AND c.coach IS NOT NULL GROUP BY c.coach.name")
    java.util.List<Object[]> statCoachCharge(@Param("start") java.time.LocalDateTime start, @Param("end") java.time.LocalDateTime end);

}
