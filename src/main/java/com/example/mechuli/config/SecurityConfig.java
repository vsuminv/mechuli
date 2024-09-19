package com.example.mechuli.config;


import jakarta.servlet.Filter;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
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
                                .requestMatchers("/joinPage/**","/","/friendPage/**").permitAll()
                                .anyRequest().authenticated()

                )
                .formLogin(login -> login
                                .loginPage("/loginPage")
                                .loginProcessingUrl("/login") // action
                                .defaultSuccessUrl("/", true)
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
    @Bean
    public Filter userSessionFilter() {
        return (request, response, chain) -> {
            HttpServletRequest httpRequest = (HttpServletRequest) request;
            HttpServletResponse httpResponse = (HttpServletResponse) response; //언젠가 쓰겠지
            HttpSession session = httpRequest.getSession();

            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

            if (authentication != null && authentication.getPrincipal() instanceof UserDetails) {
                UserDetails userDetails = (UserDetails) authentication.getPrincipal();
                session.setAttribute("nickname", userDetails.getUsername());
            }

            chain.doFilter(request, response);
        };
    }
}