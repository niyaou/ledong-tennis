package com.ledong.entity;


import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.ledong.bo.SpendBo;
import lombok.*;
import org.hibernate.Hibernate;

import javax.persistence.*;
import java.util.Objects;


@Getter
@Setter
@Entity
@NoArgsConstructor // 无参构造方法
@Builder
@AllArgsConstructor
@JsonIgnoreProperties({"prepaidCard","course"})
public class Spend  {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    @ManyToOne
    @JoinColumn(name = "prepaidCard_id")
    private PrepaidCard prepaidCard;

    private float charge;
    private float times;
    private float annualTimes;
    private float description;
    private int quantities;


    @ManyToOne
    @JoinColumn(name ="course_id")
    @OrderBy("startTime desc")
    private Course course;

    public static Spend fromBO(SpendBo bo) {
        return Spend.builder()
                .id(bo.getId())
                .charge(bo.getCharge())
                .times(bo.getTimes())
                .annualTimes(bo.getAnnualTimes())
                .description(bo.getDescription())
                .course(bo.getCourse())
                .prepaidCard(bo.getPrepaidCard())
                .quantities(bo.getQuantities())
                .build();
    }


    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || Hibernate.getClass(this) != Hibernate.getClass(o)) return false;
        Spend spend = (Spend) o;
        return id != null && Objects.equals(id, spend.id);
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }


}
