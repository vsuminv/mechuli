package com.example.mechuli.domain;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

@Entity
@Builder
@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "review")
public class Review {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="review_id")
    private Long reviewId; // index

    @Column(name="content", nullable = false)
    private String content;

    @ManyToOne
    @JoinColumn(name = "restaurant_id",referencedColumnName = "restaurant_id") // 외래키
    private Restaurant restaurant;

    @ManyToOne
    @JoinColumn(name = "user_index",referencedColumnName = "user_index") // 외래키
    private UserDAO userIndex;

    @CreatedDate
    @Column(name="create_date")
    private LocalDateTime createDate;

//    @LastModifiedDate
//    @Column(name="updateDate",nullable = false)
//    private LocalDateTime updateDate;

    @LastModifiedDate
    @Column(name = "update_date", nullable = false)
    private Date updateDate;

    @Column(name = "review_img")
    private List<String> reviewImg;

}