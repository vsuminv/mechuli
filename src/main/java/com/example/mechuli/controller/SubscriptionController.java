package com.example.mechuli.controller;


import com.example.mechuli.domain.UserDAO;
import com.example.mechuli.dto.*;
import com.example.mechuli.service.SubscriptionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/subscriptions")
public class SubscriptionController {

    @Autowired
    private SubscriptionService subscriptionService;

    @PostMapping("/subscribe/{userId}")
    public ResponseEntity<?> createSubscribe(@AuthenticationPrincipal UserDAO currentUser, @PathVariable(name = "userId") Long userId) {
        System.out.println(currentUser);
        System.out.println(userId);
        try {
            // 구독상태메세지
            String message = subscriptionService.createSubscribe(currentUser, userId);

            // 서비스에서 메세지 반환 결과 postman에서 출력
            if (message.equals("이미 구독한 사용자입니다.")) {
                return ResponseEntity.badRequest().body(message);
            } else {
                return ResponseEntity.ok(message);
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("추가 실패: " + e.getMessage());
        }
    }

    // 사용자 검색
    @GetMapping("/search")
    public List<SubscriberSearchDTO> searchUsers(
            @AuthenticationPrincipal UserDAO currentUser,
            @RequestParam("nickname") String nickname) {
        return subscriptionService.searchUsers(currentUser, nickname);
    }

    // 내가 구독한 사용자 목록 조회
    @GetMapping("/subscriberList")
    public ResponseEntity<List<SubscriberInfoDTO>>  getSubscribedUsers(@AuthenticationPrincipal UserDAO currentUser) {
        List<SubscriberInfoDTO> subscribers = subscriptionService.getSubscribedUsers(currentUser);
        return ResponseEntity.ok(subscribers);
    }

    //특정 구독자 정보 조회
    @GetMapping("/subscriber/{subscriberId}")
    public ResponseEntity<SubscriberDetailDTO> getSubscriberDetail(@AuthenticationPrincipal UserDAO currentUser, @PathVariable Long subscriberId) {
        SubscriberDetailDTO detail = subscriptionService.getSubscriberSelect(subscriberId);
        return ResponseEntity.ok(detail);
    }

    // 구독 취소
    @PostMapping("/unsubscribe/{subscriberId}")
    public ResponseEntity<?> deleteSubscriber (@AuthenticationPrincipal UserDAO authedUser, @PathVariable(name = "subscriberId") Long subscriberId){
        try {
            subscriptionService.delete(authedUser, subscriberId);
            return ResponseEntity.ok("구독이 취소되었습니다.");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("구독 취소 실패");
        }
    }

    // 구독중인지 아닌지 조회
    @PostMapping("/checkSubscribing")
    public ResponseEntity<Boolean> checkSubscribing(@AuthenticationPrincipal UserDAO authedUser, @RequestBody Map<String, Long> request) {
        Long subscriberId = request.get("subscriberId");
        boolean isSubscribed = subscriptionService.checkIsSubscribed(authedUser, subscriberId);
        return ResponseEntity.ok(isSubscribed);
    }
}