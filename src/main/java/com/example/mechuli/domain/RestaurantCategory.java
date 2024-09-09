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
public class RestaurantCategory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="category_id")
    private Long categoryId; // index

    @Column(name="category_name")
    private String categoryName;

    @OneToMany( mappedBy = "restaurantCategory")
    private List<Restaurant> restaurants;

    @ManyToMany(mappedBy = "restaurantCategory")
    private List<UserDAO> userDAO;

}
