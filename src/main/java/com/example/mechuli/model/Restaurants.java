package com.example.mechuli.model;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class Restaurants {

    private String restaurantName;// 매장 이름
    private String restaurantAddress;// 매장 주소
    private String restaurantMenu;// 메뉴
    private String menuPrice;// 메뉴 가격

    public Restaurants(String restaurantName, String restaurantAddress, String restaurantMenu, String menuPrice){
        this.restaurantName = restaurantName;
        this.restaurantAddress = restaurantAddress;
        this.restaurantMenu = restaurantMenu;
        this.menuPrice = menuPrice;
    }
}
