package com.backend.pizzaingredient.persistence.entity;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Languages {

   @NotBlank
   private String en;

   @NotBlank
   private String es;
}
