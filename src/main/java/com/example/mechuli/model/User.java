//package com.example.mechuli.model;
//
//import jakarta.validation.constraints.NotBlank;
//import jakarta.validation.constraints.Past;
//import jakarta.validation.constraints.Pattern;
//import lombok.Data;
//
//import java.time.LocalDate;
//import java.time.LocalDateTime;
//
//
//@Data
//public class User  {
//    private Long idx;
//
//    @NotBlank
//    @Pattern(regexp = "^[a-zA-Z0-9_]{5,20}",
//    message = "영문, 숫자, _만을 사용하세요")
//    private String userId;
//
//    @NotBlank
//    @Pattern(regexp = "^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@$%^&*])[a-zA-Z0-9!@$%^&*]{8,20}",
//    message = "영문, 숫자, 특수문자를 포함한 10~20자리로 입력해주세요")
//    private String userPw;
//
//    @NotBlank
//    private String address;
//    @NotBlank
//    private LocalDateTime createDate;
//    private LocalDateTime updateDate;
//}