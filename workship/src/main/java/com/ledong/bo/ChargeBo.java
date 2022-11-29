package com.ledong.bo;

import com.ledong.entity.PrepaidCard;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;



@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChargeBo {
    private Long id;
    private PrepaidCard prepaidCard;
    private float charge;
    private float times;
    private float annualTimes;
    private String description;

}
