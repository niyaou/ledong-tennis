package com.ledong.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.ledong.bo.CourseBo;
import lombok.*;
import org.hibernate.Hibernate;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;

@Getter
@Setter
@RequiredArgsConstructor
@Entity
@Builder
@AllArgsConstructor
public class Course {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    @Column( columnDefinition = "datetime")
    private LocalDateTime startTime;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    @Column( columnDefinition = "datetime")
    private LocalDateTime endTime;

    private float duration;


    @Column(name = "course_type",  columnDefinition = "int COMMENT '类型:0,订场，1，班课；2，私教'")
    private int courseType;

    @ManyToOne
    @JoinColumn(name = "court_id")
    private Court court;

    @ManyToOne
    @JoinColumn(name = "coach_id")
    private Coach coach;

    @OneToMany(mappedBy = "course",cascade = {CascadeType.REMOVE})
    private List<Spend>  spend;

    @ManyToMany
    @JoinColumn(name = "prepaidCard_id")
    private List<PrepaidCard> member;

    private int notified;

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
                .notified(bo.getNotified())
                .spend(bo.getSpend())
                .build();
    }



    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || Hibernate.getClass(this) != Hibernate.getClass(o)) return false;
        Course course = (Course) o;
        return id != null && Objects.equals(id, course.id);
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }
}
