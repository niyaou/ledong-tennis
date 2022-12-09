package com.ledong.entity.response;

import com.ledong.entity.Course;
import com.ledong.entity.PrepaidCard;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SpendResponseDTO {
    private long id;
//    private PrepaidCard prepaidCard;
    private float charge;
    private float times;
    private float annualTimes;
    private String description;
    private Course course;
}
