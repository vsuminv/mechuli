package com.example.mechuli.repository;

import com.example.mechuli.domain.Review;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    // 필요시 커스텀 쿼리를 작성할 수 있음
}
