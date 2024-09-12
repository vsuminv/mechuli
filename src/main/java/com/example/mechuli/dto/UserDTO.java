package com.example.mechuli.dto;

import com.example.mechuli.domain.Role;
import com.example.mechuli.domain.UserDAO;
import jakarta.persistence.Column;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {

    private String userId;

    private String userPw;

    private String nickname;

    private Role role;

    public UserDAO toEntity() {
        return UserDAO.builder()
                .userId(userId)
                .userPw(userPw)
                .role(Role.USER)
                .build();
    }
}
