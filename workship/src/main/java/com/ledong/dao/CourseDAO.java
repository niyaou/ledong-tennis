package com.ledong.dao;

import cn.hutool.core.date.DateTime;
import com.ledong.entity.Course;
import com.ledong.entity.Court;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.List;

public interface CourseDAO extends JpaRepository<Course, Serializable>,JpaSpecificationExecutor<Course> {


    @Query("select a from Course a where a.startTime >= :startTime")
    Page<Course> findAllWithStartTimeAfter(@Param("startTime") LocalDateTime startTime, Pageable pageParams);


    @Query("select a from Course a where a.startTime >= :startTime and a.endTime <:endTime")
    List<Course> findAByMonth(@Param("startTime") LocalDateTime startTime,@Param("endTime") LocalDateTime endTime);


    @Query("select a from Course a where a.startTime >= :startTime and a.startTime <=:endTime")
     List<Course> findAllWithTimeRange(@Param("startTime") LocalDateTime startTime,@Param("endTime") LocalDateTime endTime );


    @Query("select a from Course a JOIN a.coach coach where a.startTime = :startTime and a.endTime =:endTime and coach.id = :coachId")
    List<Course> findAllWithReport(@Param("startTime") LocalDateTime startTime,@Param("endTime") LocalDateTime endTime,@Param("coachId") Long coachId );


//    @Query("select a from Course a where a.startTime >= :startTime and a.course.number = :number")
//    Page<Course> findMemberWithStartTimeAfter(@Param("startTime") LocalDateTime startTime, @Param("number") String number,Pageable pageParams);

    @org.springframework.data.jpa.repository.Query("SELECT c.court.name, c.coach.name, COUNT(c), SUM(c.duration), SUM(s.quantities) FROM Course c LEFT JOIN c.spend s WHERE c.startTime BETWEEN :start AND :end GROUP BY c.court.name, c.coach.name")
    java.util.List<Object[]> statCourse(@org.springframework.data.repository.query.Param("start") java.time.LocalDateTime start, @org.springframework.data.repository.query.Param("end") java.time.LocalDateTime end);
}
