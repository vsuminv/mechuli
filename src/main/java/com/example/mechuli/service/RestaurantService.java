package com.example.mechuli.service;

import com.example.mechuli.domain.Menu;
import com.example.mechuli.domain.Restaurant;
import com.example.mechuli.domain.RestaurantCategory;
import com.example.mechuli.dto.RestaurantDTO;
import com.example.mechuli.repository.MenuRepository;
import com.example.mechuli.repository.RestaurantCategoryRepository;
import com.example.mechuli.repository.RestaurantRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class RestaurantService {
    @Autowired
    private RestaurantCategoryRepository restaurantCategoryRepository;

    @Autowired
    private RestaurantRepository restaurantRepository;

    @Autowired
    private MenuRepository menuRepository;


    public List<RestaurantDTO> findAll() {
        // Restaurant 리스트를 RestaurantDTO 리스트로 변환
        return restaurantRepository.findAll()
                .stream()
                .map(RestaurantDTO::new)
                .collect(Collectors.toList());
    }

    public List<RestaurantDTO> findRandomRestaurantsByCategories(List<Long> categoryIds, int numCategories) {
        // 회원가입시 고른 카테고리 조회
        List<RestaurantCategory> selectedCategories = categoryIds.stream()
                .map(categoryId -> restaurantCategoryRepository.findById(categoryId)
                        .orElseThrow(() -> new RuntimeException("Invalid category ID")))
                .collect(Collectors.toList());

        // 선택한 카테고리로 레스토랑 조회
        List<Restaurant> allSelectedRestaurants = selectedCategories.stream()
                .flatMap(category -> restaurantRepository.findByRestaurantCategory(category).stream())
                .collect(Collectors.toList());

        // 랜덤으로 3개의 레스토랑 선택
        Collections.shuffle(allSelectedRestaurants);
        List<RestaurantDTO> result = allSelectedRestaurants.stream()
                .limit(3)  // 선택된 레스토랑에서 3개를 랜덤으로
                .map(this::convertToDTO)
                .collect(Collectors.toList());

        return result;
    }

    private RestaurantDTO convertToDTO(Restaurant restaurant) {
        return RestaurantDTO.builder()
                .restaurant_id(restaurant.getRestaurantId())
//                .name(restaurant.getName())
                .category_name(restaurant.getRestaurantCategory().getCategoryName())
                .build();
    }

    // 로그인한 유저의 랜덤카테고리 조회
//    // 카테고리 목록에서 무작위로 식당 선택
//    public List<RestaurantDTO> getUserCategories(List<Long> categoryIds, int numRestaurants) {
//        if (categoryIds.isEmpty()) {
//            return List.of();
//        }
//
//        // 선택한 카테고리 ID를 기반으로 카테고리 조회
//        List<RestaurantCategory> selectedCategories = restaurantCategoryRepository.findAllById(categoryIds);
//
//        // 카테고리 목록에서 해당하는 식당들 가져오기
//        List<Restaurant> allSelectedRestaurants = selectedCategories.stream()
//                .flatMap(category -> restaurantRepository.findByRestaurantCategory(category).stream())
//                .collect(Collectors.toList());
//
//        // 식당 목록에서 무작위로 numRestaurants개의 식당 선택
//        Collections.shuffle(allSelectedRestaurants);
//        return allSelectedRestaurants.stream()
//                .limit(numRestaurants)
//                .map(this::convertToDTO)
//                .collect(Collectors.toList());
//    }
//
//    private RestaurantDTO convertToDTO(Restaurant restaurant) {
//        return RestaurantDTO.builder()
//                .restaurant_id(restaurant.getRestaurantId())
//                .name(restaurant.getName())
//                .category_name(restaurant.getRestaurantCategory().getCategoryName())
//                .build();
//    }

    public Optional<RestaurantDTO> findRestaurantByRestaurantId(Long restaurantId) {

        Optional<RestaurantDTO> restDto = restaurantRepository.findByRestaurantId(restaurantId);
        return restDto;
    }

    public List<Menu>  findMenusByRestaurantId(Long restaurantId) {
        List<Menu> menuList = menuRepository.findByRestaurant_RestaurantId(restaurantId);
        return menuList;
    }

}
