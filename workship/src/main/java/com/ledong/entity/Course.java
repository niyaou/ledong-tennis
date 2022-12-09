package com.ledong.entity;

import com.ledong.bo.CourseBo;
import com.ledong.bo.PrepaidCardBo;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.Accessors;

import javax.persistence.*;
import java.io.Serializable;
import java.sql.Date;
import java.util.List;

@Data
@Accessors(chain = true)
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Course implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private Date startTime;
    private Date endTime;

    private float duration;

    @Column(name = "courseTime", columnDefinition = "int COMMENT '类型:1，班课；2，私教'")
    private int courseType;


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

    public static Course fromBO(CourseBo bo) {
        return Course.builder()
                .id(bo.getId())
                .description(bo.getDescription())
                .coach(bo.getCoach())
                .court(bo.getCourt())
                .duration(bo.getDuration())
                .startTime(bo.getStartTime())
                .endTime(bo.getEndTime())
                .member(bo.getMember())
                .build();
    }

}
