package com.example.mechuli.config;


import com.example.mechuli.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.autoconfigure.security.servlet.PathRequest;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;

import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityCustomizer;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

import org.springframework.security.web.util.matcher.AntPathRequestMatcher;

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
    public BCryptPasswordEncoder encodePWD(){
        return new BCryptPasswordEncoder();
    }

    @Bean
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
//                .headers(AbstractHttpConfigurer::disable)


                .authorizeHttpRequests((auth) -> auth
//
                        .requestMatchers( "/","/login","/api/**").permitAll()


                                .requestMatchers("/js/**","/auth/**", "/css/**", "/image/**","/tailwind.css","/img/**.png", "/thymeleaf/**","/csrf-token", "/ajaxCheckId", "/ajaxCheckNickname").permitAll()

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

//                        .defaultSuccessUrl("/swagger-ui/index.html", true)
                        .usernameParameter("userId")
                        .passwordParameter("userPw")
                        .failureUrl("/error/error500")
//                        .successHandler(new SavedRequestAwareAuthenticationSuccessHandler())
//                        .failureHandler(())
                        .permitAll()
                )


                .logout(logout -> logout
                        .logoutSuccessUrl("/loginPage")
                        .logoutRequestMatcher(new AntPathRequestMatcher("/logout"))
                        .invalidateHttpSession(true));
        return http.build();

    }


    @Bean
    public DaoAuthenticationProvider daoAuthenticationProvider(UserService userService) {
        DaoAuthenticationProvider daoProvider = new DaoAuthenticationProvider();
        daoProvider.setUserDetailsService(userService);
        daoProvider.setPasswordEncoder(encodePWD());
        return daoProvider;
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
//    public AuthenticationManager authenticationManager(BCryptPasswordEncoder bCryptPasswordEncoder, UserDetailsService userDetailsService) throws Exception {
//        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
//        authProvider.setUserDetailsService(userDetailsService);
//        authProvider.setPasswordEncoder(bCryptPasswordEncoder);
//
//        return new ProviderManager(authProvider);
//    }
}