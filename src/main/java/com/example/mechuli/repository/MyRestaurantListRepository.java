package com.example.mechuli.repository;

import com.example.mechuli.domain.Menu;
import com.example.mechuli.domain.MyRestaurantList;
import com.example.mechuli.domain.UserDAO;
import com.example.mechuli.dto.MyRestaurantListDTO;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface MyRestaurantListRepository extends JpaRepository<MyRestaurantList, Long> {
    boolean existsByRestaurantList_restaurantIdAndUserDAO_userIndex(Long restaurantId, Long userIndex);
    Optional<MyRestaurantList> findByRestaurantList_restaurantIdAndUserDAO_userIndex(Long restaurantId, Long userIndex);
    @Transactional
    void deleteByRestaurantList_restaurantIdAndUserDAO_userIndex(Long restaurantId, Long userIndex);

    List<MyRestaurantList> findByUserDAO(UserDAO userDAO);
    List<MyRestaurantList> findAllByUserDAO_UserIndex(Long userIndex);

}