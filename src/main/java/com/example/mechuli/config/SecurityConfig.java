package com.example.mechuli.config;


import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.security.servlet.PathRequest;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.SecurityConfigurerAdapter;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityCustomizer;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;
import org.springframework.security.web.csrf.CsrfTokenRepository;
import org.springframework.security.web.csrf.HttpSessionCsrfTokenRepository;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
@RequiredArgsConstructor
@EnableWebSecurity
@Configuration
public class SecurityConfig {

    @Autowired
    @Lazy
    private final UserDetailsService userDetailsService;
//    @Autowired
//    private BCryptPasswordEncoder bCryptPasswordEncoder;

//    @Bean
//    public BCryptPasswordEncoder bCryptPasswordEncoder(){
//        return new BCryptPasswordEncoder();
//    }


    private static final Logger logger = LoggerFactory.getLogger(SecurityConfig.class);


    @Bean
    public PasswordEncoder passwordEncoder() {

        return new BCryptPasswordEncoder();
    }

    @Bean
    public WebSecurityCustomizer webSecurityCustomizer() {
        return (web) -> web.ignoring()
                .requestMatchers(PathRequest.toStaticResources().atCommonLocations());
    }



    @Bean
    public CsrfTokenRepository csrfTokenRepository() {
        HttpSessionCsrfTokenRepository repository = new HttpSessionCsrfTokenRepository();
        repository.setHeaderName("X-CSRF-TOKEN"); // CSRF 헤더 이름 설정
        return repository;
    }


    @Bean //
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http
//                .csrf(csrf -> csrf
//                .csrfTokenRepository(new HttpSessionCsrfTokenRepository())
//        )
//                .csrf((csrf) -> csrf
//                        .csrfTokenRepository(csrfTokenRepository())
//                )
//                .csrf(csrf -> csrf
//                        .csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse()) // CSRF 설정
//                )
                .csrf(AbstractHttpConfigurer::disable)

                .authorizeHttpRequests((auth) -> auth
//
                        .requestMatchers( "/","/login","/api/**").permitAll()


                                .requestMatchers("/js/**","/auth/**","tailwinds.css", "/image/**","/img/**", "/csrf-token", "/ajaxCheckId", "/ajaxCheckNickname").permitAll()
                                .requestMatchers("/joinPage","/wellcomePage").permitAll()
//                        .requestMatchers("/img/**", "/css/**", "/images/**", "/js/**", "/node_modules/**").permitAll()
//                        .requestMatchers("/admin").hasRole("ADMIN")
//                        .requestMatchers("/my/**").hasAnyRole("ADMIN", "USER")

                        .anyRequest().authenticated())
//                        .anyRequest().permitAll())

                .formLogin(login -> login
                        .loginPage("/loginPage")
                        .loginProcessingUrl("/login") // action
                        .defaultSuccessUrl("/home", true)
                        .usernameParameter("userId")
                        .passwordParameter("userPw")
                        .failureUrl("/login-error")
                        .permitAll()


                        .permitAll()
                )

                .logout(logout -> logout
                        .logoutSuccessUrl("/loginPage")
                        .logoutRequestMatcher(new AntPathRequestMatcher("/logout"))
                        .invalidateHttpSession(true));
        return http.build();

    }


//    @Bean
//    public AuthenticationManager authenticationManager(HttpSecurity http, BCryptPasswordEncoder bCryptPasswordEncoder, UserDetailsService userService) throws Exception {
//        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
//        authProvider.setUserDetailsService(userService);
//        authProvider.setPasswordEncoder(bCryptPasswordEncoder);
//
//        return new ProviderManager(authProvider);
//    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
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