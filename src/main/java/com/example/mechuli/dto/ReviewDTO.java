package com.example.mechuli.dto;

import com.example.mechuli.domain.Restaurant;
import com.example.mechuli.domain.Review;
import com.example.mechuli.domain.ReviewImg;
import lombok.*;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReviewDTO {
    private long reviewId;
    private String content;
    private Restaurant restaurantId;
    private long userIndex;
    private List<String> reviewImg;
    private Date createDate; // 추가: 생성 날짜
    private Date updateDate; // 추가: 수정 날짜

    public ReviewDTO(Review review) {
        this.reviewId = review.getReviewId();
        this.content = review.getContent();
        this.restaurantId = review.getRestaurant();
        this.userIndex = review.getUserIndex().getUserIndex();
        this.reviewImg = review.getReviewImg().stream()
                .map(ReviewImg::getImageUrl)
                .collect(Collectors.toList()); // 이미지 URL 리스트로 변환
        this.createDate = review.getCreateDate(); // 추가
        this.updateDate = review.getUpdateDate(); // 추가
    }

}
