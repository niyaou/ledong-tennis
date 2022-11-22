package com.ledong.entity;

import lombok.Data;
import lombok.experimental.Accessors;

import javax.persistence.*;
import java.io.Serializable;
import java.util.List;

@Data
@Accessors(chain = true)
@Entity
public class Coach implements Serializable {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="coach_id",columnDefinition = "bigint COMMENT '主键'")
    private long id;

    private String name;

    private String number;

    private int level;

    @OneToMany(mappedBy = "coach",cascade = {CascadeType.REMOVE})
    private List<Course> courses;

}
