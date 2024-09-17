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

    // 수정할 리뷰 조회
    @GetMapping("/reviews/{reviewId}")
    public ResponseEntity<ReviewDTO> getReviewById(@PathVariable Long reviewId) {
        ReviewDTO reviewDTO = reviewService.getReviewById(reviewId);
        if (reviewDTO == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        return ResponseEntity.ok(reviewDTO);
    }

    // 리뷰 수정
    @PutMapping("/reviews/{reviewId}")
    public ResponseEntity<Void> updateReview(@PathVariable Long reviewId,
                                             @RequestPart(name = "reviewDto") ReviewDTO reviewDTO,
                                             @RequestPart(value = "files", required = false) List<MultipartFile> files,
                                             @AuthenticationPrincipal UserDAO authUser) throws IOException {
        if (authUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        // 수정된 리뷰 저장
        reviewService.updateReview(reviewId, authUser, reviewDTO, files);

        return new ResponseEntity<>(HttpStatus.OK);
    }

    // 특정 식당의 리뷰 데이터를 JSON으로 반환하는 API
    @GetMapping("/api/r_reviews")
    public List<ReviewDTO> getReviewsByRestaurant(@RequestParam("restaurantId") Long restaurantId) {
        List<ReviewDTO> reviews = reviewService.getReviewsByRestaurant(restaurantId);
        System.out.println(reviews);
        return reviews;
    }

    @GetMapping("/api/u_reviews")
    public List<ReviewDTO> getReviewsByUser(@AuthenticationPrincipal UserDAO authUser) {
        if (authUser == null) {
            return null;
        }
        List<ReviewDTO> reviews = reviewService.getReviewsByUserIndex(authUser.getUserIndex());
        System.out.println(reviews);
        return reviews;
    }

    // 리뷰 삭제
    @DeleteMapping("/reviews/{reviewId}")
    public ResponseEntity<Void> deleteReview(@PathVariable Long reviewId) {
        try {
            reviewService.deleteReview(reviewId);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}