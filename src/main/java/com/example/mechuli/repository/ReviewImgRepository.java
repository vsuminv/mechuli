package com.example.mechuli.repository;

import com.example.mechuli.domain.Review_img;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ReviewImgRepository extends JpaRepository<Review_img, Long> {
}
