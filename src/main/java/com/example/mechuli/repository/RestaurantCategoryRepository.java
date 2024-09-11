package com.example.mechuli.repository;

import com.example.mechuli.domain.RestaurantCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RestaurantCategoryRepository extends JpaRepository<RestaurantCategory, Long> {
//    RestaurantCategory findByCategoryName(String categoryName);

    //    List<RestaurantCategory> findAll();
    List<RestaurantCategory> findRestaurantCateogyByUserDAOUserIndex(Long userIndex);


}