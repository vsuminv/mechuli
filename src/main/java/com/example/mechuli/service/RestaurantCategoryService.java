package com.example.mechuli.service;

import com.example.mechuli.domain.RestaurantCategory;
import com.example.mechuli.domain.UserDAO;
import com.example.mechuli.dto.RestaurantCategoryDTO;
import com.example.mechuli.dto.RestaurantDTO;
import com.example.mechuli.repository.RestaurantCategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;


@Service
public class RestaurantCategoryService {


    @Autowired
    RestaurantCategoryRepository restaurantCategoryRepository;
    public List<RestaurantCategory> findByUserIndex(UserDAO authedUser) {
//        List<RestaurantCategory> restaurantCategoryList = restaurantCategoryRepository.findRestaurantCateogyByUserDAOUserIndex(authedUser.getUserIndex());
        return restaurantCategoryRepository.findRestaurantCategoryByUserDAOUserIndex(authedUser.getUserIndex());
    }

    public List<RestaurantCategoryDTO> findAll() {
        return restaurantCategoryRepository.findAll()
                .stream()
                .map(RestaurantCategoryDTO::new)
                .collect(Collectors.toList());
    }


}
