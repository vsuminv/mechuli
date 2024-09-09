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
    @JoinColumn(name = "user_id",nullable = false)
    private User userId;

    @ManyToOne
    @JoinColumn(name = "usbuser_id")
    private User subuserId;
}
