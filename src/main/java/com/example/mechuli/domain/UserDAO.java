package com.example.mechuli.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;

import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.util.Date;

@Entity
@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
@Table(name = "M_USER")
public class UserDAO {

    @Id
    @GeneratedValue(strategy =  GenerationType.IDENTITY)
    @Column(name="user_index")
    private int userIndex;

    @Column(name = "user_id", nullable = false, unique = true)
    private String userId;

    @Column(name = "user_pw", nullable = false)
    private String userPw;

    @Column(nullable = false, unique = true)
    private String nickname;

    @Column(name = "user_img")
    private String userImg;

    @Column(nullable = false)
    private String address;

    @CreatedDate
    @Column(name = "create_date", nullable = false)
    private Date createDate;

    @LastModifiedDate
    @Column(name = "update_date", nullable = false)
    private Date updateDate;

    @Builder
    public UserDAO(String userId, String userPw, String nickname, String address) {
        this.userId = userId;
        this.userPw = userPw;
        this.nickname = nickname;
        this.address = address;
    }
}


//User Table
//- Index
//- ID
//- PW
//- IMG
//- Address
//- 생성일
//- 수정일

