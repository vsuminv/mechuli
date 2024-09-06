
package com.example.mechuli.service;

import com.example.mechuli.domain.UserDAO;
import com.example.mechuli.dto.UserDTO;
import com.example.mechuli.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService implements UserDetailsService {
    @Autowired
    private final UserRepository userRepository;
    @Autowired
    private final BCryptPasswordEncoder bCryptPasswordEncoder;


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
                .userId(user.getUserId())
                .userPw(user.getUserPw())
                .nickname(user.getNickname())
                .userImg(user.getUserImg())
                .build();
    }


//    @Transactional(readOnly = true)
//    public void checkUserIdDuplication(UserDTO userDTO){
//        boolean userIdDuplicate = userRepository.existsByUserId(userDTO.getUserId());
//        if (userIdDuplicate){
//            throw new IllegalStateException("이미 존재하는 아이디입니다.");
//        }
//    }
//
//    @Transactional(readOnly = true)
//    public void checkUserPwDuplication(UserDTO userDTO){
//        UserDTO userPwDuplicate = userRepository.findByUserPw(userDTO.getUserPw());
//        UserDTO userPwCheckDuplicate = userRepository.findByPasswordCheck(userDTO.getPasswordCheck());
//        if (userPasswordDuplicate != userPasswordCheckDuplicate){
//            throw new IllegalStateException("비밀번호가 일치하지 않음");
//        }
//    }

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

