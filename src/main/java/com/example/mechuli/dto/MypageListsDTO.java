package com.example.mechuli.dto;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MypageListsDTO {
    List<MyRestaurantListDTO> myRestaurantListDTOList;
    List<MyReviewDTO> myReviewDTOList;
}
