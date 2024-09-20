package com.example.mechuli.controller;


import com.example.mechuli.dto.RestaurantCategoryDTO;
import com.example.mechuli.dto.RestaurantDTO;
import com.example.mechuli.service.RestaurantCategoryService;
import com.example.mechuli.service.RestaurantService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class RestaurantCategoryController {
    @Autowired
    private RestaurantCategoryService restaurantCategoryService;

    @GetMapping("/categoryAll")
//    public String restaurantAll(Model model) {
//        List<RestaurantDTO> restaurantList = restaurantService.findAll();
//        model.addAttribute("restaurantList", restaurantList);
//        return "restaurnatList";
//    }
    public List<RestaurantCategoryDTO> restaurantAll(Model model) {
        List<RestaurantCategoryDTO> restaurantCategoryDTOList = restaurantCategoryService.findAll();
        model.addAttribute("restaurantCategoryDTOList", restaurantCategoryDTOList);
        return restaurantCategoryDTOList;
    }


}