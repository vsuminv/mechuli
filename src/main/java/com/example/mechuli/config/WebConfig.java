package com.example.mechuli.config;


import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@RequiredArgsConstructor
@Configuration
public class WebConfig implements WebMvcConfigurer {

    public void addViewControllers(ViewControllerRegistry registry) {
//        registry.addViewController("/").setViewName("home");
        registry.addViewController("/home").setViewName("home");
        registry.addViewController("/").setViewName("pages/mainPage");
        registry.addViewController("/joinPage").setViewName("pages/joinPage");
        registry.addViewController("/loginPage").setViewName("pages/loginPage");
        registry.addViewController("/myPage").setViewName("pages/myPage");
        registry.addViewController("/boardPage").setViewName("pages/boardPage");

    }
}