package com.ledong.entity;


import lombok.*;
import lombok.experimental.Accessors;

import javax.persistence.*;
import java.io.Serial;
import java.io.Serializable;

@Entity
@Data
@Accessors(chain = true)
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

    @Column(length =200,name = "description")
    private String description;


}
