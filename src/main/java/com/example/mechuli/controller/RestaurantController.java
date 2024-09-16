package com.example.mechuli.controller;


import com.example.mechuli.domain.Menu;
import com.example.mechuli.domain.MyRestaurantList;
import com.example.mechuli.domain.Restaurant;
import com.example.mechuli.domain.UserDAO;
import com.example.mechuli.dto.MenuDTO;
import com.example.mechuli.dto.RestaurantDTO;
import com.example.mechuli.service.RestaurantService;
import com.example.mechuli.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class RestaurantController {

    @Autowired
    private UserService userService;
    @Autowired
    private final RestaurantService restaurantService;

    // 메인페이지 전체조회
    @GetMapping("/all")
//    public String restaurantAll(Model model) {
//        List<RestaurantDTO> restaurantList = restaurantService.findAll();
//        model.addAttribute("restaurantList", restaurantList);
//        return "restaurnatList";
//    }
    public List<RestaurantDTO> restaurantAll(Model model) {
        List<RestaurantDTO> restaurantList = restaurantService.findAll();
        model.addAttribute("restaurantList", restaurantList);
        return restaurantList;
    }

    @GetMapping("/category")
    @ResponseBody
    // 뷰페이지
    public Map<String, List<RestaurantDTO>> restaurantCategory() {
        return restaurantService.findRestaurantsGroupedByCategory();
    }
//    public String restaurantCategory(Model model) {
//        List<RestaurantDTO> categoryRandom = restaurantService.findRandomRestaurantsByCategories(3);
//        model.addAttribute("categoryRandom", categoryRandom);
//        return "categoryPage";

//        Map<String, List<RestaurantDTO>> restaurantsByCategory = restaurantService.findRestaurantsGroupedByCategory();
//        model.addAttribute("restaurantsByCategory", restaurantsByCategory);
//        return "contents/detail/mainPage.html";
//    }
//    public List<RestaurantDTO> restaurantCategory() {
//        List<RestaurantDTO> restaurantsByCategory = restaurantService.findRandomRestaurantsByCategories(3);
//        return restaurantsByCategory;
//    }

    //================================================================

    @GetMapping("/boardPage")
    public RestaurantDTO getRestaurantDetail(@RequestParam(value = "restaurantId") Long restaurantId) {

        return restaurantService.findRestaurantByRestaurantId(restaurantId);
    }

    // Post ajax로 레스토랑의 메뉴 가져오기
    @RequestMapping(value = "/ajaxRestaurantMenu", method = RequestMethod.POST)
    @ResponseBody
    public List<MenuDTO> ajaxRestaurantMenu(@RequestBody RestaurantDTO restDto) {
        Long restaurantId = restDto.getRestaurant_id();
        return restaurantService.findMenusByRestaurantId(restaurantId);
    }

    // Post ajax로 한 페이지의 레스토랑 정보 가져오기
    @RequestMapping(value = "/ajaxRestaurantDetail", method = RequestMethod.POST)
    @ResponseBody
    public RestaurantDTO ajaxRestaurantDetail(@RequestBody Map<String, Long> data) {
        Long restaurantId = data.get("restaurantId");
        return restaurantService.findRestaurantByRestaurantId(restaurantId);
    }


    // 내 식당 찜 조회해서 뿌리기
    @RequestMapping(value = "/ajax/CheckMyRestaurant", method = RequestMethod.POST)
    @ResponseBody
    public int ajaxCheckMyRestaurant(@AuthenticationPrincipal UserDAO authedUser, @RequestBody String restaurantId) {
        int result = -1;
        boolean isExist;
        try {
            isExist = restaurantService.existsByRestaurantList_restaurantIdAndUserDAO_userIndex(Long.parseLong(restaurantId), authedUser.getUserIndex());
            if(isExist) {
                result = 1;
            } else {
                result = 0;
            }
        } catch(Exception e) {
            System.out.println("existsByRestaurantList_restaurantIdAndUserDAO_userIndex 메소드가 정상 실행되지 않았습니다.");
        }
        return result;
    }

    // 내 식당 찜하기 / 해제 ajax
    @RequestMapping(value = "/ajax/DoMyRestaurant", method = RequestMethod.POST)
    @ResponseBody
    public int ajaxDoMyRestaurant(@AuthenticationPrincipal UserDAO authedUser, @RequestBody String restaurantId) {
        int result = -1;
        boolean isExist;
        try {
            isExist = restaurantService.existsByRestaurantList_restaurantIdAndUserDAO_userIndex(Long.parseLong(restaurantId), authedUser.getUserIndex());
        } catch (Exception e) {
            System.out.println("restaurantService.existsByRestaurantList_restaurantIdAndUserDAO_userIndex가 정상작동하지 않았습니다.");
            return result;  // ajax 실행 중 에러 발생 시 -1 리턴
        }
        // 이미 값이 들어 있다면(찜 상태라면 삭제)
        if (isExist) {
            // delete
            restaurantService.deleteByRestaurantList_restaurantIdAndUserDAO_userIndex(Long.parseLong(restaurantId), authedUser.getUserIndex());
            result = 0;
        } else {    // 값이 존재하지 않는다면 insert (찜 생성)
            // insert
            restaurantService.save(Long.parseLong(restaurantId), authedUser.getUserIndex());
            result = 1;
        }
        return result;
    }
}
