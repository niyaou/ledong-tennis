package com.ledong.bo;

import com.ledong.entity.Coach;
import com.ledong.entity.Court;
import com.ledong.entity.PrepaidCard;
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
public class CourseBo {
    private long id;
    private Date startTime;
    private Date endTime;
    private float duration;
    private int courseType;
    private Court court;
    private Coach coach;
    private List<PrepaidCard> member;
    private String description;
}
