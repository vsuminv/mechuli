package com.example.mechuli.domain;


import jakarta.persistence.*;
import lombok.*;


@Entity
@Builder
@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "my_restaurant_list")
public class MyRestaurantList {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="my_list_index")
    private Long myListIndex; // index


    @ManyToOne
    @JoinColumn(name = "restaurant_id") // 외래키
    private Restaurant restaurantList;

    @ManyToOne
    @JoinColumn(name = "user_index") // 외래키
    private UserDAO userDAO;

}
