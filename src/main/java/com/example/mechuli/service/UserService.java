
package com.example.mechuli.service;

import com.example.mechuli.domain.Role;
import com.example.mechuli.domain.UserDAO;
import com.example.mechuli.dto.UserDTO;
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

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserService implements UserDetailsService {


    private final UserRepository userRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;


    public void save(UserDTO dto) {
        userRepository.save(UserDAO.builder()
                .userId(dto.getUserId())
                .userPw(bCryptPasswordEncoder.encode(dto.getUserPw()))
                .nickname(dto.getNickname())
                .build());
    }
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

    // userId로 사용자 정보 가져옴
    //1: 로그인 성공 2: 아이디없음 3: 비밀번호틀림
//    @Transactional
//    @Override
//    public UserDetails loadUserByUsername(String userId) throws UsernameNotFoundException {
//        UserDAO user = userRepository.findByUserId(userId)
//                .orElseThrow(() -> new UsernameNotFoundException(" UserDAO 뒤져서 " + userId + "랑 일치 하는게 없음."));
//        log.info("클라에서 로그인 시도한 값 : {}", user);
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

