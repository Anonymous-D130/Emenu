package com.trulydesignfirm.emenu.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.trulydesignfirm.emenu.dto.NutritionInfo;
import com.trulydesignfirm.emenu.enums.FoodType;
import com.trulydesignfirm.emenu.enums.MeatType;
import com.trulydesignfirm.emenu.enums.ServingInfo;
import com.trulydesignfirm.emenu.enums.Tag;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotEmpty;
import lombok.Getter;
import lombok.Setter;

import java.util.List;
import java.util.UUID;

@Entity
@Getter
@Setter
public class Food {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String imageUrl;

    @Column(nullable = false)
    private Double menuPrice;

    @Column(nullable = false)
    private Double offerPrice;

    private boolean available;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private FoodType foodType;

    @Enumerated(EnumType.STRING)
    private MeatType meatType;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private ServingInfo servingInfo;

    @NotEmpty(message = "At least one tag is required")
    @Enumerated(EnumType.STRING)
    @ElementCollection(fetch = FetchType.EAGER)
    private List<Tag> tag;

    @Embedded
    private NutritionInfo nutritionInfo;

    @ManyToOne
    @JoinColumn(name = "subcategory_id", nullable = false)
    private SubCategory subCategory;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "restaurant_id", nullable = false)
    private Restaurant restaurant;

    public boolean isVeg(){
        return foodType.equals(FoodType.VEG);
    }
    public Category getCategory(){
        return subCategory.getCategory();
    }
}
