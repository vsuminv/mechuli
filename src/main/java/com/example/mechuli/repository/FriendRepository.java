package com.example.mechuli.repository;

import com.example.mechuli.model.FriendEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface FriendRepository extends JpaRepository<FriendEntity, Integer> {

    Optional<FriendEntity> findByFriendName(String FriendName);}
