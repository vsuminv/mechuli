package com.example.mechuli.domain;

import jakarta.persistence.*;
import jdk.jfr.Category;
import lombok.AllArgsConstructor;

import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Date;
import java.util.List;

@Entity
@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
@Table(name = "m_user")
public class UserDAO implements UserDetails {

    @Id
    @GeneratedValue(strategy =  GenerationType.IDENTITY)
    @Column(name="user_index")
    private long userIndex;

    @Column(name = "user_id", nullable = false, unique = true)
    private String userId;

    @Column(name = "user_pw", nullable = false)
    private String userPw;

    @Column(nullable = false, unique = true)
    private String nickname;

    @Column(name = "user_img")
    private String userImg;

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


    // 권한 관련 작업을 하기 위한 role return
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("user"));
    }

    @Override
    public String getUsername() {
        return userId;
    }

    @Override
    public String getPassword() {
        return userPw;
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

