package com.example.mechuli.controller;


import com.example.mechuli.domain.Restaurant;
import com.example.mechuli.domain.RestaurantCategory;
import com.example.mechuli.dto.RestaurantDTO;
import com.example.mechuli.service.RestaurantService;
import com.example.mechuli.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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






}
