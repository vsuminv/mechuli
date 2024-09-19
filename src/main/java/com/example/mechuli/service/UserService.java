
package com.example.mechuli.service;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.CannedAccessControlList;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;
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
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;

@Transactional
@Slf4j
@Service
@RequiredArgsConstructor
public class UserService implements UserDetailsService {


    private final UserRepository userRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;
    private final Random random = new Random();
    private final RestaurantRepository restaurantRepository;

    private final RestaurantCategoryRepository restaurantCategoryRepository;

    @Autowired
    private AmazonS3 amazonS3;
    private final String BUCKET_NAME = "mechuliproject";


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


    // 아이디 중복체크하여 0 리턴 시 중복아이디 없음, 1 리턴 시 중복아이디 있음
    public int checkUserId(String userId) {
        int checkResult = 0;
        boolean boolResult = userRepository.existsByUserId(userId);
        if (boolResult) checkResult = 1;
        log.info("sadasdads {}", userId);
        return checkResult;
    }

    // 닉네임 중복체크하여 0 리턴 시 중복닉네임 없음, 1 리턴 시 중복닉네임 있음
    public int checkNickname(String nickname) {
        int checkResult = 0;
        boolean boolResult = userRepository.existsByNickname(nickname);
        if (boolResult) checkResult = 1;
        return checkResult;
    }

    // 인증 테스트
    @Override
    public UserDetails loadUserByUsername(String userId) throws UsernameNotFoundException {
        Optional<UserDAO> currentUser = this.userRepository.findByUserId(userId);
        if (currentUser.isEmpty()) {
            throw new UsernameNotFoundException("사용자를 찾을 수 없습니다.");
        }
        UserDAO user = currentUser.get();
        if (user.isDeleted()) {
            throw new UsernameNotFoundException("This account has been deactivated.");
        }
        // UserDAO가 이미 UserDetails를 구현하므로 User 객체로 변환할 필요 없음
        return user;
    }

    public void deactivateUser(Long userIndex) {
        UserDAO user = userRepository.findByUserIndex(userIndex)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setDeleted(true);
        userRepository.save(user);
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

    // 유저 정보 수정

    public void updateUser(UserDAO authedUser, UserDTO updateRequest) {
        UserDAO userToUpdate = userRepository.findById(authedUser.getUserIndex())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 비밀번호 업데이트
        if (updateRequest.getUserPw() != null && !updateRequest.getUserPw().isEmpty()) {
            userToUpdate.setUserPw(bCryptPasswordEncoder.encode(updateRequest.getUserPw()));
        }

        // 카테고리 업데이트
        if (updateRequest.getCategoryIds() != null && !updateRequest.getCategoryIds().isEmpty()) {
            List<RestaurantCategory> restaurantCategories = new ArrayList<>();
            for (Long categoryId : updateRequest.getCategoryIds()) {
                RestaurantCategory category = restaurantCategoryRepository.findById(categoryId)
                        .orElseThrow(() -> new RuntimeException("Invalid category ID"));
                restaurantCategories.add(category);
            }
            userToUpdate.setRestaurantCategory(restaurantCategories);
        }

        // 이미지 URL 업데이트
        if (updateRequest.getUserImg() != null && !updateRequest.getUserImg().isEmpty()) {
            userToUpdate.setUserImg(updateRequest.getUserImg());
        }

        // 변경 사항 저장
        userRepository.save(userToUpdate);
    }

    public String uploadImage(MultipartFile file) throws IOException {
        String fileName = "images/" + file.getOriginalFilename();
        ObjectMetadata metadata = new ObjectMetadata();
        metadata.setContentLength(file.getInputStream().available());

        // Content-Type 설정
        String contentType = file.getContentType();
        if (contentType != null) {
            metadata.setContentType(contentType);
        }

        // S3에 이미지 업로드
        amazonS3.putObject(new PutObjectRequest(BUCKET_NAME, fileName, file.getInputStream(), metadata));

        // S3의 이미지 URL 생성
        return amazonS3.getUrl(BUCKET_NAME, fileName).toString();
    }
    public boolean verifyPassword(Long userIndex, String passwordToVerify) {
        UserDAO user = userRepository.findByUserIndex(userIndex)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 현재 비밀번호 검증
        return bCryptPasswordEncoder.matches(passwordToVerify, user.getPassword());
    }

}

