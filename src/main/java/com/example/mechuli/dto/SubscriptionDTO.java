package com.example.mechuli.dto;

import com.example.mechuli.domain.MyRestaurantList;
import com.example.mechuli.domain.Subscription;
import com.example.mechuli.domain.UserDAO;
import lombok.*;

import java.util.List;
import java.util.stream.Collectors;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SubscriptionDTO {

    private Long subscriptId;
    private Long userIndex;

    private String userName;

    private boolean subscribeState; // 구독 상태

    private boolean userState;  // 현재 사용자인지 여부 설정

    private List<String> restaurantNames;

    public SubscriptionDTO(Subscription subscription, boolean subscribeState, boolean isCurrentUser) {
        this.subscriptId = subscription.getSubscriptId();
        this.userIndex = subscription.getSubscriber().getUserIndex();
        this.userName = subscription.getSubscriber().getNickname();
        this.subscribeState = subscribeState;
        this.userState = isCurrentUser;

        // 구독자의 맛집 리스트 출력
        this.restaurantNames = subscription.getSubscriber()
                .getMyRestaurantLists()
                .stream()
                .map(myRestaurant -> myRestaurant.getRestaurantList().getName())
                .collect(Collectors.toList());
    }


}
