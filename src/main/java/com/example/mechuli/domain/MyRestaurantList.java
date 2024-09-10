package com.example.mechuli.domain;


import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Builder
@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class MyRestaurantList {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="myList_index")
    private Long myListIndex; // index


    @ManyToOne
    @JoinColumn(name = "restaurant_id") // 외래키
    private Restaurant restaurantList;

    @ManyToOne
    @JoinColumn(name = "user_index") // 외래키
    private UserDAO userDAO;


}
