package com.example.mechuli.dto;


import com.example.mechuli.domain.Subscription;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
//@AllArgsConstructor
@Builder
public class SubscriberInfoDTO {

    private Long userIndex;
    private String userImg;

    private String nickName;


    public SubscriberInfoDTO(Long userIndex, String nickName, String userImg) {
        this.userIndex = userIndex;
        this.nickName = nickName;
        this.userImg = userImg;
    }

}
