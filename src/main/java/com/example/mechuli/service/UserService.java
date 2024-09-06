package com.example.mechuli.service;

import com.example.mechuli.model.UserEntity;
import com.example.mechuli.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.coyote.BadRequestException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepo;
    private final BCryptPasswordEncoder encoder;

    public boolean checkUserIdDuplicated(String userId){
        Optional<UserEntity> user = userRepo.findByUserId(userId);
        return user.isPresent();
    }

    public void register(UserEntity userEntity) throws BadRequestException {
        if(!checkUserIdDuplicated(userEntity.getUserId())){
            userRepo.save(userEntity);
        } else {
            throw new BadRequestException("이미 사용중인 이메일 입니다.");
        }
    }
}

