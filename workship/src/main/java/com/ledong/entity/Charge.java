package com.ledong.entity;


import com.fasterxml.jackson.annotation.JsonFormat;
import com.ledong.bo.PrepaidCardBo;
import lombok.*;
import lombok.experimental.Accessors;
import org.hibernate.annotations.CreationTimestamp;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import org.springframework.data.jpa.repository.Temporal;

import javax.persistence.*;
import java.io.Serial;
import java.io.Serializable;
import java.sql.Date;
import java.time.LocalDateTime;

@Data
@Builder
@Accessors(chain = true)
@Entity
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class Charge implements Serializable {

    @Serial
    private static final long serialVersionUID = 1;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;



    @ManyToOne
    @JoinColumn(name = "prepaid_card_id")
    private PrepaidCard prepaidCard;

    private float charge;
    private float times;
    private float annualTimes;
    private int notified;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    @CreatedDate
    @Column( columnDefinition = "datetime")
    private LocalDateTime chargedTime;

    @Column(length =200,name = "description")
    private String description;

    public static Charge fromBO(Charge bo) {
        return Charge.builder()
                .id(bo.getId())
                .prepaidCard(bo.getPrepaidCard())
                .build();
    }
}
