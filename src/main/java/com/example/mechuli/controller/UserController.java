
package com.example.mechuli.controller;

import com.example.mechuli.domain.RestaurantCategory;
import com.example.mechuli.domain.UserDAO;
import com.example.mechuli.dto.RestaurantCategoryDTO;
import com.example.mechuli.dto.RestaurantDTO;
import com.example.mechuli.dto.UserDTO;
import com.example.mechuli.service.RestaurantCategoryService;
import com.example.mechuli.service.RestaurantService;
import com.example.mechuli.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@Slf4j

@RestController
@RequiredArgsConstructor
@RequestMapping( method = RequestMethod.POST, consumes = {"application/x-www-form-urlencoded"})
public class UserController {
    @Autowired
    private final UserService userService;

    @Autowired
    private final RestaurantService restaurantService;

    @Autowired
    private final RestaurantCategoryService restaurantCategoryService;

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

        // 카테고리 값 가져오기
        if (userDto.getCategoryIds() == null || userDto.getCategoryIds().size() < 3 || userDto.getCategoryIds().size() > 5) {
            bindingResult.rejectValue("restaurantCategories", "error.userDto", "카테고리를 최소 3개에서 최대 5개까지 선택해주세요.");
            return "/join";
        }

        userService.save(userDto);
        return "/home";
    }

    // id, nickname 중복 체크
    // 비밀번호는 유효성 검사만

    //ajax로 아이디 중복체크하여 0 리턴 시 중복아이디 없음, 1 리턴 시 중복아이디 있음?
    @RequestMapping(value="/ajaxCheckId", method = RequestMethod.POST)
    @ResponseBody
    public String ajaxCheckId(@RequestBody String userId, Model model) {
        model.addAttribute("idCheckResult", userService.checkUserId(userId));
        log.info("id: {} model{}", userId, model);
        System.out.println(userService.checkUserId(userId));
        return "/joinPage";  // ajax 받는 부분 지정에 따라 변경
    }

    // ajax로 닉네임 중복체크하여 0 리턴 시 중복닉네임 없음, 1 리턴 시 중복닉네임 있음
    @RequestMapping(value="/ajaxCheckNickname", method = RequestMethod.POST)
    @ResponseBody
    public String ajaxCheckNickname(@RequestBody String nickname, Model model) {
        model.addAttribute("idCheckResult", userService.checkNickname(nickname));
        System.out.println(userService.checkNickname(nickname));
        return "/joinPage";  // ajax 받는 부분 지정에 따라 변경
    }

    // 회원가입 후 로그인 한 유저의 랜덤카테고리 조회
    @GetMapping("/randomCategory")
    public List<RestaurantDTO> findCategory(@AuthenticationPrincipal UserDAO authedUser) {
        List<RestaurantDTO> randomCategories = userService.getRandomCategoriesForUser(authedUser.getUserId());

        return randomCategories;
    }


}

