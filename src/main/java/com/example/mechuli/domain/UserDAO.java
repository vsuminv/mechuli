package com.example.mechuli.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

@Builder
@Entity
@Data
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
@Table(name = "m_user")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class UserDAO implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_index", updatable = false)
    private Long userIndex;

    @Column(name = "user_id", nullable = false, unique = true)
    private String userId;

    @Column(name = "user_pw", nullable = false)
    private String userPw;

    @Column(name = "nickname", nullable = false)
    private String nickname;

    @Column(name = "user_img")
    private String userImg;

    @Column(name = "role")
    @JsonIgnore
    @Enumerated(EnumType.STRING)
    private Role role;

    @CreatedDate
    @Column(name = "create_date", nullable = false)
    private LocalDateTime createDate;

    @LastModifiedDate
    @Column(name = "update_date", nullable = false)
    private LocalDateTime  updateDate;

    @Column(length = 1000)
    private String refreshToken;
    // 권한 반환
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("user"));
    }
    //유니크 아이디를 닉넴으로 반환
    @Override
    public String getUsername() {
        return userId;
    }
    @Override
    public String getPassword() {
        return userPw;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
    // jwt
    public void updateRefreshToken(String refreshToken) {
        this.refreshToken = refreshToken;
    }

    public void destroyRefreshToken() {
        this.refreshToken = null;
    }

    @JsonIgnore
    @OneToMany(mappedBy = "M_user")
    private List<MyRestaurantList> myRestaurantLists = new ArrayList<>();


    //== 패스워드 암호화 ==//
    public void encodePassword(PasswordEncoder passwordEncoder){
        this.userPw = passwordEncoder.encode(userPw);
    }
}
