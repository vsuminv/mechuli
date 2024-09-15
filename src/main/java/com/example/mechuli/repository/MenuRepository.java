package com.example.mechuli.repository;


import com.example.mechuli.domain.Menu;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MenuRepository extends JpaRepository<Menu, Long> {


    List<Menu> findAllByRestaurant_RestaurantId(Long restaurantId);

}
