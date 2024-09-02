package com.example.mechuli.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;

@RequiredArgsConstructor
@Configuration
public class WebConfig {


    public void addViewControllers(ViewControllerRegistry registry) {
        registry.addViewController("/").setViewName("index");
        registry.addViewController("/join").setViewName("join");
        registry.addViewController("/login").setViewName("login");

    }
}
