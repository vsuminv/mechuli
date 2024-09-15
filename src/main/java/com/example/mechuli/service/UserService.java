
package com.example.mechuli.service;

import com.amazonaws.services.s3.AmazonS3;
import com.example.mechuli.domain.Restaurant;
import com.example.mechuli.domain.RestaurantCategory;
import com.example.mechuli.domain.Role;
import com.example.mechuli.domain.UserDAO;
import com.example.mechuli.dto.RestaurantDTO;
import com.example.mechuli.dto.UserDTO;
import com.example.mechuli.repository.RestaurantCategoryRepository;
import com.example.mechuli.repository.RestaurantRepository;
import com.example.mechuli.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Transactional
@Slf4j
@Service
@RequiredArgsConstructor
public class UserService implements UserDetailsService {


    private final UserRepository userRepository;
    private final RestaurantCategoryRepository restaurantCategoryRepository;
    private final BCryptPasswordEncoder encode;
    private final Random random = new Random();
    private final RestaurantRepository restaurantRepository;
    private final AmazonS3 amazonS3;
    private final String BUCKET_NAME = "mechuliproject";

    @Transactional
    public Map<String, Object> save(UserDTO dto) {
        Map<String, Object> response = new HashMap<>();
        try {
            List<RestaurantCategory> restaurantCategories = new ArrayList<>();
            for (Long categoryId : dto.getCategoryIds()) {
                RestaurantCategory category = restaurantCategoryRepository.findById(categoryId)
                        .orElseThrow(() -> new RuntimeException("Invalid category ID: " + categoryId));
                restaurantCategories.add(category);
            }
            UserDAO user = UserDAO.builder()
                    .userId(dto.getUserId())
                    .userPw(encode.encode(dto.getUserPw()))
                    .nickname(dto.getNickname())
                    .role(Role.USER)
                    .restaurantCategory(restaurantCategories)
                    .build();
            UserDAO joinedUser = userRepository.save(user);
            response.put("success", true);
            response.put("message", "회원가입이 성공적으로 완료되었습니다.");
            response.put("userId", joinedUser.getUserId());
            log.info("가입 들옴. userId = [ {} ] ", joinedUser.getUserId());
            joinedUser.getRestaurantCategory().forEach(category -> {
                log.info("선택한 카테고리 {},[{}]", category.getCategoryId(), category.getCategoryName());
            });
        } catch (Exception e) {
            log.error("Join failed for user: {}", dto.getUserId(), e);
            response.put("success", false);
            response.put("message", e.getMessage());
        }
        return response;
    }
    public int userCheck(String type, String value) {
        boolean exists = switch (type) {
            case "userId" -> userRepository.existsByUserId(value);
            case "nickname" -> userRepository.existsByNickname(value);
            default -> throw new IllegalArgumentException("Invalid check type: " + type);
        };
        int checkResult = exists ? 1 : 0;
        log.info("[ {} ] 중복 검사 들옴.[ {} ], 결과 = [ {} ] ", type, value, checkResult);
        return checkResult;
    }
    @Override
    public UserDetails loadUserByUsername(String userId) throws UsernameNotFoundException {
        Optional<UserDAO> currentUser = this.userRepository.findByUserId(userId);
        if (currentUser.isEmpty()) {
            throw new UsernameNotFoundException("사용자를 찾을 수 없습니다.");
        }
        UserDAO user = currentUser.get();
        // UserDAO가 이미 UserDetails를 구현하므로 User 객체로 변환할 필요 없음
        return user;
    }
    public List<RestaurantDTO> getRandomCategoriesForUser(String userId) {
        UserDAO user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<RestaurantCategory> categories = user.getRestaurantCategory();

        Collections.shuffle(categories);
        List<RestaurantCategory> randomCategories = categories.stream()
                .limit(3)
                .collect(Collectors.toList());

        List<Restaurant> restaurants = randomCategories.stream()
                .flatMap(category -> restaurantRepository.findByRestaurantCategory(category).stream())
                .distinct()
                .collect(Collectors.toList());

        return restaurants.stream()
                .map(RestaurantDTO::new)
                .collect(Collectors.toList());
    }
    public boolean existsById(UserDAO authedUser) {

        return userRepository.existsById(authedUser.getUserIndex());
    }
}
