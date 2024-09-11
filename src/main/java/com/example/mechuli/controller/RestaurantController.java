package com.example.mechuli.controller;


import com.example.mechuli.domain.Menu;
import com.example.mechuli.domain.Restaurant;
import com.example.mechuli.domain.RestaurantCategory;
import com.example.mechuli.dto.RestaurantDTO;
import com.example.mechuli.service.RestaurantService;
import com.example.mechuli.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.coyote.Request;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class RestaurantController {
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
        System.out.println(restaurantList);
        return restaurantList;
    }
    @GetMapping("/category")
    // 뷰페이지
//    public String restaurantCategory(Model model) {
//        List<RestaurantDTO> categoryRandom = restaurantService.findRandomRestaurantsByCategories(3);
//        model.addAttribute("categoryRandom", categoryRandom);
//        return "categoryPage";
//    }
    public List<RestaurantDTO> getRandomRestaurants(@RequestParam List<Long> categoryIds) {
        return restaurantService.findRandomRestaurantsByCategories(categoryIds, 3);
    }

    @GetMapping("/restaurantDetail")
    public String getRestaurantDetail(String restaurantId, Model model) {
        // 식당 대표이미지, 이름, 주소, index
        // ajax 식당 메뉴
        model.addAttribute("restaurantId", restaurantId);
        return "/detailPage";
    }


    // Post ajax로 레스토랑의 메뉴 가져오기
    @RequestMapping(value="/ajaxRestaurantMenu", method= RequestMethod.POST)
    @ResponseBody
    public String ajaxRestaurantMenu(@RequestBody String restaurantId, Model model) {
        Long restId = Long.parseLong(restaurantId);
        List<Menu> menuList = restaurantService.findMenusByRestaurantId(restId);
        model.addAttribute("menuList", menuList);

        return "/detailPage";
    }

    // Post ajax로 한 페이지의 레스토랑 정보 가져오기
    @RequestMapping(value="/ajaxRestaurantDetail", method= RequestMethod.POST)
    @ResponseBody
    public String ajaxRestaurantDetail(@RequestBody String restaurantId, Model model) {
        // 식당 영업시간(오픈, 클로즈), 추후 식당 정보
        Long restId = Long.parseLong(restaurantId);
        model.addAttribute("restaurantDetailResult", restaurantService.findRestaurantByRestaurantId(restId));
//        log.info("restaurantId: {}, model: {}", restaurantId, model);
        return "/detailPage";
    }

}
