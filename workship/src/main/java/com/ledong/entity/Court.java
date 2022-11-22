package com.ledong.entity;


import lombok.Data;
import lombok.experimental.Accessors;

import javax.persistence.*;
import java.io.Serializable;
import java.util.List;

@Data
@Accessors(chain = true)
@Entity
public class Court  implements Serializable {

   @Id
   @GeneratedValue(strategy = GenerationType.IDENTITY)
   private long id;

   private String name;

   @OneToMany(mappedBy="court",cascade = {CascadeType.REMOVE})
   private List<Course> courses;

}
