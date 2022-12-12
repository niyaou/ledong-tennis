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
