package com.example.mechuli.domain;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Subscription {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "subscript_id")
    private Long subscriptId;

    @ManyToOne
    @JoinColumn(name = "user_id",nullable = false, referencedColumnName = "user_index")
    private UserDAO userId;

    @ManyToOne
    @JoinColumn(name = "usbuser_id",referencedColumnName = "user_index")
    private UserDAO subuserId;
}
