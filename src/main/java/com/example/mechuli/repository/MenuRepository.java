package com.example.mechuli.repository;

import com.example.mechuli.domain.Menu;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MenuRepository extends JpaRepository<Menu, Long> {
    List<Menu> findByRestaurantId(Long restaurantId);
}
