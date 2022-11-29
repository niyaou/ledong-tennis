package com.ledong.entity;

import com.ledong.bo.PrepaidCardBo;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.Accessors;

import javax.persistence.*;
import java.io.Serializable;
import java.sql.Date;
import java.util.List;

@Data
@Builder
@Accessors(chain = true)
@Entity
@NoArgsConstructor
@AllArgsConstructor
public class PrepaidCard implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;


    private String name;

    private String number;
    @Column
    private float restCharge;
    @Column
    private float annualCount;
    @Column
    private float timesCount;
    @Column
    private Date annualExpireTime;
    @Column
    private Date timesExpireTime;

    @ManyToMany
    @JoinColumn(name="court_id")
    private List<Course> courses;


    @OneToMany(mappedBy = "prepaidCard",cascade = {CascadeType.REMOVE})
    private List<Charge> charges;

    @OneToMany(mappedBy = "prepaidCard",cascade = {CascadeType.REMOVE})
     private List<Spend> spends;

    public static PrepaidCard fromBO(PrepaidCardBo bo) {
        return PrepaidCard.builder()
                .id(bo.getId())
                .name(bo.getName())
                .number(bo.getNumber())
                .build();
    }

}
