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

    private List<MyRestaurantList> myRestaurantIndex;

    public SubscriptionDTO(Subscription subscription){
        this.subscriptId = subscription.getSubscriptId();
        this.userIndex = subscription.getUserId().getUserIndex();

        this.myRestaurantIndex = subscription.getUserId().getMyRestaurantLists();

    }
}
