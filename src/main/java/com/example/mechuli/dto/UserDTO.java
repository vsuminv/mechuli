package com.example.mechuli.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {

    @NotBlank
    private String userId;

    @NotBlank
    private String userPw;

    @NotBlank
    private String nickname;

}
