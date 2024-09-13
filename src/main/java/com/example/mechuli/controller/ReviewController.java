package com.example.mechuli.controller;

import com.example.mechuli.dto.ReviewDTO;
import com.example.mechuli.service.ReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpStatus;
import org.springframework.http.RequestEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
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
    public HttpEntity<String> createReview(@Valid @RequestPart(name = "reviewDto") ReviewDTO reviewDTO,
                                           @RequestPart(value = "file", required = false) MultipartFile file,
                                           BindingResult bindingResult) {

        if (reviewDTO.getReviewImg() != null) {
            try {
                String imageUrl = reviewService.uploadImageToS3(file);
                reviewDTO.setReviewImg(Collections.singletonList(imageUrl));

                reviewService.saveReview(reviewDTO);
            } catch (IOException e) {
                // 이미지 업로드 실패 시
                bindingResult.rejectValue("file", "error.reviewDTO", "이미지 업로드 중 오류가 발생했습니다.");
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body("이미지 업로드 중 오류가 발생했습니다.");
            }
        }

        // restaurantId와 userIndex 형변환 로직 추가
        if (reviewDTO.getRestaurant() != null && reviewDTO.getUserIndex() != null) {
            try {
                // String 값을 Long으로 변환할 경우
                Long restaurantId = Long.parseLong(reviewDTO.getRestaurant().toString());
                Long userIndex = Long.parseLong(reviewDTO.getUserIndex().toString());

                // 형변환 후 처리
                System.out.println("Restaurant ID: " + restaurantId);
                System.out.println("User Index: " + userIndex);

                // 리뷰 생성 로직 호출
                reviewDTO.setRestaurant(restaurantId);
                reviewDTO.setUserIndex(userIndex);

            } catch (NumberFormatException e) {
                // 형변환 오류 처리
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("형변환 중 오류가 발생했습니다. 올바른 형식의 데이터를 입력해 주세요.");
            }
        }

        return ResponseEntity.ok("good");
    }
//
//    // 특정 리뷰 조회
//    @GetMapping("/{reviewId}")
//    public ResponseEntity<ReviewDTO> getReview(@PathVariable Long reviewId) {
//        try {
//            ReviewDTO reviewDTO = reviewService.getReview(reviewId);
//            return new ResponseEntity<>(reviewDTO, HttpStatus.OK);
//        } catch (IllegalArgumentException e) {
//            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
//        }
//    }
//
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