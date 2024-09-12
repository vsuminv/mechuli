package com.example.mechuli.service;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.PutObjectRequest;
import com.example.mechuli.domain.Review;
import com.example.mechuli.domain.ReviewImg;
import com.example.mechuli.dto.ReviewDTO;
import com.example.mechuli.repository.ReviewRepository;
import com.example.mechuli.repository.ReviewImgRepository;
import com.example.mechuli.repository.RestaurantRepository;
import com.example.mechuli.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

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
    private final UserRepository userRepository;
    @Autowired
    private AmazonS3 amazonS3;

    private final String BUCKET_NAME = "mechuliproject";

    public String uploadImageToS3(MultipartFile file) throws IOException {
        try {
            String fileName = "images/" + file.getOriginalFilename();
            amazonS3.putObject(new PutObjectRequest(BUCKET_NAME, fileName, file.getInputStream(), null));
            return amazonS3.getUrl(BUCKET_NAME, fileName).toString();
        } catch (IOException e) {
            throw new RuntimeException("이미지 업로드 실패", e);
        }
    }

    // 리뷰 생성
    public ReviewDTO createReview(ReviewDTO reviewDTO) {
        var user = userRepository.findById(reviewDTO.getUserIndex())
                .orElseThrow(() -> new IllegalArgumentException("유저를 찾을 수 없습니다."));
        var restaurant = restaurantRepository.findById(reviewDTO.getRestaurantId().getRestaurantId())
                .orElseThrow(() -> new IllegalArgumentException("식당을 찾을 수 없습니다."));

        // DTO에서 엔티티로 변환
        Review review = Review.builder()
                .content(reviewDTO.getContent())
                .userIndex(user)
                .restaurant(restaurant)
                .createDate(new Date()) // 현재 시간으로 설정
                .updateDate(new Date()) // 현재 시간으로 설정
                .build();
        System.out.println(review);
        System.out.println("=========");
        // 리뷰 저장
        Review savedReview = reviewRepository.save(review);

        // 이미지 URL이 있다면 이미지 저장
        if (reviewDTO.getReviewImg() != null && !reviewDTO.getReviewImg().isEmpty()) {
            List<ReviewImg> reviewImgs = reviewDTO.getReviewImg().stream()
                    .map(imageUrl -> ReviewImg.builder()
                            .imageUrl(imageUrl)
                            .review(savedReview)
                            .build())
                    .collect(Collectors.toList());
            reviewImgRepository.saveAll(reviewImgs);
        }

        return new ReviewDTO(savedReview);
    }

    // 이미지 업로드 처리
    public List<String> uploadImages(List<MultipartFile> images) throws IOException {
        if (images == null){
            return Collections.emptyList();
        }
        return images.stream()
                .map(image -> {
                    try {
                        return uploadImageToS3(image);  // S3 업로드 서비스 호출
                    } catch (IOException e) {
                        throw new RuntimeException("이미지 업로드 실패", e);
                    }
                })
                .collect(Collectors.toList());
    }

    // 특정 리뷰 조회
    @Transactional(readOnly = true)
    public ReviewDTO getReview(Long reviewId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new IllegalArgumentException("해당 리뷰를 찾을 수 없습니다."));
        return new ReviewDTO(review);
    }

    // 모든 리뷰 조회
    @Transactional(readOnly = true)
    public List<ReviewDTO> getAllReviews() {
        List<Review> reviews = reviewRepository.findAll();
        return reviews.stream()
                .map(ReviewDTO::new)
                .collect(Collectors.toList());
    }

    // 리뷰 삭제
    @Transactional
    public void deleteReview(Long reviewId) {
        if (!reviewRepository.existsById(reviewId)) {
            throw new IllegalArgumentException("해당 리뷰가 존재하지 않습니다.");
        }
        reviewRepository.deleteById(reviewId);
    }
}
