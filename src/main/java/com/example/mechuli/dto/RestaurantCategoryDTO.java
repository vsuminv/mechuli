package com.example.mechuli.dto;

import com.example.mechuli.domain.Restaurant;
import com.example.mechuli.domain.RestaurantCategory;
import jakarta.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RestaurantCategoryDTO {
    private Long categoryId;
    private String categoryName;

    public RestaurantCategoryDTO(RestaurantCategory restaurantCategory){
        this.categoryId = restaurantCategory.getCategoryId();
        this.categoryName = restaurantCategory.getCategoryName();
    }
}