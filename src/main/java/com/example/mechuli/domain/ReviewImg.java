package com.example.mechuli.domain;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Builder
@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class ReviewImg {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="review_img_id")
    private Long reviewImgId; // index

    @Column(name="image_url", length = 2083)
    private String imageUrl;  // S3 URL 저장

    @ManyToOne
    @JoinColumn(name = "review_id") // 외래키
    private Review review;
}

