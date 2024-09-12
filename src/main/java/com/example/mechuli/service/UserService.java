
package com.example.mechuli.service;

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
import org.springframework.web.multipart.MultipartFile;

import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserService implements UserDetailsService {


    private final UserRepository userRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;

    private final RestaurantRepository restaurantRepository;

    private final Random random = new Random();

    private final RestaurantCategoryRepository restaurantCategoryRepository;

    public void save(UserDTO dto) {
        List<RestaurantCategory> restaurantCategories = new ArrayList<>();
        for (Long categoryId : dto.getCategoryIds()) {
            RestaurantCategory category = restaurantCategoryRepository.findById(categoryId)
                    .orElseThrow(() -> new RuntimeException("Invalid category ID"));
            restaurantCategories.add(category);
        }
        UserDAO user = UserDAO.builder()
                .userId(dto.getUserId())
                .userPw(bCryptPasswordEncoder.encode(dto.getUserPw()))
                .nickname(dto.getNickname())
                .restaurantCategory(restaurantCategories)  // 카테고리 설정
                .build();

        // 사용자 저장
        userRepository.save(user);
    }


//    public void save(UserDTO userDTO) {
//        List<RestaurantCategory> restaurantCategories = new ArrayList<>();
//        for (Long categoryId : userDTO.getCategoryIds()) {
//            RestaurantCategory category = restaurantCategoryRepository.findById(categoryId)
//                    .orElseThrow(() -> new RuntimeException("Invalid category ID"));
//            restaurantCategories.add(category);
//        }
//
//
//        UserDAO userDAO = UserDAO.builder()
//                .userId(userDTO.getUserId())
//                .userPw(bCryptPasswordEncoder.encode(userDTO.getUserPw()))
//                .userImg(userDTO.getUserImg())
//                .nickname(userDTO.getNickname())
//                .restaurantCategory(restaurantCategories)
//                .build();
//
//        userRepository.save(userDAO);
//    }



    // 아이디 중복체크하여 0 리턴 시 중복아이디 없음, 1 리턴 시 중복아이디 있음
    public int checkUserId(String userId) {
        int checkResult = 0;
        boolean boolResult = userRepository.existsByUserId(userId);
        if(boolResult) checkResult = 1;
        log.info("sadasdads {}",userId);
        return checkResult;
    }
    // 닉네임 중복체크하여 0 리턴 시 중복닉네임 없음, 1 리턴 시 중복닉네임 있음
    public int checkNickname(String nickname) {
        int checkResult = 0;

        boolean boolResult = userRepository.existsByNickname(nickname);
        if(boolResult) checkResult = 1;
        return checkResult;
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

//    public void updateUserInfo(UserDAO authUser, MultipartFile file, BCryptPasswordEncoder bCryptPasswordEncoder, UserDTO userDTO) {
//
//
//    // userId로 사용자 정보 가져옴
//    //1: 로그인 성공 2: 아이디없음 3: 비밀번호틀림
////    @Transactional
////    @Override
////    public UserDetails loadUserByUsername(String userId) throws UsernameNotFoundException {
////        UserDAO user = userRepository.findByUserId(userId)
////                .orElseThrow(() -> new UsernameNotFoundException(" UserDAO 뒤져서 " + userId + "랑 일치 하는게 없음."));
////        log.info("클라에서 로그인 시도한 값 : {}", user);
//
//        UserDAO userToUpdate = userRepository.findById(authUser.getUserIndex())
//                .orElseThrow(() -> new RuntimeException("User not found"));
//
//
//        userToUpdate.setUserPw(bCryptPasswordEncoder.encode(userDTO.getUserPw()));
//        userToUpdate.setUserImg(userDTO.getUserImg()); // 새로운 이미지 URL 설정
//
//
//        List<RestaurantCategory> restaurantCategories = new ArrayList<>();
//        for (Long categoryId : userDTO.getCategoryIds()) {
//            RestaurantCategory category = restaurantCategoryRepository.findById(categoryId)
//                    .orElseThrow(() -> new RuntimeException("Invalid category ID"));
//            restaurantCategories.add(category);
//        }
//        userToUpdate.setRestaurantCategory(restaurantCategories);
//
//        // 변경된 사용자 정보 저장
//
//
//
//        userRepository.save(userToUpdate);
//    }



//    @Transactional(readOnly = true)
//    public void checkUserIdDuplication(UserDTO userDTO){
//        boolean userIdDuplicate = userRepository.existsByUserId(userDTO.getUserId());
//        if (userIdDuplicate){
//            throw new IllegalStateException("이미 존재하는 아이디입니다.");
//        }
//    }

//
//        return UserDAO.builder()
//                .userId(user.getUserId())
//                .userPw(user.getUserPw())
//                .build();
//    }

// 인증 테스트
@Transactional
@Override
public UserDetails loadUserByUsername(String userId) throws UsernameNotFoundException {
    Optional<UserDAO> currentUser = this.userRepository.findByUserId(userId);
    if (userId.isEmpty()) {
        throw new UsernameNotFoundException("사용자를 찾을수 없습니다.");
    }
    UserDAO user = currentUser.get();
    List<GrantedAuthority> authorities = new ArrayList<>();
    if ("admin".equals(userId)) {
        authorities.add(new SimpleGrantedAuthority(Role.ADMIN.name()));
    } else{
        authorities.add(new SimpleGrantedAuthority(Role.USER.name()));
    }
    return new User(user.getUsername(), user.getPassword(), authorities);
//        return new UserDAO(user.getUserId(), user.getUserPw(), authorities)
}

}

