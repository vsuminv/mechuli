package com.example.mechuli.controller;

import com.example.mechuli.model.UserEntity;
import com.example.mechuli.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.coyote.BadRequestException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;


@RequiredArgsConstructor
@Slf4j
@Controller
public class UserController {

    private final UserService userService;
    private final BCryptPasswordEncoder encoder;

    @GetMapping("")
    public String mainTest() {
        return "home";
    }
    @GetMapping("/login")
    public String loginForm(){
        return "contents/loginForm";
    }
    @GetMapping("/login/error")
    public String loginError(Model model){
        model.addAttribute("loginErrorMsg","아이디 또는 비밀번호를 확인해주세요");
        return "contents/loginForm";
    }
    @GetMapping("/join")
    public String joinForm(Model model) {
        model.addAttribute("user",new UserEntity());
        return "contents/joinForm";
    }
    @PostMapping("/joinProc")
    public String register(@ModelAttribute UserEntity user, Model model) {
        try {
            userService.create(user);
        } catch (BadRequestException e){
            model.addAttribute("errorMessage",e.getMessage());
            return "contents/joinForm";
        }
        return "redirect:/";
    }
    @GetMapping("/my")
    public String myPage(Model model) {
        return "contents/my/myPage";
    }
    @GetMapping("/detailStore")
    public String detailStore() { return "contents/detail/detailStore"; }

    @GetMapping("/mainPage")
    public String mainPage() { return "contents/detail/mainPage"; }
}


