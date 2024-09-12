package com.example.mechuli.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReviewImgDTO {
    private Long reviewImgId;
    private String img1;
    private String img2;
    private String img3;
    private Long reviewId;  // Review와의 관계를 위해 필요
}
