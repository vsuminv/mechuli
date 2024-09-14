package com.example.mechuli.controller;


import com.example.mechuli.domain.Menu;
import com.example.mechuli.domain.Restaurant;
import com.example.mechuli.domain.UserDAO;
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

    private final UserService userService;
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
    public List<Menu> ajaxRestaurantMenu(@RequestBody RestaurantDTO restDto) {
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
//    @RequestMapping(value = "/ajaxMyRestaurant", method = RequestMethod.POST)
//    @ResponseBody
//    public int ajaxCheckMyRestaurant(@AuthenticationPrincipal UserDAO authedUser, @RequestBody String restaurantId) {
//        int result = 0;
//        try {
//            result = restaurantService.existsByRestaurantList_restaurantIdAndUserDAO_userIndex(Long.parseLong(restaurantId), authedUser.getUserIndex());
//        } catch(Exception e) {
//            System.out.println("existsByRestaurantList_restaurantIdAndUserDAO_userIndex 메소드가 정상 실행되지 않았습니다.");
//        }
//        return result;
//    }
}
