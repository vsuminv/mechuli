package com.example.mechuli.domain;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "subscription")
public class Subscription {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "subscript_id")
    private Long subscriptId;

    // 로그인 한 유저
    @ManyToOne
    @JoinColumn(name = "user_id",nullable = false, referencedColumnName = "user_index")
    private UserDAO userId;

    // 구독하는 사람
    @ManyToOne
    @JoinColumn(name = "subscriber", referencedColumnName = "user_index")
    private UserDAO subscriber;
}
