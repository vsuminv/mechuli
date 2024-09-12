package com.example.mechuli.service;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.PutObjectRequest;
import com.example.mechuli.domain.Restaurant;
import com.example.mechuli.domain.Review;
//import com.example.mechuli.domain.Review_img;
import com.example.mechuli.dto.ReviewDTO;
import com.example.mechuli.repository.RestaurantRepository;
import com.example.mechuli.repository.ReviewRepository;
import com.example.mechuli.repository.ReviewImgRepository;
//import groovy.transform.Final;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
//    private final ReviewImgRepository reviewImgRepository;
    private final RestaurantRepository restaurantRepository;
    private final ReviewImgService reviewImgService;

    @Autowired
    private AmazonS3 amazonS3;

    private final String BUCKET_NAME = "mechuliproject";

    @Transactional(readOnly = true)
    public ReviewDTO getReview(Long reviewId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new IllegalArgumentException("Review not found"));

        return convertToDTO(review);
    }

    @Transactional
    public ReviewDTO createReview(ReviewDTO reviewDTO, List<MultipartFile> imageFiles) throws IOException {
        // restaurantId로 레스토랑 조회
        Restaurant restaurant = restaurantRepository.findById(reviewDTO.getRestaurantId())
                .orElseThrow(() -> new IllegalArgumentException("Invalid restaurant ID"));

        // 리뷰 저장
        Review review = Review.builder()
                .content(reviewDTO.getContent())
                .restaurant(restaurant)
                .build();
        Review savedReview = reviewRepository.save(review);

        // 이미지 파일 S3에 업로드 후 URL 저장
        if (imageFiles != null && !imageFiles.isEmpty()) {
            reviewImgService.saveReviewImages(imageFiles, savedReview);
        }

        return convertToDTO(savedReview);
    }

    // Review -> ReviewDTO 변환 메서드
    private ReviewDTO convertToDTO(Review review) {
        return ReviewDTO.builder()
                .reviewId(review.getReviewId())
                .content(review.getContent())
                .restaurantId(review.getRestaurant().getRestaurantId())
                .imgUrls(review.getReview_img().stream()
                        .flatMap(img -> List.of(img.getImg1(), img.getImg2(), img.getImg3()).stream())
                        .filter(url -> url != null)
                        .collect(Collectors.toList()))
                .build();
    }

    public String uploadImageToS3(MultipartFile file) throws IOException {
        String fileName = "images/" + file.getOriginalFilename();

        // S3에 이미지 업로드
        amazonS3.putObject(new PutObjectRequest(BUCKET_NAME, fileName, file.getInputStream(), null));

        // S3의 이미지 URL 생성
        return amazonS3.getUrl(BUCKET_NAME, fileName).toString();
    }
}
