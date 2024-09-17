package com.example.mechuli.dto;

import com.example.mechuli.domain.Review;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MyReviewDTO {
    private Long reviewId;
    private String content;
    private Long restaurantId;
    private int rating;
    private String reviewImg;
    private LocalDateTime createDate;
    private LocalDateTime updateDate;

    public MyReviewDTO(Review review) {
        this.reviewId = review.getReviewId();
        this.content = review.getContent();
        this.restaurantId = review.getRestaurant().getRestaurantId();
        this.rating = review.getRating();
        this.reviewImg = review.getReviewImg();
        this.createDate = review.getCreateDate();
        this.updateDate = review.getUpdateDate();
    }
}
