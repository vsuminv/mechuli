
package com.example.mechuli.controller;

import com.example.mechuli.domain.UserDAO;
import com.example.mechuli.dto.UserDTO;
import com.example.mechuli.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping(name = "/user/", method = RequestMethod.POST, consumes = {"application/x-www-form-urlencoded"})
public class UserController {

    private final UserService userService;

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
    @PostMapping("/join")
    public ResponseEntity<String> userJoin(UserDTO dto) {
        try {
            UserDAO savedUser = userService.save(dto);
            return ResponseEntity.ok("회원가입 성공: " + savedUser.getUserId());
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    @GetMapping("/home")
    public String home(Model model, @AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails != null) {
            model.addAttribute("username", userDetails.getUsername());
        }
        return "home";
    }
}



//    @GetMapping("/csrf-token")
//    public CsrfToken getCsrfToken(HttpServletRequest request) {
//        CsrfToken csrfToken = (CsrfToken) request.getAttribute("_csrf");
//        System.out.println(csrfToken);
//        return csrfToken;
//    }

//    @PostMapping("/join")
//    public ResponseEntity<String> userJoin(UserDTO dto) {
//        userService.save(dto);
////        userService.join(dto);
//        return ResponseEntity.ok("good");
//    }