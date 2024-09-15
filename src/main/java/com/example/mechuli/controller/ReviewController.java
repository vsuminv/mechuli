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
@RequestMapping("/reviews")
@RequiredArgsConstructor
public class ReviewController {

    @Autowired
    private final ReviewService reviewService;

    // 리뷰 생성
    @PostMapping
    public ResponseEntity<List<Review>> createReview(@RequestPart(name = "reviewDto") ReviewDTO reviewDTO,
                                                     @RequestPart(value = "files", required = false) List<MultipartFile> files,
                                                     @RequestParam("restaurantId")Long restaurantId,
                                                     @AuthenticationPrincipal UserDAO authUser) throws IOException {
       // 유저 인
        if(authUser == null){
            System.out.println("User is not authenticated.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        if(files != null && !files.isEmpty()) {

            System.out.println("Files found: " + files.size());
            reviewService.save(authUser, reviewDTO, restaurantId, files);
        }else {
            System.out.println("Files is null");
            reviewService.save(authUser, reviewDTO, restaurantId, Collections.emptyList());
        }
        return ResponseEntity.ok().build();
    }

    // 특정 식당의 리뷰 조회
    @GetMapping("/review")
    public ResponseEntity<List<ReviewDTO>> getReviewsByRestaurant(@RequestParam("restaurantId")Long restaurantId) {
        List<ReviewDTO> reviews = reviewService.getReviewsByRestaurant(restaurantId);
        return ResponseEntity.ok(reviews);
    }

    // 특정 유저의 리뷰 조회
    @GetMapping("/review-user")
    public ResponseEntity<List<ReviewDTO>> getReviewsByUser(@AuthenticationPrincipal UserDAO authUser) {
        // 유저 인증
        if(authUser == null){
            System.out.println("User is not authenticated.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        List<ReviewDTO> reviews = reviewService.getReviewsByUserIndex(authUser.getUserIndex());
        return ResponseEntity.ok(reviews);
    }
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