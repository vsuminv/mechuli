package com.example.mechuli.domain;


import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Builder
@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class Review {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="review_id")
    private Long reviewId; // index

    @Column(name="content", nullable = false)
    private String content;

    @Column(name="rating")
    private Double rating;

    @CreatedDate
    @Column(name="createDate")
    private LocalDateTime createDate;

    @LastModifiedDate
    @Column(name="updateDate",nullable = false)
    private LocalDateTime updateDate;

    @ManyToOne
    @JoinColumn(name = "restaurant_id") // 외래키
    private Restaurant restaurant;

    @OneToMany( mappedBy = "review")
    private List<Review_img> review_img;

}
