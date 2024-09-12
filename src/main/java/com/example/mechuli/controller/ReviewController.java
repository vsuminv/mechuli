package com.example.mechuli.controller;

import com.example.mechuli.dto.ReviewDTO;
import com.example.mechuli.service.ReviewImgService;
import com.example.mechuli.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    @Autowired
    private final ReviewService reviewService;
    @Autowired
    private final ReviewImgService reviewImgService;

    @PostMapping
    public ResponseEntity<ReviewDTO> createReview(@RequestPart ReviewDTO reviewDTO,
                                                  @RequestPart List<MultipartFile> imageFiles) throws IOException {
        ReviewDTO createdReview = reviewService.createReview(reviewDTO, imageFiles);
        return ResponseEntity.ok(createdReview);
    }

    @GetMapping("/{reviewId}")
    public ResponseEntity<ReviewDTO> getReview(@PathVariable Long reviewId) {
        ReviewDTO reviewDTO = reviewService.getReview(reviewId);
        return ResponseEntity.ok(reviewDTO);
    }
}
