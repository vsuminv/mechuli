package com.example.mechuli.controller;


import com.example.mechuli.domain.UserDAO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class SubscriptionController {

    // 구독하기
//    @PostMapping("/subscriberUser/{userId}")
//    public ResponseEntity<?> subscribe(@AuthenticationPrincipal UserDAO subscriberUser, @RequestParam Long userId) {
//        subscriptionService.subscribe(subscriberUser, userId);
//        return ResponseEntity.ok("Subscribed successfully");
//    }

}
