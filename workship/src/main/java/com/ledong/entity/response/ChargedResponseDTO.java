package com.ledong.entity.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.ledong.entity.PrepaidCard;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.Column;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import java.sql.Date;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChargedResponseDTO {
    private float charge;
    private float times;
    private float annualTimes;
    private String description;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date chargedTime;
    private int notified;
}
