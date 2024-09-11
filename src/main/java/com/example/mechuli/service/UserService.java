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
public class UserService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder encoder;

    @Transactional
    public UserDAO save(UserDTO dto) {
        return join(dto.getUserId(), dto.getUserPw(), dto.getNickname());
    }

    @Transactional
    public UserDAO join(String id, String pw, String nickname) {
        if (userRepository.findByUserId(id).isPresent()) {
            throw new RuntimeException("중복 아이디 가입 : " + id);
        }
        UserDAO currentJoinUser = UserDAO.builder()
                .userId(id)
                .userPw(encoder.encode(pw))
                .nickname(nickname)
                .role(Role.USER) // 걍 권한 줌.
                .build();
        return userRepository.save(currentJoinUser);
    }

    @Transactional
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Optional<UserDAO> currentLoginUser = this.userRepository.findByUserId(username);
        if (username.isEmpty()) {
            throw new UsernameNotFoundException("사용자를 찾을수 없습니다.");
        }
        UserDAO user = currentLoginUser.get();
        log.info("현재 들어온 유저 {}", user);
        List<GrantedAuthority> authorities = new ArrayList<>();
        if ("admin".equals(username)) {
            authorities.add(new SimpleGrantedAuthority(Role.ADMIN.name()));
            log.info("관리자 접속");
        } else {
            authorities.add(new SimpleGrantedAuthority(Role.USER.name()));
            log.info("일반 접속");
        }
        return new User(user.getUsername(), user.getPassword(), authorities);
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
}

//
//    @Transactional
//    public void save(UserDTO dto) {
//               userRepository.save(UserDAO.builder()
//                .userId(dto.getUserId())
//                .userPw(encoder.encode(dto.getUserPw()))
//                .nickname(dto.getNickname())
//                .build());
//    }
