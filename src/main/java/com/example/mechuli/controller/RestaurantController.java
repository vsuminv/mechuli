package com.example.mechuli.controller;


import com.example.mechuli.domain.Restaurant;
import com.example.mechuli.dto.RestaurantDTO;
import com.example.mechuli.service.RestaurantService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class RestaurantController {
    @Autowired
    private final RestaurantService restaurantService;

    // 메인페이지 전체조회
    @GetMapping("/all")
    public List<Restaurant> restaurantall(Model model){
        List<Restaurant> restaurantList = restaurantService.findall();
        model.addAttribute("restaurantList",restaurantList);
        return restaurantList;
    }
    @GetMapping("/category")
//    public String restaurantCategory(Model model) {
//        List<RestaurantDTO> categoryRandom = restaurantService.findRandomRestaurantsByCategories(3);
//        model.addAttribute("categoryRandom", categoryRandom);
//        return "categoryPage"; // 반환할 뷰 이름
//    }
    public List<RestaurantDTO> restaurantCategory() {
        List<RestaurantDTO> categoryRandom = restaurantService.findRandomRestaurantsByCategories(3);
        return categoryRandom;
    }



}
