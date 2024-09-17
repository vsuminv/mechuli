package com.example.mechuli.repository;

import com.example.mechuli.domain.Review;
import com.example.mechuli.domain.UserDAO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
//    boolean chekcAuthed(String authUser);
    List<Review> findAllByUserIndex(UserDAO userDAO);
}
