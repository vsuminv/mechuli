package com.example.mechuli.controller;

import com.example.mechuli.dto.ReviewDTO;
import com.example.mechuli.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    // 리뷰 생성
    @PostMapping
    public ResponseEntity<ReviewDTO> createReview(@RequestPart("review") ReviewDTO reviewDTO,
                                                  @RequestPart(value = "images", required = false) List<MultipartFile> images) {
        try {
            // 이미지 업로드 및 URL 반환
            List<String> imageUrls = reviewService.uploadImages(images);

            // 이미지 URL을 ReviewDTO에 설정
            reviewDTO.setReviewImg(imageUrls);

            // 리뷰 생성
            ReviewDTO createdReview = reviewService.createReview(reviewDTO);
            return new ResponseEntity<>(createdReview, HttpStatus.CREATED);
        } catch (IOException e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }
    }

    // 특정 리뷰 조회
    @GetMapping("/{reviewId}")
    public ResponseEntity<ReviewDTO> getReview(@PathVariable Long reviewId) {
        try {
            ReviewDTO reviewDTO = reviewService.getReview(reviewId);
            return new ResponseEntity<>(reviewDTO, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
    }

    // 모든 리뷰 조회
    @GetMapping
    public ResponseEntity<List<ReviewDTO>> getAllReviews() {
        List<ReviewDTO> reviews = reviewService.getAllReviews();
        return new ResponseEntity<>(reviews, HttpStatus.OK);
    }

    // 리뷰 삭제
    @DeleteMapping("/{reviewId}")
    public ResponseEntity<Void> deleteReview(@PathVariable Long reviewId) {
        try {
            reviewService.deleteReview(reviewId);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}
