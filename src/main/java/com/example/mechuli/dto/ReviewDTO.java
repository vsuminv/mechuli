package com.example.mechuli.dto;

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
    private Long restaurantId; // 레스토랑 ID
    private List<String> imgUrls; // 이미지 URL 리스트
}
