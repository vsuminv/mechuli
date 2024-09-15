package com.example.mechuli.repository;

import com.example.mechuli.domain.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {

    // 특정 식당의 리뷰를 찾는 메소드
    List<Review> findByRestaurantId(Long restaurantId);

    // 특정 유저의 리뷰를 찾는 메소드
    List<Review> findByUserIndex(Long userIndex);
}
