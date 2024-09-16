package com.example.mechuli.dto;

import com.example.mechuli.domain.Restaurant;
import com.example.mechuli.domain.Review;
import com.example.mechuli.domain.UserDAO;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReviewDTO {
    private Long reviewId;
    private String content;
    private int rating;
    private Long userIndex;
    private String reviewImg;
    private String nickname;
    private LocalDateTime createDate;
    private LocalDateTime updateDate;

    public ReviewDTO(Review review){
        this.reviewId = review.getReviewId();
        this.content = review.getContent();
        this.createDate = review.getCreateDate();
        this.updateDate = review.getUpdateDate();
        this.userIndex = review.getUserIndex().getUserIndex();
        this.reviewImg = review.getReviewImg();
    }

    public ReviewDTO(Review review, String nickname) {
        this.reviewId = review.getReviewId();
        this.nickname = nickname;
        this.createDate = review.getCreateDate();
        this.updateDate = review.getUpdateDate();
        this.content = review.getContent();
        this.reviewImg = review.getReviewImg();
    }
}