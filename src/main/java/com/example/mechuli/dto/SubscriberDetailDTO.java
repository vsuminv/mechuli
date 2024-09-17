package com.example.mechuli.dto;


import com.example.mechuli.domain.MyRestaurantList;
import com.example.mechuli.domain.Restaurant;
import com.example.mechuli.domain.Review;
import com.example.mechuli.domain.Subscription;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
//@AllArgsConstructor
@Builder

public class SubscriberDetailDTO {
    String nickname;
    String userImg;
    List<RestaurantDetailsDTO> myRestaurantLists;
    List<ReviewDetailsDTO> reviewList;

    public SubscriberDetailDTO(String nickname, String userImg, List<RestaurantDetailsDTO> myRestaurantLists, List<ReviewDetailsDTO> reviewList) {
        this.nickname = nickname;
        this.userImg = userImg;
        this.myRestaurantLists = myRestaurantLists;
        this.reviewList = reviewList;
    }

}
