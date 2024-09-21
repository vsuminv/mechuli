package com.example.mechuli.dto;

import com.example.mechuli.domain.UserDAO;
import lombok.*;

import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserInfoDTO {
    private Long userIndex;
    private String nickname;
    private String userImg;
    private List<RestaurantCategoryDTO> restaurantCategories;
}
