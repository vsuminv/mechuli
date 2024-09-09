package com.example.mechuli.config;


import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@RequiredArgsConstructor
@Configuration
public class WebConfig implements WebMvcConfigurer {

    public void addViewControllers(ViewControllerRegistry registry) {
        registry.addViewController("/").setViewName("home");
        registry.addViewController("/loginPage").setViewName("contents/login");
        registry.addViewController("/joinPage").setViewName("contents/join");
        registry.addViewController("/myPage").setViewName("contents/my/myPage");
        registry.addViewController("/detailPage").setViewName("contents/detail/detailStore");
        registry.addViewController("/mainPage").setViewName("contents/detail/mainPage");
    }
}