package com.example.mechuli.repository;

import com.example.mechuli.domain.Menu;
import com.example.mechuli.domain.MyRestaurantList;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MyRestaurantListRepository extends JpaRepository<MyRestaurantList, Long> {
    boolean existsByRestaurantList_restaurantIdAndUserDAO_userIndex(Long restaurantId, Long userIndex);
}