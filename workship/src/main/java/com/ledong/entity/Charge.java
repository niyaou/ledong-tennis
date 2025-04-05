package com.ledong.entity;


import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.ledong.bo.ChargeBo;
import lombok.*;
import org.hibernate.Hibernate;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.Objects;

@Getter
@Setter
@RequiredArgsConstructor
@Builder
@Entity
@EntityListeners(AuditingEntityListener.class)
@AllArgsConstructor
@JsonIgnoreProperties({"prepaidCard"})
public class Charge   {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    @ManyToOne
    @JoinColumn(name = "prepaidCard_id")
    private PrepaidCard prepaidCard;

    private float charge;
    private float times;
    private float annualTimes;
    private int notified;

    private int worth=0;
    private String court;

    @ManyToOne
    @JoinColumn(name = "coach_id")
    private Coach coach;

    @JsonFormat(pattern = "yyyy-MM-dd", timezone = "GMT+8")
    @CreatedDate
    @Column( columnDefinition = "datetime")
    private LocalDateTime chargedTime;

    @Column(length =200,name = "description")
    private String description;

    public static Charge fromBO(ChargeBo bo) {
        return Charge.builder()
                .id(bo.getId())
                .charge(bo.getCharge())
              .chargedTime(bo.getChargedTime())
                .times(bo.getTimes())
                .worth(bo.getWorth())
                .court(bo.getCourt())
                .annualTimes(bo.getAnnualTimes())
                .chargedTime(bo.getChargedTime())
                .prepaidCard(bo.getPrepaidCard())
                .build();
    }



    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || Hibernate.getClass(this) != Hibernate.getClass(o)) return false;
        Charge charge = (Charge) o;
        return id != null && Objects.equals(id, charge.id);
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }
}
