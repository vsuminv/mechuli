package com.example.mechuli.config;


import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@RequiredArgsConstructor
@Configuration
public class WebConfig implements WebMvcConfigurer {

    public void addViewControllers(ViewControllerRegistry registry) {
        registry.addViewController("/").setViewName("wellcomePage");
        registry.addViewController("/home").setViewName("home");
        registry.addViewController("/joinPage").setViewName("pages/joinPage");
        registry.addViewController("/loginPage").setViewName("pages/loginPage");
        registry.addViewController("/myPage").setViewName("pages/myPage");
        registry.addViewController("/detailPage").setViewName("contents/detail/detailStore");
    }

//    @Override
//    public void addCorsMappings(CorsRegistry registry) {
//        registry.addMapping("/**")
//                .allowedOrigins("http://localhost:8081") // Your allowed origin
//                .allowedMethods("GET", "POST", "PUT", "DELETE")
//                .allowedHeaders("*")
//                .allowCredentials(true);
//    }
}