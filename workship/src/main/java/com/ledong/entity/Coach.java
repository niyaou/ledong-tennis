package com.ledong.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.*;
import org.hibernate.Hibernate;

import javax.persistence.*;
import java.util.List;
import java.util.Objects;

@Getter
@Setter
@RequiredArgsConstructor
@Entity
@JsonIgnoreProperties({"courses","charge"})
public class Coach   {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="coach_id",columnDefinition = "bigint COMMENT '主键'")
    private Long id;

    private String name;

    private String number;

    private int level;

    @OneToMany(mappedBy = "coach",cascade = {CascadeType.REMOVE})
    private List<Course> courses;

    @OneToMany(mappedBy = "coach",cascade = {CascadeType.REMOVE})
    private List<Charge> charge;





    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || Hibernate.getClass(this) != Hibernate.getClass(o)) return false;
        Coach coach = (Coach) o;
        return id != null && Objects.equals(id, coach.id);
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }
}
