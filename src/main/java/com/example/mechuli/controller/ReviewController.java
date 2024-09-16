package com.example.mechuli.controller;

import com.example.mechuli.domain.Review;
import com.example.mechuli.domain.UserDAO;
import com.example.mechuli.dto.ReviewDTO;
import com.example.mechuli.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Collections;
import java.util.List;

@RestController
@RequiredArgsConstructor
public class ReviewController {

    @Autowired
    private final ReviewService reviewService;

    @PostMapping("/reviews")
    public ResponseEntity<List<Review>> createReview(@RequestPart(name = "reviewDto") ReviewDTO reviewDTO,
                                                     @RequestPart(value = "files", required = false) List<MultipartFile> files,
                                                     @RequestParam("restaurantId") Long restaurantId,
                                                     @AuthenticationPrincipal UserDAO authUser) throws IOException {
        if (authUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        if (files != null && !files.isEmpty()) {
            reviewService.save(authUser, reviewDTO, restaurantId, files);
        } else {
            reviewService.save(authUser, reviewDTO, restaurantId, Collections.emptyList());
        }

        return ResponseEntity.ok().build();
    }

    // 특정 식당의 리뷰 데이터를 JSON으로 반환하는 API
    @GetMapping("/api/r_reviews")
    public List<ReviewDTO> getReviewsByRestaurant(@RequestParam("restaurantId") Long restaurantId) {
        List<ReviewDTO> reviews = reviewService.getReviewsByRestaurant(restaurantId);
        return reviews;
    }
//    // 모든 리뷰 조회
//    @GetMapping
//    public List<ReviewDTO> getAllReviews() {
//        List<ReviewDTO> reviews = reviewService.getAllReviews();
//        return reviews;
//    }
//
//    // 리뷰 삭제
//    @DeleteMapping("/{reviewId}")
//    public ResponseEntity<Void> deleteReview(@PathVariable Long reviewId) {
//        try {
//            reviewService.deleteReview(reviewId);
//            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
//        } catch (IllegalArgumentException e) {
//            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
//        }
//    }
}