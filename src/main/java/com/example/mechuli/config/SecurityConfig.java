package com.example.mechuli.config;


import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;

@RequiredArgsConstructor
@EnableWebSecurity
@Configuration
public class SecurityConfig {

    @Bean
    public BCryptPasswordEncoder encodePWD(){
        return new BCryptPasswordEncoder();
    }
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .headers(AbstractHttpConfigurer::disable)

                .authorizeHttpRequests(auth -> auth
                                .requestMatchers("/js/**", "/home", "/auth/**", "/api/**", "/css/**", "/img/**", "/image/**", "/tailwinds.css", "/thymeleaf/**", "/csrf-token", "/ajaxCheckId", "/ajaxCheckNickname", "/ajax/**").permitAll()
//                                .requestMatchers("/js/**","/home","/auth/**","/api/**", "/css/**", "/img/**","/image/**","/tailwinds.css", "/thymeleaf/**","/csrf-token", "/ajaxCheckId", "/ajaxCheckNickname").permitAll()
                                .requestMatchers("/joinPage/**","/","/myPage/**").permitAll()
                                .anyRequest().authenticated()
                )
                .formLogin(login -> login
                                .loginPage("/loginPage")
                                .loginProcessingUrl("/login") // action
                                .defaultSuccessUrl("/home", true)
                                .usernameParameter("userId")
                                .passwordParameter("userPw")
                                .failureUrl("/error/error500")
//                        .successHandler(new SavedRequestAwareAuthenticationSuccessHandler())
//                        .failureHandler(())
                                .permitAll()
                )
                .logout(logout -> logout
                        .logoutRequestMatcher(new AntPathRequestMatcher("/logout"))
                        .logoutSuccessUrl("/")
                        .invalidateHttpSession(true));
        return http.build();
    }
}