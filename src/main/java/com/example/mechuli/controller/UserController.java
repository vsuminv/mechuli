package com.example.mechuli.controller;

import com.example.mechuli.domain.RestaurantCategory;
import com.example.mechuli.domain.UserDAO;
import com.example.mechuli.dto.RestaurantDTO;
import com.example.mechuli.dto.UserDTO;
import com.example.mechuli.service.RestaurantCategoryService;
import com.example.mechuli.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;
import java.util.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping(method = RequestMethod.POST)

public class UserController {

    private final RestaurantCategoryService categoryService;
    private final UserService userService;

    @GetMapping("/joinPage")
    public ModelAndView displayCategories() {
        ModelAndView mav = new ModelAndView("pages/joinPage");
        List<RestaurantCategory> categories = categoryService.getCategoryList();
        mav.addObject("categories", categories);
        mav.addObject("userData", new UserDTO());
        return mav;

    @PostMapping("/joinPage/ajaxCheck")
    public ResponseEntity<Integer> checkIdNic(@RequestParam("type") String type, @RequestParam("value") String value) {
        int result = userService.userCheck(type, value);
        return ResponseEntity.ok(result);
    }
    @PostMapping("/joinPage/join")
    public ResponseEntity<?> join(@Valid @ModelAttribute UserDTO userDTO) {
        Map<String, Object> response = userService.save(userDTO);
        if ((Boolean) response.get("success")) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body(response);
        }
    }
    @GetMapping("/randomCategory")
    public ResponseEntity<List<RestaurantDTO>> findCategory(@AuthenticationPrincipal UserDAO authedUser) {
        if (authedUser == null) {
            System.out.println("User is not authenticated.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        System.out.println("Authenticated User: " + authedUser.getUserId());



        List<RestaurantDTO> randomCategories = userService.getRandomCategoriesForUser(authedUser.getUserId());

        return ResponseEntity.ok(randomCategories);
    }


    // 유저 정보 수정
    @PutMapping("/updateUpdate")
    public ResponseEntity<Void> updateUser(
            @AuthenticationPrincipal UserDAO authedUser,
            @RequestPart(value = "file", required = false) MultipartFile file,  // Optional file
            @RequestPart UserDTO updateRequest) {

        if (authedUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        try {
            // 이미지 업로드 후 URL 생성
            if (file != null && !file.isEmpty()) {
                String imageUrl = userService.uploadImage(file);
                updateRequest.setUserImg(imageUrl);  // URL을 UserDTO에 설정
            }

            // 사용자 정보 업데이트
            userService.updateUser(authedUser, updateRequest);

            return ResponseEntity.ok().build();
        } catch (Exception e) {
            // 예외 발생 시 에러 응답 반환
            e.printStackTrace(); // 예외 로깅
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

}
