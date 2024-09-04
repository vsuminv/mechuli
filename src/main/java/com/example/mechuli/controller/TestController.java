package com.example.mechuli.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class TestController {
    @GetMapping("/signin")
    public String showLoginPage() {
        return "temp/login3";
    }
    @GetMapping("/signup")
    public String showSignupPage() {
        return "temp/join3";
    }
    @GetMapping("/signup2")
    public String showSignup2Page() {
        return "temp/join2";
    }
    @GetMapping("/mainview")
    public String showMainView() {
        return "temp/mainview3";
    }
}
