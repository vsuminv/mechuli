//package com.example.mechuli.service;
//
//import com.example.mechuli.model.UserEntity;
//import com.example.mechuli.repository.UserRepository;
//import lombok.RequiredArgsConstructor;
//import org.springframework.security.core.userdetails.UserDetailsService;
//import org.springframework.stereotype.Service;
//
//@RequiredArgsConstructor
//@Service
//public class UserDetailService implements UserDetailsService {
//
//    private final UserRepository userRepository;
//
//    @Override
//    public UserEntity loadUserByUsername(String id) {
//
//        return userRepository.findByUserId(id)
//                .orElseThrow(() -> new IllegalArgumentException((id)));
//    }
//}