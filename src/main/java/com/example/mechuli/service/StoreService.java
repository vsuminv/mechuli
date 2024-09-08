package com.example.mechuli.service;


import com.example.mechuli.model.StoreEntity;
import com.example.mechuli.repository.StoreRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.apache.coyote.BadRequestException;
import org.springframework.stereotype.Service;

@Service
@Transactional
@RequiredArgsConstructor
public class StoreService {

    private final StoreRepository repo;

    public void create(StoreEntity storeEntity)throws BadRequestException {
        try {
            repo.save(storeEntity);
        } catch (Exception e) {
            throw new BadRequestException(e.getMessage());
        }
    }

}
