package com.example.mechuli.repository;

import com.example.mechuli.domain.Review;
import com.example.mechuli.domain.Subscription;
import com.example.mechuli.domain.UserDAO;
import jakarta.transaction.Transactional;
import org.jetbrains.annotations.NotNull;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SubscriptionRepository  extends JpaRepository<Subscription, Long> {
    boolean existsByUserIdAndSubscriber(UserDAO currentUser, UserDAO targetUser);

    List<Subscription> findByUserId(UserDAO currentUser);

//    Optional<Subscription> findByUserIdAndSubscriber(Long userId, Long subscriberId);

    Optional<Subscription> findByUserIdAndSubscriber(UserDAO authedUser, UserDAO subscriber);

//    Subscription findByUserIdAndSubscriber(UserDAO userIndex, UserDAO subscriberId);

    @Override
    @Transactional
    void delete(@NotNull Subscription subscription);
}
