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
@Table(name = "review_img")
public class Review_img {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="review_img_id")
    private Long reviewImgId; // index

    @Column(name="image_url1", length = 2083, nullable = false)
    private String img1;

    @Column(name="image_url2", length = 2083)
    private String img2;

    @Column(name="image_url3", length = 2083)
    private String img3;

    @ManyToOne
    @JoinColumn(name = "review_id") // 외래키
    private Review review;


}
