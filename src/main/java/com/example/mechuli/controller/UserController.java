
package com.example.mechuli.controller;

import com.example.mechuli.domain.UserDAO;
import com.example.mechuli.dto.*;
import com.example.mechuli.service.RestaurantCategoryService;
import com.example.mechuli.service.RestaurantService;
import com.example.mechuli.service.ReviewService;
import com.example.mechuli.service.UserService;
import jakarta.servlet.annotation.MultipartConfig;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;


import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping(method = RequestMethod.POST)
public class UserController {
    @Autowired
    private final UserService userService;
    @Autowired
    private final RestaurantService restaurantService;
    @Autowired
    private ReviewService reviewService;

    @GetMapping("/csrf-token")
    public CsrfToken getCsrfToken(HttpServletRequest request) {
        CsrfToken csrfToken = (CsrfToken) request.getAttribute("_csrf");
        System.out.println(csrfToken);
        return csrfToken;
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


//============================//

    @PostMapping("/join")
    public ResponseEntity<String> userJoin(@Valid @RequestBody UserDTO dto, BindingResult bindingResult) {

        // 카테고리 값 가져오기
        if (dto.getCategoryIds() == null || dto.getCategoryIds().size() < 3 || dto.getCategoryIds().size() > 5) {
//            bindingResult.rejectValue("restaurantCategories", "error.userDto", "카테고리를 최소 3개에서 최대 5개까지 선택해주세요.");
            return ResponseEntity.badRequest().body("카테고리를 최소 3개에서 최대 5개까지 선택해주세요.");
        }

        try {

            userService.save(dto);

            return ResponseEntity.ok("회원가입이 완료되었습니다.");
        } catch (RuntimeException e) {
            e.printStackTrace(); // 디버깅을 위해 예외를 출력합니다.
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


    // 유저 정보 수정
    @PutMapping("/updateUpdate")
    public ResponseEntity<?> updateUser(
            @AuthenticationPrincipal UserDAO authedUser,
            @RequestPart(value = "file", required = false) MultipartFile file,  // Optional file
            @RequestPart(value = "updateRequest", required = false) UserDTO updateRequest) {

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


    // ====================================================
    // 내가 찜한 맛집리스트 조회 + 내 리뷰 조회
    @PostMapping("/api/myPage/myLists")
    public ResponseEntity<MypageListsDTO> findMypageLists(@AuthenticationPrincipal UserDAO authedUser) {

        if (authedUser == null) {
            System.out.println("User is not authenticated.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        MypageListsDTO mypageListsDTO = new MypageListsDTO();

        // 찜한 맛집리스트 조회
        List<MyRestaurantListDTO> myRestaurantListDTOList = restaurantService.findAllByUserDAO_userIndex(authedUser.getUserIndex());

        // 내 리뷰 조회
        List<MyReviewDTO> myReviewDTOList = reviewService.findAllByUserIndex(authedUser.getUserIndex());

        try {

            mypageListsDTO.setMyRestaurantListDTOList(myRestaurantListDTOList);
            mypageListsDTO.setMyReviewDTOList(myReviewDTOList);

            return ResponseEntity.ok(mypageListsDTO);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // 비밀번호 재확인 ajax
    @RequestMapping(value = "/ajax/checkPwd", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<Integer> ajaxCheckPwd(@AuthenticationPrincipal UserDAO authedUser, @RequestBody String userPwd) {

        if (authedUser == null) {
            System.out.println("User is not authenticated.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        int result = -1;

        boolean isPasswordValid = userService.verifyPassword(authedUser.getUserIndex(), userPwd);

        if (isPasswordValid) { result = 1; }    // 비밀번호 일치 시 1 리턴
        else { result = 0; }    // 비밀번호 불일치 시 0 리턴

        return ResponseEntity.ok(result);
    }

    // 로그인 유무 확인용
    @GetMapping("/api/check-session")
    public ResponseEntity<Boolean> checkSession(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        boolean isLoggedIn = (session != null);
        return ResponseEntity.ok(isLoggedIn);
    }


    // 탈퇴 (Withdraw)
    @PostMapping("/auth/deactivate")
    public ResponseEntity<String> deactivateUser(@AuthenticationPrincipal UserDAO authedUser) {
        if (authedUser == null) {
            System.out.println("User is not authenticated.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        userService.deactivateUser(authedUser.getUserIndex());
        return ResponseEntity.ok("User has been deactivated.");
    }

    ////////////////////////////////////

    // 개인정보 조회
    @PostMapping("/auth/myPage")
    public ResponseEntity<UserInfoDTO> findUserInfo(@AuthenticationPrincipal UserDAO authedUser) {
        if (authedUser == null) {
            System.out.println("User is not authenticated.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        UserInfoDTO userInfoDto = userService.findUserInfo(authedUser.getUserIndex());

        return ResponseEntity.ok(userInfoDto);
    }

}