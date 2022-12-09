package com.ledong.bo;

import cn.hutool.core.date.DateTime;
import com.ledong.entity.Coach;
import com.ledong.entity.Court;
import com.ledong.entity.PrepaidCard;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;


@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CourseBo {
    private long id;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private float duration;
    private int courseType;
    private Court court;
    private Coach coach;
    private List<PrepaidCard> member;
    private String description;
}
