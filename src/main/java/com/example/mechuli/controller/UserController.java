
package com.example.mechuli.controller;

import com.example.mechuli.domain.UserDAO;
import com.example.mechuli.dto.RestaurantDTO;
import com.example.mechuli.dto.UserDTO;
import com.example.mechuli.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping( method = RequestMethod.POST, consumes = {"application/x-www-form-urlencoded"})
public class UserController {

    @Autowired
    private final UserService userService;

    @GetMapping("/csrf-token")
    public CsrfToken getCsrfToken(HttpServletRequest request) {
        CsrfToken csrfToken = (CsrfToken) request.getAttribute("_csrf");
        System.out.println(csrfToken);
        return csrfToken;
    }


    // 회원가입 전송 시 새 유저 생성하고 메인페이지로 redirect

    @PostMapping("/join")
    public ResponseEntity<String> userJoin(UserDTO dto) {
        userService.save(dto);
        return ResponseEntity.ok("good");
    }

    @RequestMapping(value = "/ajaxCheckId", method = RequestMethod.POST)
    @ResponseBody
    public int ajaxCheckId(@RequestBody String userId) {
        log.info("userId : {}", userId);
        return userService.checkUserId(userId);
    }

    @RequestMapping(value = "/ajaxCheckNickname", method = RequestMethod.POST)
    @ResponseBody
    public int ajaxCheckNickname(@RequestBody String nickname) {
        log.info("nickname : {}", nickname);
        return userService.checkNickname(nickname);
    }

    // 회원가입 후 로그인 한 유저의 랜덤카테고리 조회
    @GetMapping("/randomCategory")
    public List<RestaurantDTO> findCategory(@AuthenticationPrincipal UserDAO authedUser) {
        List<RestaurantDTO> randomCategories = userService.getRandomCategoriesForUser(authedUser.getUserId());

        return randomCategories;
    }
}

