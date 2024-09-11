package com.example.mechuli.dto;

import com.example.mechuli.domain.RestaurantCategory;
import com.example.mechuli.domain.UserDAO;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.stream.Collectors;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {

    private Long userIndex;

    //    @NotBlank(message = "아이디를 입력해주세요.")
    @NotBlank
    private String userId;

    @NotBlank
//    @Pattern(regexp = "/^(?=.*[a-z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,12}$/", message = "비밀번호는 8자 이상 12자 이하로 입력해주세요.")
    private String userPw;

    @NotBlank
//    @Pattern(regexp = "/^[가-힣]+.{2,10}$/", message = "닉네임은 3자이상 10자 이하로 입력해주세요.")
    private String nickname;

    private List<Long> categoryIds;

    private Long categoryIndex;


    public UserDTO(UserDAO userDAO){
        this.userIndex = userDAO.getUserIndex();
        this.userId = userDAO.getUserId();
        this.userPw = userDAO.getUserPw();
        this.nickname = userDAO.getNickname();
        this.categoryIds = userDAO.getRestaurantCategory().stream()
                .map(category -> category.getCategoryId()) // RestaurantCategory 객체에서 ID를 추출
                .collect(Collectors.toList());
    }

}
