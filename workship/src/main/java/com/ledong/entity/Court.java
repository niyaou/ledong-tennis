package com.ledong.entity;


import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.*;
import org.hibernate.Hibernate;

import javax.persistence.*;
import java.util.List;
import java.util.Objects;

@Getter
@Setter
@RequiredArgsConstructor
@Entity
@JsonIgnoreProperties({"courses"})
public class Court    {

   @Id
   @GeneratedValue(strategy = GenerationType.IDENTITY)
   private Long id;

   private String name;
   private int isActive=1;

   @OneToMany(mappedBy="court",cascade = {CascadeType.REMOVE})
   private List<Course> courses;


   @Override
   public boolean equals(Object o) {
      if (this == o) return true;
      if (o == null || Hibernate.getClass(this) != Hibernate.getClass(o)) return false;
      Court court = (Court) o;
      return id != null && Objects.equals(id, court.id);
   }

   @Override
   public int hashCode() {
      return getClass().hashCode();
   }
}
