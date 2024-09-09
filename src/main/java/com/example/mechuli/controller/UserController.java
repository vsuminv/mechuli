
package com.example.mechuli.controller;

import com.example.mechuli.dto.UserDTO;
import com.example.mechuli.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequiredArgsConstructor
public class UserController {
    @Autowired
    private final UserService userService;

    // csrf-token 값 받아오려고 넣은 메소드, 개발 끝날 시 제거나 주석처리
    @GetMapping("/csrf-token")
    public CsrfToken getCsrfToken(HttpServletRequest request) {
        CsrfToken csrfToken = (CsrfToken) request.getAttribute("_csrf");
        System.out.println(csrfToken);
        return csrfToken;
    }

    // 회원가입 전송 시 새 유저 생성하고 메인페이지로 redirect
    @PostMapping("/join")
    public String join(@Valid @RequestBody UserDTO userDto, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            return "/join";
        }
        userService.save(userDto);
        return "/home";
    }

    // id, nickname 중복 체크
    // 비밀번호는 유효성 검사만

//    // ajax로 아이디 중복체크하여 0 리턴 시 중복아이디 없음, 1 리턴 시 중복아이디 있음?
//    @RequestMapping(value="/ajaxCheckId", method = RequestMethod.POST)
//    @ResponseBody
//    public String ajaxCheckId(@RequestBody String userId, Model model) {
//        model.addAttribute("idCheckResult", userService.checkUserId(userId));
//        System.out.println(userService.checkUserId(userId));
//        return "/join :: #idCheck";  // ajax 받는 부분 지정에 따라 변경
//    }
//
//    // ajax로 닉네임 중복체크하여 0 리턴 시 중복닉네임 없음, 1 리턴 시 중복닉네임 있음
//    @RequestMapping(value="/ajaxCheckNickname", method = RequestMethod.POST)
//    @ResponseBody
//    public String ajaxCheckNickname(@RequestBody String nickname, Model model) {
//        model.addAttribute("idCheckResult", userService.checkNickname(nickname));
//        System.out.println(userService.checkNickname(nickname));
//        return "/join :: #nicknameCheck";  // ajax 받는 부분 지정에 따라 변경
//    }

    @RequestMapping(value="/ajaxCheckId", method = RequestMethod.POST)
    @ResponseBody
    public int ajaxCheckId(@RequestBody String userId) {
        log.info("userId : {}", userId);
        return userService.checkUserId(userId);
    }

    @RequestMapping(value="/ajaxCheckNickname", method = RequestMethod.POST)
    @ResponseBody
    public int ajaxCheckNickname(@RequestBody String nickname) {
        log.info("userId : {}", nickname);
        return userService.checkNickname(nickname);
    }



//    @PostMapping("/login")
//    public String login(@Valid BindingResult bindingResult, @RequestBody UserDTO userDto) {
//        if (bindingResult.hasErrors()) {
//            return "login_form";
//        }
//
////        userService.findByUserId(userDto);
//
//        return "/index";
//    }


//    @PostMapping("/login")
//    public ResponseEntity loadUserByUsername (@RequestBody UserDTO userDTO, String email){
//
//        UserDAO userDao =
//
//
//
//        User user = detailService.loadUserByUsername(
//                userDTO.getEmail());
//
//
//        if (!bCryptPasswordEncoder.matches(userDTO.getPassword(), user.getPassword())) {
//            ResponseDTO responseDTO = ResponseDTO.builder().error("비밀번호가 일치하지 않습니다.").build();
//            return ResponseEntity.ok().body(responseDTO);
//
//        } else{
//            userDTO.setPassword(bCryptPasswordEncoder.encode(userDTO.getPassword()));
//            userDTO.setEmail(userDTO.getEmail());
//            ResponseDTO responseDTO = ResponseDTO.builder().result(1).build();
//            return ResponseEntity.ok().body(responseDTO);
//        }
//
//
//
//    }


}

