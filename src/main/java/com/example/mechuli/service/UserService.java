package com.example.mechuli.service;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.PutObjectRequest;
import com.example.mechuli.domain.Restaurant;
import com.example.mechuli.domain.RestaurantCategory;
import com.example.mechuli.domain.UserDAO;
import com.example.mechuli.dto.RestaurantDTO;
import com.example.mechuli.dto.UserDTO;
import com.example.mechuli.repository.RestaurantCategoryRepository;
import com.example.mechuli.repository.RestaurantRepository;
import com.example.mechuli.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService implements UserDetailsService  {
    @Autowired
    private final UserRepository userRepository;

    @Autowired
    private final RestaurantCategoryRepository restaurantCategoryRepository;
    @Autowired
    private final BCryptPasswordEncoder bCryptPasswordEncoder;

    @Autowired
    private final RestaurantRepository restaurantRepository;
    private final Random random = new Random();

    @Autowired
    private AmazonS3 amazonS3;

    private final String BUCKET_NAME = "mechuliproject";

    public String uploadImageToS3(MultipartFile file) throws IOException {
        String fileName = "images/" + file.getOriginalFilename();

        // S3에 이미지 업로드
        amazonS3.putObject(new PutObjectRequest(BUCKET_NAME, fileName, file.getInputStream(), null));

        // S3의 이미지 URL 생성
        return amazonS3.getUrl(BUCKET_NAME, fileName).toString();
    }

    public void save(UserDTO userDTO) {
        List<RestaurantCategory> restaurantCategories = new ArrayList<>();
        for (Long categoryId : userDTO.getCategoryIds()) {
            RestaurantCategory category = restaurantCategoryRepository.findById(categoryId)
                    .orElseThrow(() -> new RuntimeException("Invalid category ID"));
            restaurantCategories.add(category);
        }


        UserDAO userDAO = UserDAO.builder()
                .userId(userDTO.getUserId())
                .userPw(bCryptPasswordEncoder.encode(userDTO.getUserPw()))
                .userImg(userDTO.getUserImg())
                .nickname(userDTO.getNickname())
                .restaurantCategory(restaurantCategories)
                .build();

        userRepository.save(userDAO);
    }


    // 아이디 중복체크하여 0 리턴 시 중복아이디 없음, 1 리턴 시 중복아이디 있음
    public int checkUserId(String userId) {
        int checkResult = 0;

        boolean boolResult = userRepository.existsByUserId(userId);
        if(boolResult) checkResult = 1;
        return checkResult;
    }

    // 닉네임 중복체크하여 0 리턴 시 중복닉네임 없음, 1 리턴 시 중복닉네임 있음
    public int checkNickname(String nickname) {
        int checkResult = 0;

        boolean boolResult = userRepository.existsByNickname(nickname);
        if(boolResult) checkResult = 1;
        return checkResult;
    }


    // userId로 사용자 정보 가져옴
    @Override
    public UserDAO loadUserByUsername(String userId) throws UsernameNotFoundException {

        UserDAO user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new UsernameNotFoundException("사용자를 찾을 수 없습니다."));
        return UserDAO.builder()
                .userIndex(user.getUserIndex())
                .userId(user.getUserId())
                .userPw(user.getUserPw())
                .nickname(user.getNickname())
                .userImg(user.getUserImg())
                .restaurantCategory(user.getRestaurantCategory())
                .build();
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

    public void updateUserInfo(UserDAO authUser, MultipartFile file, BCryptPasswordEncoder bCryptPasswordEncoder, UserDTO userDTO) {

        UserDAO userToUpdate = userRepository.findById(authUser.getUserIndex())
                .orElseThrow(() -> new RuntimeException("User not found"));


        userToUpdate.setUserPw(bCryptPasswordEncoder.encode(userDTO.getUserPw()));
        userToUpdate.setUserImg(userDTO.getUserImg()); // 새로운 이미지 URL 설정


        List<RestaurantCategory> restaurantCategories = new ArrayList<>();
        for (Long categoryId : userDTO.getCategoryIds()) {
            RestaurantCategory category = restaurantCategoryRepository.findById(categoryId)
                    .orElseThrow(() -> new RuntimeException("Invalid category ID"));
            restaurantCategories.add(category);
        }
        userToUpdate.setRestaurantCategory(restaurantCategories);

        // 변경된 사용자 정보 저장



        userRepository.save(userToUpdate);
    }

    public boolean existsById(UserDAO authedUser) {

        return userRepository.existsById(authedUser.getUserIndex());
    }
}