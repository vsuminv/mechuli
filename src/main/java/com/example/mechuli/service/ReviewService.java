package com.example.mechuli.service;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.PutObjectRequest;
import com.example.mechuli.domain.Review;
import com.example.mechuli.dto.ReviewDTO;
import com.example.mechuli.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
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
    public void saveReview(ReviewDTO dto){
        reviewRepository.save(Review.builder()
                        .reviewId(dto.getReviewId())
                        .content(dto.getContent())
                        .restaurant()
                        .userIndex(dto.getUserIndex())
                        .reviewImg(dto.getReviewImg())
                .build());
    }
    // 전체 리뷰 조회
    public List<ReviewDTO> findall(){
        return reviewRepository.findAll().stream()
                .map(ReviewDTO::new)
                .collect(Collectors.toList());
    }
    // 유저 리뷰 조회
//    public List<Review> findByUserIndex(Long userIndex){
//        return reviewRepository.findByUserIndex(userIndex);
//    }
    // 매장 리뷰 조회
//    public List<Review> findByRestaurantId(Long restaurantId){
//        return reviewRepository.findByRestaurantId(restaurantId);
//    }
}
