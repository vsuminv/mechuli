//package com.example.mechuli.service;
//
//import com.example.mechuli.domain.UserDAO;
//import com.example.mechuli.dto.UserDTO;
//import com.example.mechuli.repository.UserRepository;
//import lombok.RequiredArgsConstructor;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.security.authentication.BadCredentialsException;
//import org.springframework.security.core.userdetails.UserDetailsService;
//import org.springframework.security.core.userdetails.UsernameNotFoundException;
//import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
//import org.springframework.stereotype.Service;
//
//@RequiredArgsConstructor
//@Service
//public class UserDetailService implements UserDetailsService {
//
//    private final UserRepository userRepository;
//
//    @Autowired
//    private final BCryptPasswordEncoder bCryptPasswordEncoder;
//
//
//        @Override
//        public UserDAO loadUserByUsername(String userId) throws UsernameNotFoundException {
//
//        UserDAO user = userRepository.findByUserId(userId)
//                .orElseThrow(() -> new UsernameNotFoundException("사용자를 찾을 수 없습니다."));
//
//        return UserDAO.builder()
//                .userId(user.getUserId())
//                .userPw(user.getUserPw())
//                .nickname(user.getNickname())
//                .userImg(user.getUserImg())
//                .build();
//    }
//
//    public boolean login(UserDTO userDto) {
//        UserDAO user = userRepository.findByUserId(userDto.getUserId())
//                .orElseThrow(() -> new UsernameNotFoundException("아이디를 찾을 수 없습니다."));
//
//        // 비밀번호 일치 여부 확인
//        if (!bCryptPasswordEncoder.matches(userDto.getUserPw(), user.getUserPw())) {
//            throw new BadCredentialsException("비밀번호가 일치하지 않습니다.");
//        }
//
//        return true; // 로그인 성공 시
//    }
//}