package com.example.mechuli.service;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.PutObjectRequest;
import com.example.mechuli.domain.Restaurant;
import com.example.mechuli.domain.Review;
import com.example.mechuli.domain.UserDAO;
import com.example.mechuli.dto.ReviewDTO;
import com.example.mechuli.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
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

    // 리뷰 생성
    public void save(UserDAO authUser, ReviewDTO reviewDTO, Long restaurantId, List<MultipartFile> files) {
        // 이미지의 유무 판단
        if (files == null || files.isEmpty()) {
            System.out.println("No image provided");
            reviewDTO.setReviewImg(Collections.emptyList());

            // 리뷰 엔티티 생성
            reviewRepository.save(Review.builder()
                    .content(reviewDTO.getContent())
                    .userIndex(authUser)  // 로그인한 사용자 정보 저장
                    .restaurant(Restaurant.builder().restaurantId(restaurantId).build())  // 리뷰 대상 식당
                    .updateDate(LocalDateTime.now())
                    .createDate(LocalDateTime.now())
                    .build());
//            System.out.println("create date : "+review.getCreateDate()+", update_date : "+ review.getUpdateDate());
//
//            reviewRepository.save(review);
        }else {// 이미지 파일이 있을 때

            // 이미지url 저장할 배열
            List<String> imageUrls = new ArrayList<>();

            // 이미지 파일 처리
            if (files != null && !files.isEmpty()) {
                for (MultipartFile file : files) {
                    try {
                        String imageUrl = uploadImageToS3(file);
                        imageUrls.add(imageUrl);
                    } catch (IOException e) {
                        throw new RuntimeException("이미지 업로드 중 오류가 발생했습니다.", e);
                    }
                }
            }

            reviewRepository.save(Review.builder()
                    .content(reviewDTO.getContent())
                    .userIndex(authUser)  // 로그인한 사용자 정보 저장
                    .restaurant(Restaurant.builder().restaurantId(restaurantId).build())  // 리뷰 대상 식당
                    .rating(reviewDTO.getRating())
                    .reviewImg(imageUrls)
                    .updateDate(LocalDateTime.now())
                    .createDate(LocalDateTime.now())
                    .build());
//        reviewRepository.save(review);
        }
        // 리뷰 저장
    }
//    public void saveReview(ReviewDTO dto){
//        reviewRepository.save(Review.builder()
//                        .reviewId(dto.getReviewId())
//                        .content(dto.getContent())
//                        .restaurant(dto.getRestaurant())
//                        .userIndex(dto.getUserIndex())
//                        .reviewImg(dto.getReviewImg())
//                .build());
//    }


    // 유저 리뷰 조회
//    public List<Review> findByUserIndex(Long userIndex){
//        return reviewRepository.findByUserIndex(userIndex);
//    }
    // 매장 리뷰 조회
//    public List<Review> findByRestaurantId(Long restaurantId){
//        return reviewRepository.findByRestaurantId(restaurantId);
//    }
}