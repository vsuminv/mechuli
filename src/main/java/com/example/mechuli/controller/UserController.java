
package com.example.mechuli.controller;

import com.example.mechuli.domain.UserDAO;
import com.example.mechuli.dto.UserDTO;
import com.example.mechuli.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping(method = RequestMethod.POST, consumes = {"application/x-www-form-urlencoded"})
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

    @PostMapping("/join")  //회원가입
    public String join(UserDTO dto) {
        userService.join(dto);
        return "redirect:/login";
    }

//    @PostMapping("/join")
//    public ResponseEntity<String> userJoin(UserDTO dto) {
//        try {
//            UserDAO savedUser = userService.join(dto);
//            return ResponseEntity.ok("회원가입 성공: " + savedUser.getUserId());
//        } catch (RuntimeException e) {
//            return ResponseEntity.badRequest().body(e.getMessage());
//        }
//    }

//    @PostMapping("/login/{id}")
//    public String login(@PathVariable(value = "id") String id) {
//        UserDetails user = userService.loadUserByUsername(id);
//        Authentication auth = new UsernamePasswordAuthenticationToken(user, "", user.getAuthorities());
//        SecurityContext context = SecurityContextHolder.createEmptyContext();
//        context.setAuthentication(auth);
//        SecurityContextHolder.setContext(context);
//        return "redirect:/home";
//    }

//    @PostMapping("/login")
//    public String home(Model model, @AuthenticationPrincipal UserDetails userDetails) {
//
//        if (userDetails != null) {
//            model.addAttribute("username", userDetails.getUsername());
//        }
//        return "home";
//    }

//    @GetMapping("/home")
//    public String home(Model model, @AuthenticationPrincipal UserDetails userDetails) {
//
//        if (userDetails != null) {
//            model.addAttribute("username", userDetails.getUsername());
//        }
//        return "home";
//    }
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