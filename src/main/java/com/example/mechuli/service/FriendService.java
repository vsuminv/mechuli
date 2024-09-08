package com.example.mechuli.service;

import com.example.mechuli.model.FriendEntity;
import com.example.mechuli.repository.FriendRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.apache.coyote.BadRequestException;
import org.springframework.stereotype.Service;

@Service
@Transactional
@RequiredArgsConstructor
public class FriendService {
    private final FriendRepository repo;

    public void create(FriendEntity friend) throws BadRequestException {
        try {            repo.save(friend);
        }catch (Exception e) {
            throw new BadRequestException(e.getMessage());
        }
    }
}
