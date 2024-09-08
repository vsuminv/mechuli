//package com.example.mechuli.controller;
//
//import org.springframework.stereotype.Controller;
//import org.springframework.ui.Model;
//import org.springframework.web.bind.annotation.GetMapping;
//import org.springframework.web.bind.annotation.RequestMapping;
//
//@Controller
//@RequestMapping("/test/")
//public class TestController {
//
//    @GetMapping("")
//    public String mainTest() {
//        return "home";
//    }
//    @GetMapping("login")
//    public String loginForm(){
//        return "contents/loginForm";
//    }
//    @GetMapping("join")
//    public String joinForm() {
//
//        return "/contents/joinFrom";
//    }
//    @GetMapping("myPage")
//    public String myPage() {
//
//        return "/contents/myPage";
//    }
//    @GetMapping("join2")
//    public String joinFomr2(Model model) {
//        model.addAttribute("join2");
//        return "contents/joinFrom";
//    }
//}
