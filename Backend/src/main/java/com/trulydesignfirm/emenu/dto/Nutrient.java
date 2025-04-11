package com.trulydesignfirm.emenu.dto;

import jakarta.persistence.Embeddable;
import lombok.Getter;
import lombok.Setter;

@Embeddable
@Getter
@Setter
public class Nutrient {
    private Double value;
    private String unit;
}
