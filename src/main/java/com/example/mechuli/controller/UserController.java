package com.example.mechuli.controller;

import com.example.mechuli.model.User;
import com.example.mechuli.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;


@RequiredArgsConstructor
@Slf4j
@RestController
@RequestMapping("")
public class UserController {

    private final UserService userService;


    @PostMapping("/join")
    public String join(@RequestBody User user) {
        return userService.Join(user);

    }
    @PostMapping("/login")
    public String login(@RequestBody User user) {
        return userService.login(user);

    }
}


