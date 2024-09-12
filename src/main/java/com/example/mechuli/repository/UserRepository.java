
package com.example.mechuli.repository;

import com.example.mechuli.domain.Restaurant;
import com.example.mechuli.domain.RestaurantCategory;
import com.example.mechuli.domain.UserDAO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<UserDAO, Long> {

    //    public UserDAO findByUserIndex(Long userIndex);
    boolean existsByUserId(String userId);

    boolean existsByNickname(String nickname);

    Optional<UserDAO> findByUserId(String userId);
    List<Restaurant> findByRestaurantCategory(RestaurantCategory category);
}