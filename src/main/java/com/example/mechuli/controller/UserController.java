package com.example.mechuli.controller;

import com.example.mechuli.dto.UserDTO;
import com.example.mechuli.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

//@Controller
@RestController
@RequiredArgsConstructor
public class UserController {
    @Autowired
    private final UserService userService;

    // 회원가입 페이지 이동
    @GetMapping("/join")
    public String join() {
        return "/join";
    }

    // 회원가입 전송 시 새 유저 생성하고 메인페이지로 redirect
    @PostMapping("/join")
    public String join(@Valid @RequestBody UserDTO userDto, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            return "/join";
        }

        userService.save(userDto);

        return "/index";
    }

    // id, nickname 중복 체크
    // 비밀번호는 유효성 검사만

    // ajax로 아이디 중복체크하여 0 리턴 시 중복아이디 없음, 1 리턴 시 중복아이디 있음?
    @RequestMapping(value="/ajaxCheckId", method = RequestMethod.POST)
    @ResponseBody
    public String ajaxCheckId(@RequestBody String userId, Model model) {
        model.addAttribute("idCheckResult", userService.checkUserId(userId));
        return "/join :: #idCheck";  // ajax 받는 부분 지정에 따라 변경
    }

    // 닉네임 체크


    ///////////////////////////////////////////////////

    // 로그인 페이지 이동
//    @GetMapping("/login")
//    public String login() {
//        return "login_form";
//    }
//
//    @PostMapping("/login")
//    public String login(@Valid BindingResult bindingResult, @RequestBody UserDTO userDto) {
//        if (bindingResult.hasErrors()) {
//            return "login_form";
//        }
//
////        userService.findByUserId(userDto);
//
//        return "redirect:/";
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




    // 닉네임은 아이디 중복체크와 동일 -> 팀 협의로 방식 정의 후 작성 예정


}
