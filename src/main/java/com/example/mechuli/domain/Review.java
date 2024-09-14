package com.example.mechuli.domain;

import jakarta.persistence.*;
import jakarta.transaction.Transactional;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

@Transactional
@Entity
@Builder
@Getter
@Setter
@EntityListeners(AuditingEntityListener.class)
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
    @Column(name="createDate")
    private LocalDateTime createDate;

    @LastModifiedDate
    @Column(name = "updateDate", nullable = false)
    private LocalDateTime updateDate;

    @Column(name = "review_img")
    private List<String> reviewImg;

}