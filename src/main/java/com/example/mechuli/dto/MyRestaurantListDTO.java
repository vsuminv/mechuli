package com.example.mechuli.dto;

import com.example.mechuli.domain.Restaurant;
import com.example.mechuli.domain.UserDAO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MyRestaurantListDTO {
    private Long restaurant_id;
    private Long user_index;

    public MyRestaurantListDTO(Restaurant restaurantList, UserDAO userDAO) {
        this.restaurant_id = restaurantList.getRestaurantId();
        this.user_index = userDAO.getUserIndex();
    }
}
