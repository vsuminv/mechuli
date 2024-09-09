//package com.example.mechuli.controller;
//
//import com.example.mechuli.dto.RestaurantDTO;
//import com.example.mechuli.service.RestaurantService;
//import lombok.RequiredArgsConstructor;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.stereotype.Controller;
//import org.springframework.ui.Model;
//import org.springframework.web.bind.annotation.GetMapping;
//import org.springframework.web.bind.annotation.RequestMapping;
//
//import java.util.List;
//
//@Controller
//@RequiredArgsConstructor
//@RequestMapping("/api")
//public class RestaurantPageController {
//
//    @Autowired
//    private final RestaurantService restaurantService;
//
//
//    @GetMapping("/mainPage") // /mainPage 경로를 처리하는 메서드
//    public String getMainPage(Model model) {
//        // Restaurant 데이터를 가져와서 모델에 추가
//        List<RestaurantDTO> restaurantList = restaurantService.findAll();
//        model.addAttribute("restaurantList", restaurantList);
//        return "contents/detail/mainPage"; // 템플릿의 경로를 반환
//    }
//}
