package com.example.mechuli.config;


import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@RequiredArgsConstructor
@Configuration
public class WebConfig implements WebMvcConfigurer {

    public void addViewControllers(ViewControllerRegistry registry) {
//        registry.addViewController("/mainPage").setViewName("/contents/detail/mainPage");
//        registry.addViewController("/").setViewsName("wellcomePage");
        registry.addViewController("/home").setViewName("home");
        registry.addViewController("/joinPage").setViewName("pages/joinPage");
        registry.addViewController("/").setViewName("pages/mainPage");
        registry.addViewController("/mainPage").setViewName("pages/mainPage");
        registry.addViewController("/loginPage").setViewName("pages/loginPage");
        registry.addViewController("/myPage").setViewName("pages/myPage");
        registry.addViewController("/boardPage").setViewName("pages/boardPage");
        registry.addViewController("/boardPage").setViewName("pages/boardPage");
        registry.addViewController("/api/boardPage").setViewName("pages/boardPage");
//        registry.addViewController("/detailPage").setViewName("contents/detail/detailStore");
//        registry.addViewController("/api/**").setViewName("contents/detail/");
//        registry.addViewController("/test").setViewName("wellcomePage");

    }
}