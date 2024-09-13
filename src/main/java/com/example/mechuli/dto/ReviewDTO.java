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
    private Long restaurantId;  // 이 값은 JSON에서 Long 타입으로 파싱됨
    private Long userIndex;     // 이 값 역시 Long 타입으로 파싱됨
    private List<String> reviewImg;

    public ReviewDTO(Review review){
        this.reviewId = review.getReviewId();
        this.content = review.getContent();
        this.restaurantId = review.getRestaurant().getRestaurantId();
        this.userIndex = review.getUserIndex().getUserIndex();
        this.reviewImg = review.getReviewImg();
    }
}
