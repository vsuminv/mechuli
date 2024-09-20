package com.example.mechuli.dto;

import com.example.mechuli.domain.Restaurant;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RestaurantDTO {
    private Long restaurant_id;
    private String name;
    private String img_url;
    private String open_time;
    private String close_time;
    private String address;
    private String category_name;

    public RestaurantDTO(Restaurant restaurant){
        this.restaurant_id = restaurant.getRestaurantId();
        this.name = restaurant.getName();
        this.img_url = restaurant.getImageUrl();


        // null값 들어있는 카테고리가 있어서 조건문으로 처리
        if (restaurant.getRestaurantCategory() != null) {
            this.category_name = restaurant.getRestaurantCategory().getCategoryName();
        } else {
            this.category_name = "없음";
        }
    }
}
