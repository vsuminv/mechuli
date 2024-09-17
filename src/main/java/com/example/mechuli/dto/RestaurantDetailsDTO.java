package com.example.mechuli.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RestaurantDetailsDTO {

    private String name;
    private String imageUrl;

    public RestaurantDetailsDTO(String name, String imageUrl) {
        this.name = name;
        this.imageUrl = imageUrl;
    }
}
