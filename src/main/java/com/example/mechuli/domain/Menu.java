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
@Table(name = "menu")
public class Menu {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="menu_id")
    private Long menuId; // index

    @Column(name="menu_name")
    private String menuName;

    @Column(name="price")
    private String price;

    @Column(name="image_url", length = 2083)
    private String imageUrl;

    @ManyToOne
    @JoinColumn(name = "restaurant_id") // 외래키
    private Restaurant restaurant;




}
