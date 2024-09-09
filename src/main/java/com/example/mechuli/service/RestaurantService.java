package com.example.mechuli.service;

import com.example.mechuli.domain.Restaurant;
import com.example.mechuli.domain.RestaurantCategory;
import com.example.mechuli.dto.RestaurantDTO;
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

    public List<RestaurantDTO> findAll() {
        // Restaurant 리스트를 RestaurantDTO 리스트로 변환
        return restaurantRepository.findAll()
                .stream()
                .map(RestaurantDTO::new)
                .collect(Collectors.toList());
    }

    public Map<String, List<RestaurantDTO>> findRestaurantsGroupedByCategory() {
        List<Restaurant> allRestaurants = restaurantRepository.findAll();

        // 레스토랑을 카테고리별로 그룹화
        Map<String, List<RestaurantDTO>> groupedByCategory = allRestaurants.stream()
                .collect(Collectors.groupingBy(
                        restaurant -> restaurant.getRestaurantCategory() != null ?
                                restaurant.getRestaurantCategory().getCategoryName() : "없음",
                        Collectors.mapping(RestaurantDTO::new, Collectors.toList())
                ));

        // 각 카테고리별로 최대 3개의 레스토랑만 선택
        groupedByCategory.forEach((key, list) -> {
            if (list.size() > 3) {
                groupedByCategory.put(key, list.subList(0, 3));
            }
        });

        return groupedByCategory;
    }

    public List<RestaurantDTO> findRandomRestaurantsByCategories(int numCategories) {
        // 모든 카테고리 조회
        List<RestaurantCategory> allCategories = restaurantCategoryRepository.findAll();

        // 카테고리가 없을 경우 빈 리스트 반환
        if (allCategories.isEmpty()) {
            return List.of();
        }

        // 랜덤으로 카테고리 3개 선택
        Random random = new Random();
        List<RestaurantDTO> result = new ArrayList<>();

        // 모든 카테고리 중에서 랜덤하게 3개를 선택
        Set<RestaurantCategory> selectedCategories = new HashSet<>();
        while (selectedCategories.size() < numCategories && selectedCategories.size() < allCategories.size()) {
            RestaurantCategory randomCategory = allCategories.get(random.nextInt(allCategories.size()));
            selectedCategories.add(randomCategory);
        }

        // 각 선택된 카테고리에 대한 식당 조회 및 변환
        for (RestaurantCategory category : selectedCategories) {
            List<Restaurant> restaurants = restaurantRepository.findByRestaurantCategory(category);
            for (Restaurant restaurant : restaurants) {
                result.add(new RestaurantDTO(restaurant));
            }
        }

        return result;
    }



}
