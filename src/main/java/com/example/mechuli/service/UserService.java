package com.example.mechuli.service;

import com.example.mechuli.domain.UserDAO;
import com.example.mechuli.dto.UserDTO;
import com.example.mechuli.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {
    @Autowired
    private final UserRepository userRepository;


    public void save(UserDTO userDTO) {

        UserDAO userDao = UserDAO.builder()
                .userId(userDTO.getUserId())
                .userPw(userDTO.getUserPw())
                .nickname(userDTO.getNickname())
                .address(userDTO.getAddress())
                .build();

        userRepository.save(userDao);
    }

    // 아이디 중복체크하여 0 리턴 시 중복아이디 없음, 1 리턴 시 중복아이디 있음
    public int checkUserId(String userId) {
        int checkResult = 0;
//        UserDTO userDto = new UserDTO();
//        userDto.setUserId(userId);

        boolean boolResult = userRepository.existsByUserId(userId);
        if(boolResult) checkResult = 1;
        return checkResult;
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
