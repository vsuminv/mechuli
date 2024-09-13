package com.example.mechuli.config;


import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@RequiredArgsConstructor
@Configuration
public class WebConfig implements WebMvcConfigurer {

    public void addViewControllers(ViewControllerRegistry registry) {
//        registry.addViewController("/mainPage.html").setViewName("/contents/detail/mainPage.html");
        registry.addViewController("/").setViewName("pages/mainPage");
        registry.addViewController("/test").setViewName("home");
        registry.addViewController("/mainPage").setViewName("pages/mainPage");
        registry.addViewController("/joinPage").setViewName("pages/joinPage");
        registry.addViewController("/loginPage").setViewName("pages/loginPage");
        registry.addViewController("/myPage").setViewName("pages/myPage");
        registry.addViewController("/boardPage").setViewName("pages/boardPage");
//        registry.addViewController("/detailPage").setViewName("contents/detail/detailStore");
//        registry.addViewController("/api/**").setViewName("contents/detail/");
//        registry.addViewController("/test").setViewName("wellcomePage");

    }
}