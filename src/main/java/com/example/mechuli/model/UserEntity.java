package com.example.mechuli.model;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.security.crypto.password.PasswordEncoder;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name = "tb_user")
public class UserEntity extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idx;
    @Column(name = "userId", nullable = false)
    private String userId;
    @Column(name = "userPw", nullable = false)
    private String userPw;

    private String roleType;
    private String oath;


    public static UserEntity createUser(UserEntity userEntity, PasswordEncoder passwordEncoder) {
        return UserEntity.builder()
                .userId(userEntity.getUserId())
                .userPw(passwordEncoder.encode(userEntity.getUserPw()))
                .roleType(RoleType.ADMIN.getKey())
                .build();


    }

    @Builder
    public UserEntity(String userId) {
        this.userId = userId;
    }

    public UserEntity update(String oauthProvideCompany) {
        this.oath = oauthProvideCompany;
        this.roleType = RoleType.OAUTH.getKey();
        return this;
    }

    public String getRoleType() {
        return this.roleType;
    }
}
