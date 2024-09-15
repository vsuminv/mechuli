package com.example.mechuli.dto;

import com.example.mechuli.domain.RestaurantCategory;
import com.example.mechuli.domain.UserDAO;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.util.List;
import java.util.stream.Collectors;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {


    private Long userIndex;
    @NotBlank
    private String userId;

    @NotBlank
    private String userPw;

    @NotBlank
    private String nickname;
    @Size(min = 3, max = 5, message = "카테고리를 최소 3개에서 최대 5개까지 선택해주세요.")
    private List<Long> categoryIds;

    private String userImg;


    public UserDTO(UserDAO userDAO){
        this.userIndex = userDAO.getUserIndex();
        this.userId = userDAO.getUserId();
        this.userPw = userDAO.getUserPw();
        this.nickname = userDAO.getNickname();
        this.userImg = userDAO.getUserImg();

        this.categoryIds = userDAO.getRestaurantCategory().stream()
                .map(category -> category.getCategoryId()) // RestaurantCategory 객체에서 ID를 추출
                .collect(Collectors.toList());
    }

}
