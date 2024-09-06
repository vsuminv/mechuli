package com.example.mechuli.dto;

import com.example.mechuli.domain.Restaurant;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RestaurantDTO {
    private Long restaurant_id;
    private String name;
    private String img_url;
    private String category_name;

    public RestaurantDTO(Restaurant restaurant){
        this.restaurant_id = restaurant.getRestaurantId();
        this.name = restaurant.getName();
        this.img_url = restaurant.getImageUrl();
        this.category_name = restaurant.getRestaurantCategory().getCategoryName();
    }
}
