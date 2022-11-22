package com.ledong.entity;

import lombok.Data;
import lombok.experimental.Accessors;

import javax.persistence.*;
import java.io.Serializable;
import java.sql.Date;
import java.util.List;

@Data
@Accessors(chain = true)
@Entity
public class Course implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private Date startTime;
    private Date endTime;

    private float duration;

    @Column(name = "courseTime", columnDefinition = "int COMMENT '处理结果:1，班课；2，私教'")
    private int courseTime;


    @ManyToOne
    @JoinColumn(name = "court_id")
    private Court court;

    @ManyToOne
    @JoinColumn(name = "coach_id")
    private Coach coach;

    @ManyToMany
    @JoinColumn(name = "prepaid_card_id")
    private List<PrepaidCard> member;


    private String description;

}
