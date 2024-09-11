package com.example.mechuli.service;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.PutObjectRequest;
import com.example.mechuli.domain.Restaurant;
import com.example.mechuli.domain.Review;
import com.example.mechuli.domain.Review_img;
import com.example.mechuli.dto.ReviewDTO;
import com.example.mechuli.repository.RestaurantRepository;
import com.example.mechuli.repository.ReviewRepository;
import com.example.mechuli.repository.ReviewImgRepository;
import groovy.transform.Final;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReviewService {

    @Autowired
    private final ReviewRepository reviewRepository;
    @Autowired
    private final ReviewImgRepository reviewImgRepository;
    @Autowired
    private final RestaurantRepository restaurantRepository;
    @Autowired
    private AmazonS3 amazonS3;

    private final String BUCKET_NAME = "mechuliproject";

    @Transactional
    public ReviewDTO createReview(ReviewDTO reviewDTO, List<MultipartFile> imageFiles) throws IOException {
        // restaurantId로 레스토랑 조회
        Restaurant restaurant = restaurantRepository.findById(reviewDTO.getRestaurantId())
                .orElseThrow(() -> new IllegalArgumentException("Invalid restaurant ID"));

        // 리뷰 저장
        Review review = Review.builder()
                .content(reviewDTO.getContent())
                .restaurant(restaurant) // 레스토랑 엔티티 설정
                .build();
        Review savedReview = reviewRepository.save(review);

        // 이미지 파일 S3에 업로드 후 URL 저장
        if (imageFiles != null && !imageFiles.isEmpty()) {
            for (MultipartFile file : imageFiles) {
                String imageUrl = uploadImageToS3(file); // S3에 업로드 후 URL 반환
                Review_img reviewImg = Review_img.builder()
                        .img1(imageUrl) // 첫 번째 이미지를 img1에 저장
                        .review(savedReview)
                        .build();
                reviewImgRepository.save(reviewImg);
            }
        }
        return reviewDTO;
    }
    public String uploadImageToS3(MultipartFile file) throws IOException {
        String fileName = "images/" + file.getOriginalFilename();

        // S3에 이미지 업로드
        amazonS3.putObject(new PutObjectRequest(BUCKET_NAME, fileName, file.getInputStream(), null));

        // S3의 이미지 URL 생성
        return amazonS3.getUrl(BUCKET_NAME, fileName).toString();
    }
}
