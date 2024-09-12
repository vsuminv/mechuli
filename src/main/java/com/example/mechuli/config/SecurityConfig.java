package com.example.mechuli.config;


import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.security.servlet.PathRequest;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.SecurityConfigurerAdapter;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityCustomizer;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;
import org.springframework.security.web.csrf.CsrfTokenRepository;
import org.springframework.security.web.csrf.HttpSessionCsrfTokenRepository;

import java.nio.file.PathMatcher;

@RequiredArgsConstructor
@EnableWebSecurity
@Configuration
public class SecurityConfig {

    @Autowired
    private final UserDetailsService userDetailsService;
//    @Autowired
//    private BCryptPasswordEncoder bCryptPasswordEncoder;

//    @Bean
//    public BCryptPasswordEncoder encodePWD(){
//        return new BCryptPasswordEncoder();
//    }


//    @Bean
//    public PasswordEncoder passwordEncoder() {
//
//        return new BCryptPasswordEncoder();
//    }

    @Bean
    public CsrfTokenRepository csrfTokenRepository() {
        HttpSessionCsrfTokenRepository repository = new HttpSessionCsrfTokenRepository();
        repository.setHeaderName("X-CSRF-TOKEN"); // CSRF 헤더 이름 설정
        return repository;
    }


    @Bean //
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http
//                .csrf((csrf) -> csrf
//                        .csrfTokenRepository(csrfTokenRepository())
//                )
//                .csrf(csrf -> csrf
//                        .csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse()) // CSRF 설정
//                )
                .csrf(AbstractHttpConfigurer::disable)

                .authorizeHttpRequests((auth) -> auth
//
                        .requestMatchers( "/","/api/**","/static/**").permitAll()
//                        .requestMatchers("/img/**", "/css/**", "/images/**", "/js/**", "/node_modules/**").permitAll()
//                        .requestMatchers("/admin").hasRole("ADMIN")
//                        .requestMatchers("/my/**").hasAnyRole("ADMIN", "USER")

                        .anyRequest().authenticated())
//                        .anyRequest().permitAll())

                .formLogin(formLogin -> formLogin
                        .usernameParameter("userId")
                        .passwordParameter("userPw")
                        .loginPage("/login")
                        .defaultSuccessUrl("/")
                        .failureUrl("/joinTest"))   // 에러 시 처리 방법 논의 후 수정 예정
                .logout(logout -> logout
                        .logoutSuccessUrl("/")
                        .invalidateHttpSession(true));

        return http.build();
    }


    @Bean
    public AuthenticationManager authenticationManager(HttpSecurity http, BCryptPasswordEncoder bCryptPasswordEncoder, UserDetailsService userService) throws Exception {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userService);
        authProvider.setPasswordEncoder(bCryptPasswordEncoder);

        return new ProviderManager(authProvider);
    }

//    @Bean
//    public DaoAuthenticationProvider daoAuthenticationProvider(UserDetailsService userService) {
//        DaoAuthenticationProvider daoProvider = new DaoAuthenticationProvider();
//        daoProvider.setUserDetailsService(userService);
//        daoProvider.setPasswordEncoder(encodePWD());
//        return daoProvider;
//    }

//    정적 리소스의 위치: Spring Boot의 기본 설정에서는 src/main/resources/static 폴더에 위치한 정적 리소스가 /로 시작하는 URL 경로에 매핑됩니다.
//    따라서 위의 설정에서 "/css/**"는 src/main/resources/static/css 폴더의 리소스를 참조합니다.
//, "/css/**", "/js/**", "/image/**", "/img/**", "/node_modules/**"
}