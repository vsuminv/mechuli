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
public class Restaurant {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="restaurant_id")
    private Long restaurantId; // index

    @Column(name="name")
    private String name;

    @Column(name="image_url", length = 2083)
    private String imageUrl;

    @Column(name="open_time")
    private String openTime;


    @Column(name="close_time")
    private String closeTime;

    @Column(name="address")
    private String address;

    @ManyToOne
    @JoinColumn(name = "category_id") // 외래키
    private RestaurantCategory restaurantCategory;









}
