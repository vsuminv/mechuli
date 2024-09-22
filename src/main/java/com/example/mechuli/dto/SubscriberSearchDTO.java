package com.example.mechuli.dto;

import com.example.mechuli.domain.Subscription;
import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@Setter
public class SubscriberSearchDTO {
    private Long subscriberIndex;
    private String nickName;
    private String userImg;
    private boolean isSubscribed; // 구독 상태

    public SubscriberSearchDTO(Subscription subscription){
        this.subscriberIndex = subscription.getSubscriptId();
        this.nickName = subscription.getUserId().getNickname();
        this.userImg = subscription.getUserId().getUserImg();
        this.isSubscribed = isSubscribed();

    }
}
