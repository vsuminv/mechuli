
package com.example.mechuli.service;

import com.example.mechuli.domain.UserDAO;
import com.example.mechuli.dto.UserDTO;
import com.example.mechuli.repository.UserRepository;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Collections;

@Slf4j
@Service
//@RequiredArgsConstructor
@AllArgsConstructor
public class UserService implements UserDetailsService {
    @Autowired
    private final UserRepository userRepository;
    @Autowired
    private final BCryptPasswordEncoder bCryptPasswordEncoder;

    @Transactional
    public void save(UserDTO userDTO) {

        UserDAO userDAO = UserDAO.builder()
                .userId(userDTO.getUserId())
                .userPw(bCryptPasswordEncoder.encode(userDTO.getUserPw()))
                .nickname(userDTO.getNickname())
                .build();

        userRepository.save(userDAO);
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
                .build();
    }

    public boolean login(UserDTO userDto) {
        UserDAO user = userRepository.findByUserId(userDto.getUserId())
                .orElseThrow(() -> new UsernameNotFoundException("아이디를 찾을 수 없습니다."));

        // 비밀번호 일치 여부 확인
        if (!bCryptPasswordEncoder.matches(userDto.getUserPw(), user.getUserPw())) {
            throw new BadCredentialsException("비밀번호가 일치하지 않습니다.");
        }

        return true; // 로그인 성공 시
    }

//    @Transactional(readOnly = true)
//    public void checkUserPwDuplication(UserDTO userDTO){
//        UserDTO userPwDuplicate = userRepository.findByUserPw(userDTO.getUserPw());
//        UserDTO userPwCheckDuplicate = userRepository.findByPasswordCheck(userDTO.getPasswordCheck());
//        if (userPasswordDuplicate != userPasswordCheckDuplicate){
//            throw new IllegalStateException("비밀번호가 일치하지 않음");
//        }
//    }


//    @Transactional(readOnly = true)
//    public void checkUserIdDuplication(UserDTO userDTO){
//        boolean userIdDuplicate = userRepository.existsByUserId(userDTO.getUserId());
//        if (userIdDuplicate){
//            throw new IllegalStateException("이미 존재하는 아이디입니다.");
//        }
//    }
//


//    //1: 로그인 성공 2: 아이디없음 3: 비밀번호틀림
//    public int login(UserPARAM param) {
//        if(param.getUser_id().equals("")) { return Const.NO_ID; }
//
//        UserDMI dbUser = mapper.selUser(param);
//
//        if(dbUser==null) { return Const.NO_ID; }
//
//        String cryptPw = SecurityUtils.getEncrypt(param.getUser_pw(), dbUser.getSalt());
//
//        if(!cryptPw.equals(dbUser.getUser_pw())) { return Const.NO_PW; }
//
//        param.setI_user(dbUser.getI_user());
//        param.setUser_pw(null);
//        param.setNm(dbUser.getNm());
//        param.setProfile_img(dbUser.getProfile_img());
//        param.setAdmin(dbUser.getAdmin());
//
//        return Const.SUCCESS;
//    }
}

