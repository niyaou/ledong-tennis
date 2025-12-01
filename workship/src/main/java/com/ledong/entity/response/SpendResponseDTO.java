package com.ledong.entity.response;

import com.ledong.entity.Course;
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
    private float description;
    private Course course;
    private int quantities;
}
