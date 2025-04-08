package com.trulydesignfirm.emenu.dto;

import jakarta.persistence.AttributeOverride;
import jakarta.persistence.AttributeOverrides;
import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.Getter;
import lombok.Setter;

@Embeddable
@Getter
@Setter
public class NutritionInfo {

    @AttributeOverrides({
            @AttributeOverride(name = "value", column = @Column(name = "calories_value")),
            @AttributeOverride(name = "unit", column = @Column(name = "calories_unit"))
    })
    private Nutrient calories;

    @AttributeOverrides({
            @AttributeOverride(name = "value", column = @Column(name = "protein_value")),
            @AttributeOverride(name = "unit", column = @Column(name = "protein_unit"))
    })
    private Nutrient protein;

    @AttributeOverrides({
            @AttributeOverride(name = "value", column = @Column(name = "carbohydrates_value")),
            @AttributeOverride(name = "unit", column = @Column(name = "carbohydrates_unit"))
    })
    private Nutrient carbohydrates;

    @AttributeOverrides({
            @AttributeOverride(name = "value", column = @Column(name = "fats_value")),
            @AttributeOverride(name = "unit", column = @Column(name = "fats_unit"))
    })
    private Nutrient fats;

    @AttributeOverrides({
            @AttributeOverride(name = "value", column = @Column(name = "fiber_value")),
            @AttributeOverride(name = "unit", column = @Column(name = "fiber_unit"))
    })
    private Nutrient fiber;

    @AttributeOverrides({
            @AttributeOverride(name = "value", column = @Column(name = "sugar_value")),
            @AttributeOverride(name = "unit", column = @Column(name = "sugar_unit"))
    })
    private Nutrient sugar;
}

