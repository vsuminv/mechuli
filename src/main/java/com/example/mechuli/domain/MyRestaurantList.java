package com.example.mechuli.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "my_restaurant_list")
public class MyRestaurantList  {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idx;

    @ManyToOne
//    @JoinColumn(name = "user_id")
    private UserDAO M_user;

    private String restaurantName;

    // 파라미터가 있는 생성자
    public MyRestaurantList(UserDAO M_user, String restaurantName) {
        this.M_user = M_user;
        this.restaurantName = restaurantName;
    }
}
