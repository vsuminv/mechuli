package com.example.mechuli.service;

import com.example.mechuli.domain.MyRestaurantList;
import com.example.mechuli.domain.Review;
import com.example.mechuli.domain.Subscription;
import com.example.mechuli.domain.UserDAO;
import com.example.mechuli.dto.*;
import com.example.mechuli.repository.MyRestaurantListRepository;
import com.example.mechuli.repository.ReviewRepository;
import com.example.mechuli.repository.SubscriptionRepository;
import com.example.mechuli.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SubscriptionService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SubscriptionRepository subscriptionRepository;
    @Autowired
    private MyRestaurantListRepository myRestaurantListRepository;
    @Autowired
    private ReviewRepository reviewRepository;

    // 구독 추가
    public String createSubscribe(UserDAO loginUser, Long scriber) {
        UserDAO searchUser = userRepository.findById(scriber)
                .orElseThrow(() -> new RuntimeException("회원 정보가 없습니다."));

        // 이미 구독한 경우
        if (subscriptionRepository.existsByUserIdAndSubscriber(loginUser, searchUser)) {
            return "이미 구독한 사용자입니다.";
        }

        // 구독 추가
        Subscription subscription = Subscription.builder()
                .userId(loginUser)
                .subscriber(searchUser)
                .build();
        subscriptionRepository.save(subscription);

        return "구독이 추가되었습니다.";
    }

    // 사용자 검색
    public List<SubscriberSearchDTO> searchUsers(UserDAO currentUser, String nickname) {
        // 로그인한 사용자 제외하고 닉네임으로 유저 검색
        List<UserDAO> users = userRepository.findByNicknameContainingAndNicknameNot(nickname, currentUser.getNickname());

        // 구독 중인지 아닌지 상태값
        // dto 객체를 리스트로 변환
        // 전체 사용자들에 대한 구독 상태를 넘기기 위해  users.stream().map(user -> { ... }) 사용 안 그러면 하나의 객체만 반환
        // collect(Collectors.toList()) : SubscriberSearchDTO 객체를 리스트로 수집
        return users.stream().map(user -> {
            boolean isSubscribed = subscriptionRepository.existsByUserIdAndSubscriber(currentUser, user);
            return new SubscriberSearchDTO(user.getUserIndex(), user.getNickname(), user.getUserImg(), isSubscribed);
        }).collect(Collectors.toList());
    }



    // 내가 구독한 사용자 목록
    public List<SubscriberInfoDTO> getSubscribedUsers(UserDAO currentUser) {
        List<Subscription> subscriptions = subscriptionRepository.findByUserId(currentUser);

        // 구독자 인덱스와 이미지 정보만 추출하여 DTO로 변환
        return subscriptions.stream()
                .map(subscription -> {
                    UserDAO subscriber = subscription.getSubscriber();
                    return new SubscriberInfoDTO(subscriber.getUserIndex(), subscriber.getNickname(), subscriber.getUserImg());
                })
                .collect(Collectors.toList());
    }

    // 특정 구독자 정보 조회
    public SubscriberDetailDTO getSubscriberSelect(Long subscriberId) {
        UserDAO subscriber = userRepository.findById(subscriberId)
                .orElseThrow(() -> new RuntimeException("구독자 정보가 없습니다."));

        // 구독자가 찜한 식당 리스트 조회
        List<RestaurantDetailsDTO> myRestaurantLists = myRestaurantListRepository.findByUserDAO(subscriber)
                .stream()
                .map(restaurant -> new RestaurantDetailsDTO(restaurant.getRestaurantList().getName(), restaurant.getRestaurantList().getImageUrl())) // RestaurantDetailsDTO 생성
                .collect(Collectors.toList());

        // 구독자가 작성한 리뷰 리스트 조회
        List<ReviewDetailsDTO> reviewList = reviewRepository.findByUserIndex(subscriber)
                .stream()
                .map(review -> new ReviewDetailsDTO(review.getRestaurant().getName(), review.getContent())) // ReviewDetailsDTO 생성
                .collect(Collectors.toList());
        // DTO 생성 및 반환
        return new SubscriberDetailDTO(subscriber.getNickname(), subscriber.getUserImg(), myRestaurantLists, reviewList);
    }

    // 구독 취소

    public void delete(UserDAO authedUser, Long subscriberId) {

        UserDAO subscriber = userRepository.findById(subscriberId)
                .orElseThrow(() -> new RuntimeException("User Not found"));

       Subscription subscription = subscriptionRepository.findByUserIdAndSubscriber(authedUser, subscriber)
                .orElseThrow(() -> new RuntimeException("구독 정보가 없습니다."));

        subscriptionRepository.delete(subscription);

    }
}

