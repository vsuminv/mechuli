package com.example.mechuli.dto;

import com.example.mechuli.domain.UserDAO;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {

    //    @NotBlank(message = "아이디를 입력해주세요.")
    @NotBlank
    private String userId;

    @NotBlank
//    @Pattern(regexp = "/^(?=.*[a-z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,12}$/", message = "비밀번호는 8자 이상 12자 이하로 입력해주세요.")
    private String userPw;

    @NotBlank
    private String nickname;

    @NotBlank
    private String address;


    UserDTO(UserDAO userDao) {
        this.userId = userDao.getUserId();
        this.userPw = userDao.getUserPw();
        this.nickname = userDao.getNickname();
        this.address = userDao.getAddress();
    }


//    @NotBlank(message = "이메일을 입력해주세요.")
//    @Email(message = "올바른 이메일 주소를 입력해주세요.")
//    @Pattern(regexp = "/^([\\w-]+(?:\\.[\\w-]+)*)@((?:[\\w-]+\\.)*\\w[\\w-]{0,66})\\.([a-z]{2,6}(?:\\.[a-z]{2})?)$/;" )
//    private String email;
//
//    @NotBlank(message =  "비밀번호를 입력해주세요.")
//    @Pattern(regexp = "/^(?=.*[a-z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,12}$/", message = "비밀번호는 8자 이상 12자 이하로 입력해주세요.")
//    private String password;
//
//    @NotBlank(message =  "비밀번호를 입력해주세요.")
//    @Pattern(regexp = "/^(?=.*[a-z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,12}$/", message = "비밀번호는 8자 이상 12자 이하로 입력해주세요.")
//    private String passwordCheck;
//
//    @NotBlank(message = "이름을 입력해주세요.")
//    @Pattern(regexp = "/^[가-힣]+.{2,15}$/", message = "이름은 3자이상 15자 이하로 입력해주세요.")
//    private String name;
}
