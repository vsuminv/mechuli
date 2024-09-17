package com.example.mechuli.service;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;
import com.example.mechuli.domain.Restaurant;
import com.example.mechuli.domain.Review;
import com.example.mechuli.domain.UserDAO;
import com.example.mechuli.dto.ReviewDTO;
import com.example.mechuli.repository.ReviewRepository;
import com.example.mechuli.repository.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.apache.catalina.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReviewService {

    @Autowired
    private  ReviewRepository reviewRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private AmazonS3 amazonS3;

    private final String BUCKET_NAME = "mechuliproject";

    public String uploadImageToS3(MultipartFile file) throws IOException {
        try {
            String fileName = "review_images/" + file.getOriginalFilename();

            // 이미지 메타데이터 설정 (파일 크기)
            ObjectMetadata metadata = new ObjectMetadata();
            metadata.setContentLength(file.getSize());

            amazonS3.putObject(new PutObjectRequest(BUCKET_NAME, fileName, file.getInputStream(), metadata));
            return amazonS3.getUrl(BUCKET_NAME, fileName).toString();  // 업로드된 파일의 S3 URL 반환
        } catch (IOException e) {
            throw new RuntimeException("이미지 업로드 실패", e);
        }
    }

    // 이미지 업로드 처리
    public List<String> uploadImages(List<MultipartFile> images) throws IOException {
        if (images == null || images.isEmpty()) {
            return Collections.emptyList();  // 이미지가 없을 경우 빈 리스트 반환
        }
        return images.stream()
                .map(image -> {
                    try {
                        return uploadImageToS3(image);  // 개별 이미지 업로드 처리
                    } catch (IOException e) {
                        throw new RuntimeException("이미지 업로드 실패", e);
                    }
                })
                .collect(Collectors.toList());  // 업로드된 이미지 URL들을 리스트로 반환
    }

    // 리뷰 생성
    public void save(UserDAO authUser, ReviewDTO reviewDTO, Long restaurantId, List<MultipartFile> files) throws IOException {
        // 이미지의 유무 판단
        if (files == null || files.isEmpty()) {
            System.out.println("No image provided");
            reviewDTO.setReviewImg(null);

            // 리뷰 엔티티 생성
            reviewRepository.save(Review.builder()
                    .content(reviewDTO.getContent())
                    .rating(reviewDTO.getRating())
                    .userIndex(authUser)  // 로그인한 사용자 정보 저장
                    .restaurant(Restaurant.builder().restaurantId(restaurantId).build())  // 리뷰 대상 식당
                    .updateDate(LocalDateTime.now())
                    .createDate(LocalDateTime.now())
                    .build());
        }else {// 이미지 파일이 있을 때
            // 이미지 URL 저장을 위한 리스트
            List<String> imageUrls = uploadImages(files);  // 이미지 업로드 후 URL 리스트 반환

            // JSON 형식으로 변환
            ObjectMapper objectMapper = new ObjectMapper();
            String jsonImageUrls = objectMapper.writeValueAsString(imageUrls);  // 이미지 URL 리스트를 JSON 문자열로 변환

            // 리뷰 엔티티 생성 및 저장
            reviewRepository.save(Review.builder()
                    .content(reviewDTO.getContent())
                    .rating(reviewDTO.getRating())  // 별점 저장
                    .userIndex(authUser)  // 로그인한 사용자 정보
                    .restaurant(Restaurant.builder().restaurantId(restaurantId).build())  // 리뷰 대상 식당
                    .reviewImg(jsonImageUrls)  // 이미지 URL을 JSON 형식으로 저장
                    .updateDate(LocalDateTime.now())
                    .createDate(LocalDateTime.now())
                    .build());
        }
    }

    public ReviewDTO getReviewById(Long reviewId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new IllegalArgumentException("해당 리뷰가 존재하지 않습니다."));
        return new ReviewDTO(review);
    }

    @Transactional
    public void updateReview(Long reviewId, UserDAO authUser, ReviewDTO reviewDTO, List<MultipartFile> files) throws IOException {
        // 수정할 리뷰가 존재하는지 확인
        Review existingReview = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new IllegalArgumentException("해당 리뷰가 존재하지 않습니다."));

        // 리뷰 작성자가 현재 로그인한 사용자인지 확인
        if (!existingReview.getUserIndex().getUserIndex().equals(authUser.getUserIndex())) {
            throw new SecurityException("해당 리뷰를 수정할 권한이 없습니다.");
        }

        // 리뷰 수정
        existingReview.setContent(reviewDTO.getContent());
        existingReview.setRating(reviewDTO.getRating());
        existingReview.setUpdateDate(LocalDateTime.now());

        // 이미지 파일이 있으면 처리
        if (files != null && !files.isEmpty()) {
            List<String> imageUrls = uploadImages(files);  // 이미지 업로드
            ObjectMapper objectMapper = new ObjectMapper();
            String jsonImageUrls = objectMapper.writeValueAsString(imageUrls);  // 이미지 URL 리스트를 JSON으로 변환
            existingReview.setReviewImg(jsonImageUrls);  // 수정된 이미지 설정
        }

        // 수정된 리뷰 저장
        reviewRepository.save(existingReview);
    }

    public List<ReviewDTO> getReviewsByRestaurant(Long restaurantId) {
        List<Review> reviews = reviewRepository.findByRestaurantRestaurantId(restaurantId);

        // 리뷰 엔티티를 DTO로 변환하여 반환
        return reviews.stream()
                .map(review -> {
                    UserDAO user = userRepository.findById(review.getUserIndex().getUserIndex())  // 유저 인덱스로 유저 정보 조회
                            .orElse(null);  // 유저가 없을 경우 null 처리
                    String nickname = (user != null && user.getNickname() != null)
                            ? user.getNickname()
                            : "익명";  // 닉네임이 없으면 기본값 설정

                    return new ReviewDTO(review, nickname);  // DTO 생성 시 유저의 닉네임 전달
                })
                .collect(Collectors.toList());
    }

    public List<ReviewDTO> getReviewsByUserIndex(Long userIndex) {
        // userIndex로 UserDAO 객체를 먼저 조회
        UserDAO user = userRepository.findById(userIndex)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));

        // UserDAO 객체로 리뷰 조회
        List<Review> reviews = reviewRepository.findByUserIndex(user);

        // 리뷰 엔티티를 DTO로 변환하여 반환
        return reviews.stream()
                .map(ReviewDTO::new)  // Review 엔티티를 ReviewDTO로 변환
                .collect(Collectors.toList());
    }

    public void deleteReview(Long reviewId) {
        // 리뷰가 존재하는지 확인
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new IllegalArgumentException("해당 리뷰가 존재하지 않습니다."));

        // 리뷰 삭제
        reviewRepository.delete(review);
    }
}