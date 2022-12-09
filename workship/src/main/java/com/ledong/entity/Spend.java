package com.ledong.entity;

import com.ledong.bo.CourseBo;
import com.ledong.bo.SpendBo;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.Accessors;

import javax.persistence.*;
import java.io.Serial;
import java.io.Serializable;

@Data
@Accessors(chain = true)
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Spend  implements Serializable {
    @Serial
    private static final long serialVersionUID = 1;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;



    @ManyToOne
    @JoinColumn(name = "prepaid_card_id")
    private PrepaidCard prepaidCard;

    private float charge;
    private float times;
    private float annualTimes;
    private String description;


    @ManyToOne
    @JoinColumn(name = "course_id")
    private Course course;

    public static Spend fromBO(SpendBo bo) {
        return Spend.builder()
                .id(bo.getId())
                .build();
    }

}
