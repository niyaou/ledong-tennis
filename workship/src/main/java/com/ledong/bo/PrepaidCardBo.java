package com.ledong.bo;

import com.ledong.entity.Charge;
import com.ledong.entity.Course;
import com.ledong.entity.Spend;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.sql.Date;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PrepaidCardBo {
    private long id;
    private String name;
    private String number;
    private String court;
    private float restCharge;
    private float annualCount;
    private float timesCount;
    private Integer equivalentBalance;
    private Integer younths;
    private Integer adults;
    private Date annualExpireTime;
    private Date timesExpireTime;
    private List<Course> courses;
    private List<Charge> charges;
    private List<Spend> spends;

}
