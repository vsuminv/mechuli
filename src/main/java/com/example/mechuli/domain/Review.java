package com.example.mechuli.domain;


import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

import java.util.Date;
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

    @CreatedDate
    @Column(name="createDate", updatable = false)
    private Date createDate;

    @LastModifiedDate
    @Column(name="updateDate",nullable = false)
    private Date updateDate;

    @ManyToOne
    @JoinColumn(name = "restaurant_id") // 외래키
    private Restaurant restaurant;

    @ManyToOne
    @JoinColumn(name = "user_index") // 외래키
    private UserDAO userIndex;

    @OneToMany(mappedBy = "review")
    private List<ReviewImg> reviewImg;

    @PrePersist
    protected void onCreate() {
        createDate = new Date();
        updateDate = new Date();
    }

    @PreUpdate
    protected void onUpdate() {
        updateDate = new Date();
    }

}
