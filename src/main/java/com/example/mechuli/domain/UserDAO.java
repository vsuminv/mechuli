package com.example.mechuli.domain;

import jakarta.persistence.*;
import lombok.*;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collection;
import java.util.Collections;
import java.util.Date;
import java.util.List;

@Transactional
@Builder
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
@Table(name = "m_user")
public class UserDAO implements UserDetails {

    @Id
    @GeneratedValue(strategy =  GenerationType.IDENTITY)
    @Column(name="user_index", updatable = false)
    private Long userIndex;

    @Column(name = "user_id", nullable = false, unique = true)
    private String userId;

    @Column(name = "user_pw", nullable = false)
    private String userPw;

    @Column(name = "nickname")
    private String nickname;

    @Column(name = "user_img")
    private String userImg;

    @Column(name = "role")
    @Enumerated(EnumType.STRING)
    private Role role;

    @CreatedDate
    @Column(name = "create_date", nullable = false)
    private Date createDate;

    @LastModifiedDate
    @Column(name = "update_date", nullable = false)
    private Date updateDate;

    @ManyToMany
    @JoinTable(
            name = "user_restaurant_category_mapping",
            joinColumns = @JoinColumn(name = "user_index"),
            inverseJoinColumns = @JoinColumn(name = "category_id")
    )

    private List<RestaurantCategory> restaurantCategory;

    @OneToMany( mappedBy = "userDAO")
    private List<MyRestaurantList> myRestaurantLists;

    @OneToMany(mappedBy = "userId")
    private List<Subscription> subscriptions;

    // 권한 반환
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        if (role == null) {
            return Collections.emptyList(); // 역할이 없을 경우 빈 리스트 반환
        }
        return Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + role.name()));
    }

    //유니크 아이디를 닉넴으로 반환
    @Override
    public String getUsername() {
        return userId;
    }
    //
    @Override
    public String getPassword() {
        return userPw;
    }

    // 계정 만료 여부 반환
    @Override
    public boolean isAccountNonExpired(){
        return true;
    }

    // 계정 잠금 여부 반환
    @Override
    public boolean isAccountNonLocked(){
        //계정 잠금되었는지 확인하는 로직
        return  true; //true: 잠금 되지 않음
    }

    //패스워드의 만료 여부 반환
    @Override
    public boolean isCredentialsNonExpired(){
        //패스워드가 만료되었는지 확인하는 로직
        return true; // true -> 만료되지 않음
    }

    //계정 사용 가능 여부 반환
    @Override
    public boolean isEnabled(){
        return true; // 계정활성화 상태
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

