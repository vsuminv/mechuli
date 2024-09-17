package com.example.mechuli.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReviewDetailsDTO {
    private String restaurantName;
    private String reviewText;

    public ReviewDetailsDTO(String restaurantName, String reviewText) {
        this.restaurantName = restaurantName;
        this.reviewText = reviewText;
    }
}
