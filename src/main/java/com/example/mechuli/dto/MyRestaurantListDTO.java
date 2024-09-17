package com.example.mechuli.dto;

import com.example.mechuli.domain.MyRestaurantList;
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
    private Long myListIndex;
    private Long restaurant_id;
    private Long user_index;
    private String restaurantName;

    public MyRestaurantListDTO(Restaurant restaurantList, UserDAO userDAO) {
        this.restaurant_id = restaurantList.getRestaurantId();
        this.user_index = userDAO.getUserIndex();
    }

    public MyRestaurantListDTO(Long myListIndex, Restaurant restaurantList) {
        this.myListIndex = myListIndex;
        this.restaurant_id = restaurantList.getRestaurantId();
    }

    public MyRestaurantListDTO(MyRestaurantList myRestaurantList) {
        this.myListIndex = myRestaurantList.getMyListIndex();
        this.restaurant_id = myRestaurantList.getRestaurantList().getRestaurantId();
        this.user_index = myRestaurantList.getMyListIndex();
        this.restaurantName = myRestaurantList.getRestaurantList().getName();
    }
}
