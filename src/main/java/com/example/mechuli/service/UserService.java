//package com.example.mechuli.service;
//
//import com.example.mechuli.model.User;
//import com.example.mechuli.model.UserEntity;
//import com.example.mechuli.repository.UserRepository;
//import jakarta.transaction.Transactional;
//import lombok.RequiredArgsConstructor;
//import org.springframework.stereotype.Service;
//import java.util.Optional;
//
//@Service
//@Transactional
//@RequiredArgsConstructor
//public class UserService {
//
//    private final UserRepository userRepo;
//
//    public String Join(User user) {
//        Optional<UserEntity> findByUserId = userRepo.findByUserId(user.getUserId());
//        if (findByUserId.isPresent()) {
//            return "중복된 ID";
//        }
//        UserEntity ue = UserEntity.builder()
//                .userId(user.getUserId())
//                .userPw(user.getUserPw())
//                .address(user.getAddress())
//                .createDate(user.getCreateDate())
//                .updateDate(user.getUpdateDate())
//                .build();
//
//        userRepo.save(ue);
//
//        return "success";
//
//    }
//
//    public String login(User user) {
//        return null;
//    }
//}
//
