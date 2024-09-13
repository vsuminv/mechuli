package com.example.mechuli.dto;

import com.example.mechuli.domain.UserDAO;
import jakarta.validation.constraints.NotBlank;
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
    private List<Long> categoryIds;

    private String userImg;

    private String role;

    public UserDTO(UserDAO userDAO){
        this.userIndex = userDAO.getUserIndex();
        this.userId = userDAO.getUserId();
        this.userPw = userDAO.getUserPw();
        this.nickname = userDAO.getNickname();
        this.userImg = userDAO.getUserImg();
        this.role = userDAO.getRole().name();
        this.categoryIds = userDAO.getRestaurantCategory().stream()
                .map(category -> category.getCategoryId()) // RestaurantCategory 객체에서 ID를 추출
                .collect(Collectors.toList());
    }

}
