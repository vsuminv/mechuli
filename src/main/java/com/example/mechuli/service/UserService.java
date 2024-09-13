
package com.example.mechuli.service;

import com.example.mechuli.domain.Restaurant;
import com.example.mechuli.domain.RestaurantCategory;
import com.example.mechuli.domain.Role;
import com.example.mechuli.domain.UserDAO;
import com.example.mechuli.dto.RestaurantDTO;
import com.example.mechuli.dto.UserDTO;
import com.example.mechuli.repository.RestaurantRepository;
import com.example.mechuli.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
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
        Role role;
        if (roleCondition(dto)) {// roleCondition() 밑에 있음. 나중에 조건 로직 넣어서 쓰면됨
            role = Role.ADMIN;
        } else {
            role = Role.USER; // 기본으로 줌
        }
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
                    .role(role)
                    .restaurantCategory(restaurantCategories)
                    .build();
            UserDAO joinedUser = userRepository.save(user);
            response.put("success", true);
            response.put("message", "회원가입이 성공적으로 완료되었습니다.");
            response.put("userId", joinedUser.getUserId());
            joinedUser.getRestaurantCategory().forEach(category -> {
                log.info("가입 성공. id: [ {} ] 선택한 카테고리 [{},{}]",
                        joinedUser.getUserId(), category.getCategoryId(), category.getCategoryName());
            });
        } catch (Exception e) {
            log.error("가입 실패. {}", dto.getUserId(), e);
            response.put("success", false);
            response.put("message", e.getMessage());
        }
        return response;
    }

    public int userCheck(String type, String value) {
        boolean exists = switch (type) {
            case "userId" -> userRepository.existsByUserId(value);
            case "nickname" -> userRepository.existsByNickname(value);
            default -> throw new IllegalArgumentException("이상한거 들옴 : " + type);
        };
        int checkResult = exists ? 1 : 0;
        log.info("[ {} ] 중복 검사 들옴.[ {} ], 결과 = [ {} ] ", type, value, checkResult);
        return checkResult;
    }

    @Override
    public UserDetails loadUserByUsername(String userId) throws UsernameNotFoundException {
        return this.userRepository.findByUserId(userId)
                .map(UserDAO -> {
                    log.info("로그인 들온거 id,nic,role [ {} ] ,[ {} ], ,[ {} ]", UserDAO.getUserId(), UserDAO.getNickname(), UserDAO.getRole());
                    String categories = String.join(", ", UserDAO.getRestaurantCategory().stream()
                            .map(RestaurantCategory::getCategoryName)
                            .toList());
                    log.info(" [ {} ] 가입할 때 선택했던 취향 : [{}]", UserDAO.getUserId(), categories);
                    return UserDAO;
                })
                .orElseThrow(() -> new UsernameNotFoundException("사용자를 찾을 수 없습니다."));
    }


    public List<RestaurantDTO> getRandomCategoriesForUser(String userId) {
        UserDAO user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<RestaurantCategory> categories = user.getRestaurantCategory();

        Collections.shuffle(categories, random);
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

    // 권한 주는 조건. 아직 설정된거 없음
    private boolean roleCondition(UserDTO dto) {

        return false;
    }
    public boolean existsById(UserDAO authedUser) {

        return userRepository.existsById(authedUser.getUserIndex());
    }
}
