package com.example.mechuli.controller;

import com.example.mechuli.domain.UserDAO;
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
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;


import java.util.List;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping(method = RequestMethod.POST, consumes = {"application/x-www-form-urlencoded"})
public class UserController {

    @Autowired
    private UserService userService;

    private final RestaurantService restaurantService;

    private final RestaurantCategoryService restaurantCategoryService;


    //중복 체크
//    @PostMapping(value = {"/ajaxCheckId", "/ajaxCheckNickname"},consumes = MediaType.APPLICATION_JSON_VALUE)
//    public ResponseEntity<Integer> userJoinCheck(@RequestBody String value, HttpServletRequest request) {
//        String path = request.getServletPath();
//        boolean check = path.contains("Id");
//        log.info("회원가입 중복체크 들옴 {} : {}", check ? "userId" : "nickname", value);
//        int result = check ? userService.checkUserId(value) : userService.checkNickname(value);
//        return ResponseEntity.ok(result);
//    }
    @PostMapping("/ajaxCheckId")
    public ResponseEntity<Integer> ajaxCheckId(@RequestParam("userId") String userId) {
        int result = userService.checkUserId(userId);
        return ResponseEntity.ok(result);
    }

    @PostMapping("/ajaxCheckNickname")
    public ResponseEntity<Integer> userNicknameCheck(@RequestParam("nickname") String nickname) {
        int result = userService.checkNickname(nickname);
        return ResponseEntity.ok(result);
    }

    @Valid
    @PostMapping("/join")
    public ResponseEntity<String> userJoin(@RequestBody UserDTO dto, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            return ResponseEntity.badRequest().body(bindingResult.getAllErrors().get(0).getDefaultMessage());
        }
        // 카테고리 값 가져오기
        if (dto.getCategoryIds() == null || dto.getCategoryIds().size() < 3 || dto.getCategoryIds().size() > 5) {
            bindingResult.rejectValue("restaurantCategories", "error.userDto", "카테고리를 최소 3개에서 최대 5개까지 선택해주세요.");
            return ResponseEntity.badRequest().body("카테고리를 최소 3개에서 최대 5개까지 선택해주세요.");
        }

        try {
            userService.save(dto);
            log.info("가입 성공 . 들온거.{}", dto);
            return ResponseEntity.ok("success");
        } catch (RuntimeException e) {
            log.error("가입 실패.  들온값 : {}", dto);
            log.error("가입 실패 메세지 : {}",e);
            return ResponseEntity.badRequest().body("회원가입 중 오류가 발생했습니다: " + e.getMessage());
        }
    }

    // 회원가입 후 로그인 한 유저의 랜덤카테고리 조회
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

    
    
    //    @GetMapping("/csrf-token")
//    public CsrfToken getCsrfToken(HttpServletRequest request) {
//        CsrfToken csrfToken = (CsrfToken) request.getAttribute("_csrf");
//        System.out.println(csrfToken);
//        return csrfToken;
//    }
    // 유저 정보 수정
//    @PutMapping("/updateUpdate")
//    public ResponseEntity<Void> updateUser(
//            @AuthenticationPrincipal UserDAO authedUser,
//            @RequestPart(value = "file", required = false) MultipartFile file,  // Optional file
//            @RequestPart UserDTO updateRequest) {
//
//        if (authedUser == null) {
//            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
//        }
//
//        try {
//            // 이미지 업로드 후 URL 생성
//            if (file != null && !file.isEmpty()) {
//                String imageUrl = userService.uploadImage(file);
//                updateRequest.setUserImg(imageUrl);  // URL을 UserDTO에 설정
//            }
//
//            // 사용자 정보 업데이트
//            userService.updateUser(authedUser, updateRequest);
//
//            return ResponseEntity.ok().build();
//        } catch (Exception e) {
//            // 예외 발생 시 에러 응답 반환
//            e.printStackTrace(); // 예외 로깅
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
//        }
//    }


}

