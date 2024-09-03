package com.example.mechuli.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class TestController {
    @GetMapping("/signin")
    public String showLoginPage() {
        return "component/login";
    }
    @GetMapping("/signup")
    public String showSignupPage() {
        return "component/join";
    }
    @GetMapping("/signup2")
    public String showSignup2Page() {
        return "component/join2";
    }
    @GetMapping("/mainview")
    public String showMainView() {
        return "component/mainview";
    }
}
