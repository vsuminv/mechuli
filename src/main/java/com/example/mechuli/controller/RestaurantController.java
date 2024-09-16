package com.example.mechuli.controller;


import com.example.mechuli.domain.Menu;
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
    public Model getRestaurantDetail(@AuthenticationPrincipal UserDAO authedUser, @RequestParam(value = "restaurantId") String restaurantId, Model model) {

        if (authedUser != null && userService.existsById(authedUser)) {
            model.addAttribute("authedUser", authedUser);
        }

        Long restId = Long.parseLong(restaurantId);
        List<Menu> menuList = restaurantService.findMenusByRestaurantId(restId);
        model.addAttribute("menuList", menuList);

        // authedUser가 null이 아니라면 내 식당 찜 조회해서 뿌리기

        return model;
    }

    // Post ajax로 레스토랑의 메뉴 가져오기
    @RequestMapping(value = "/ajaxRestaurantMenu", method = RequestMethod.POST)
    @ResponseBody
    public String ajaxRestaurantMenu(@AuthenticationPrincipal UserDAO authedUser, @RequestBody String restaurantId, Model model) {
        Long restId = Long.parseLong(restaurantId);
        List<Menu> menuList = restaurantService.findMenusByRestaurantId(restId);
        model.addAttribute("menuList", menuList);

//        return "/detailPage";
        return "/detailPage?restaurantId=" + restaurantId;
    }

    // Post ajax로 한 페이지의 레스토랑 정보 가져오기
    @RequestMapping(value = "/ajaxRestaurantDetail", method = RequestMethod.POST)
    @ResponseBody
    public String ajaxRestaurantDetail(@AuthenticationPrincipal UserDAO authedUser, @RequestBody String restaurantId, Model model) {
        // 식당 영업시간(오픈, 클로즈), 추후 식당 정보
        Long restId = Long.parseLong(restaurantId);
        model.addAttribute("restaurantDetailResult", restaurantService.findRestaurantByRestaurantId(restId));
//        return "/detailPage";
        return "/detailPage?restaurantId=" + restaurantId;
    }
}
