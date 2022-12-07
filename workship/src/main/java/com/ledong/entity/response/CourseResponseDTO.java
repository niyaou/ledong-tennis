package com.ledong.entity.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.ledong.entity.Coach;
import com.ledong.entity.Court;
import com.ledong.entity.PrepaidCard;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Date;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CourseResponseDTO {
    private Date startTime;
    private Date endTime;
    private float duration;
    private int courseTime;
    private Court court;
    private Coach coach;
    private List<PrepaidCard> member;
    private String description;
}
