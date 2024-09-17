package com.example.mechuli.service;

import com.example.mechuli.domain.Menu;
import com.example.mechuli.domain.MyRestaurantList;
import com.example.mechuli.domain.Restaurant;
import com.example.mechuli.domain.UserDAO;
import com.example.mechuli.dto.MenuDTO;
import com.example.mechuli.dto.MyRestaurantListDTO;
import com.example.mechuli.dto.MypageListsDTO;
import com.example.mechuli.dto.RestaurantDTO;
import com.example.mechuli.repository.MenuRepository;
import com.example.mechuli.repository.MyRestaurantListRepository;
import com.example.mechuli.repository.RestaurantRepository;
import com.example.mechuli.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class RestaurantService {

    @Autowired
    private RestaurantRepository restaurantRepository;

    @Autowired
    private MenuRepository menuRepository;

    @Autowired
    private MyRestaurantListRepository myRestaurantListRepository;

    @Autowired
    private UserRepository userRepository;

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


    // ==============================================================================
    public List<MenuDTO> findMenusByRestaurantId(Long restaurantId) {
        List<Menu> menuList = menuRepository.findAllByRestaurant_RestaurantId(restaurantId);
        List<MenuDTO> menuDtoList = new ArrayList<MenuDTO>();
        for (Menu m : menuList) {
            MenuDTO menuDto = MenuDTO.builder()
                    .menuId(m.getMenuId())
                    .menuName(m.getMenuName())
                    .price(m.getPrice())
                    .imageUrl(m.getImageUrl())
                    .build();
            menuDtoList.add(menuDto);
        }

        return menuDtoList;
    }

    public RestaurantDTO findRestaurantByRestaurantId(Long restaurantId) {

        Restaurant rest = restaurantRepository.findByRestaurantId(restaurantId);
        RestaurantDTO restDto = RestaurantDTO.builder()
                .restaurant_id(rest.getRestaurantId())
                .name(rest.getName())
                .img_url(rest.getImageUrl())
                .open_time(rest.getOpenTime())
                .close_time(rest.getCloseTime())
                .address(rest.getAddress())
                .build();

        return restDto;
    }

    public boolean existsByRestaurantList_restaurantIdAndUserDAO_userIndex(Long restaurantId, Long userIndex) {

        return myRestaurantListRepository.existsByRestaurantList_restaurantIdAndUserDAO_userIndex(restaurantId, userIndex);
    }

//    public Long findByRestaurantList_restaurantIdAndUserDAO_userIndex(Long restaurantId, Long userIndex) {
//        Long result = null;
//        Optional<MyRestaurantList> myRestList = myRestaurantListRepository.findByRestaurantList_restaurantIdAndUserDAO_userIndex(restaurantId, userIndex);
//        if(myRestList.isPresent()) {
//            result = myRestList.get().getMyListIndex();
//        }
//        return result;
//    }

    public void save(Long restaurantId, Long userIndex) {

        // Restaurant과 UserDAO 엔티티 조회
        Restaurant restaurant = restaurantRepository.findById(restaurantId)
                .orElseThrow(() -> new RuntimeException("Restaurant not found"));
        UserDAO userDAO = userRepository.findById(userIndex)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // MyRestaurantList 엔티티 builder로 생성
        MyRestaurantList myRestaurantList = MyRestaurantList.builder()
                .restaurantList(restaurant)
                .userDAO(userDAO)
                .build();

        myRestaurantListRepository.save(myRestaurantList);
    }

    @Transactional
    public void deleteByRestaurantList_restaurantIdAndUserDAO_userIndex(Long restaurantId, Long userIndex) {
        myRestaurantListRepository.deleteByRestaurantList_restaurantIdAndUserDAO_userIndex(restaurantId, userIndex);
    }

    // 내가 찜한 맛집리스트 조회
    public List<MyRestaurantListDTO> findAllByUserDAO_userIndex(Long userIndex) {

        List<MyRestaurantList> myRestaurantListList = myRestaurantListRepository.findAllByUserDAO_UserIndex(userIndex);
        List<MyRestaurantListDTO> myRestaurantListDTOList = new ArrayList<>();
        for(MyRestaurantList mr : myRestaurantListList) {
            MyRestaurantListDTO mrDto = new MyRestaurantListDTO(mr);
            myRestaurantListDTOList.add(mrDto);

            System.out.println(mrDto);
        }

        return myRestaurantListDTOList;
    }
}
