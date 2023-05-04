package com.ledong.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.ledong.bo.PrepaidCardBo;
import lombok.*;
import org.hibernate.Hibernate;

import javax.persistence.*;
import java.sql.Date;
import java.util.List;
import java.util.Objects;

@Getter
@Setter
@RequiredArgsConstructor
@Builder
@Entity
@AllArgsConstructor
@JsonIgnoreProperties({"courses","charges","spends"})
public class PrepaidCard   {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    private String name;

    private String number;
    private String court;
    @Column
    private float restCharge=0;
    @Column
    private float annualCount=0;
    @Column
    private float timesCount=0;

    @Column
    private Integer equivalentBalance=0;



    @Column
    private Date annualExpireTime;
    @Column
    private Date timesExpireTime;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinColumn(name="course_id")
    private List<Course> courses;


    @OneToMany(mappedBy = "prepaidCard",cascade = {CascadeType.REMOVE})
    private List<Charge> charges;

    @OneToMany(mappedBy = "prepaidCard",cascade = {CascadeType.REMOVE})
    private List<Spend> spends;

    public static PrepaidCard fromBO(PrepaidCardBo bo) {
        return PrepaidCard.builder()
                .id(bo.getId())
                .name(bo.getName())
                .number(bo.getNumber())
                .court(bo.getCourt())
                .equivalentBalance(0)
                .build();
    }



    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || Hibernate.getClass(this) != Hibernate.getClass(o)) return false;
        PrepaidCard that = (PrepaidCard) o;
        return id != null && Objects.equals(id, that.id);
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }
}
