package com.example.mechuli.service;

import com.example.mechuli.domain.RestaurantCategory;
import com.example.mechuli.domain.UserDAO;
import com.example.mechuli.repository.RestaurantCategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
public class RestaurantCategoryService {

    @Autowired
    private RestaurantCategoryRepository restaurantCategoryRepository;

    public List<RestaurantCategory> getCategoryList() {
        return restaurantCategoryRepository.findAll();
    }

    public List<RestaurantCategory> findByUserIndex(UserDAO authedUser) {
//        List<RestaurantCategory> restaurantCategoryList = restaurantCategoryRepository.findRestaurantCateogyByUserDAOUserIndex(authedUser.getUserIndex());
        return restaurantCategoryRepository.findRestaurantCatgoByUserDAOUserIndex(authedUser.getUserIndex());
    }
}
