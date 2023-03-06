package com.ledong.bo;

import com.ledong.entity.Course;
import com.ledong.entity.PrepaidCard;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.sql.Date;


@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SpendBo {
    private long id;
    private PrepaidCard prepaidCard;
    private float charge;
    private float times;
    private float annualTimes;
    private float description;
    private Course course;
    private int quantities=1;

}
