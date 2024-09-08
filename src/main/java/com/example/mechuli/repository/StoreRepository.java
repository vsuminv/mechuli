package com.example.mechuli.repository;

import com.example.mechuli.model.StoreEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface StoreRepository extends JpaRepository<StoreEntity, Integer> {

    Optional<StoreEntity> findByStoreName(String StoreName);}
