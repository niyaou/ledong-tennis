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
public class PrepaidCard implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;


    private String name;

    private String number;
    @Column
    private float restCharge;
    @Column
    private float annualCount;
    @Column
    private float timesCount;
    @Column
    private Date annualExpireTime;
    @Column
    private Date timesExpireTime;

    @ManyToMany
    @JoinColumn(name="court_id")
    private List<Course> courses;


    @OneToMany(mappedBy = "prepaidCard",cascade = {CascadeType.REMOVE})
    private List<Charge> charges;

    @OneToMany(mappedBy = "prepaidCard",cascade = {CascadeType.REMOVE})
     private List<Spend> spends;

}
