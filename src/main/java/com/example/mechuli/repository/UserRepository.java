package com.example.mechuli.repository;

import com.example.mechuli.domain.UserDAO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<UserDAO, Integer> {

//    public UserDAO findByUserIndex(Integer userIndex);
    boolean existsByUserId(String userId);

    public UserDAO findByUserId(String userId);
}
