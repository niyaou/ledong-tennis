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


    @Query("select a from Course a where a.startTime >= :startTime and a.startTime <=:endTime")
     List<Course> findAllWithTimeRange(@Param("startTime") LocalDateTime startTime,@Param("endTime") LocalDateTime endTime );

//    @Query("select a from Course a where a.startTime >= :startTime and a.course.number = :number")
//    Page<Course> findMemberWithStartTimeAfter(@Param("startTime") LocalDateTime startTime, @Param("number") String number,Pageable pageParams);
}
