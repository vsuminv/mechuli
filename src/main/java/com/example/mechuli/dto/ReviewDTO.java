package com.example.mechuli.dto;

import com.example.mechuli.domain.Restaurant;
import com.example.mechuli.domain.Review;
import com.example.mechuli.domain.UserDAO;
import lombok.*;

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

    public ReviewDTO(Review review){
        this.reviewId = review.getReviewId();
        this.content = review.getContent();
        this.rating = review.getRating();
        this.userIndex = review.getUserIndex().getUserIndex();
        this.reviewImg = review.getReviewImg();
    }
}