package com.example.mechuli.repository;

import com.example.mechuli.domain.Menu;
import com.example.mechuli.domain.Restaurant;
import com.example.mechuli.domain.RestaurantCategory;
import com.example.mechuli.dto.RestaurantDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RestaurantRepository extends JpaRepository<Restaurant, Long> {
    List<Restaurant> findByRestaurantCategory(RestaurantCategory category);
    List<Restaurant> findByRestaurantCategory_CategoryId(Long categoryId);

    Optional<RestaurantDTO> findByRestaurantId(Long restaurantId);

//    List<Menu> findByMenu_MenuId(Long restaurantId);

//    List<Restaurant> findRestaurantCategoryByCategoryId(Long categoryId);
//    RestaurantCategory findByCategoryName(String categoryName);

}