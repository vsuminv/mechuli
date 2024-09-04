package com.example.mechuli.service;

import com.example.mechuli.model.Restaurants;
import groovy.util.logging.Slf4j;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@Slf4j
public class CrawlingNaverMap {
    List<Restaurants> restaurants;

    private final WebDriver webDriver;

    @Value("${naver-map}")
    private String url;
    private static String WEB_DRIVER_ID = "webdriver.chrome.driver";
    private static String WEB_DRIVER_PATH = "C:/workspace/chromedriver.exe";

    public CrawlingNaverMap(){
        System.setProperty(WEB_DRIVER_ID,WEB_DRIVER_PATH);

        ChromeOptions options = new ChromeOptions();
        options.addArguments("--start-maximized");
        options.addArguments("--disable-popup-blocking");
        options.addArguments("headless");

        this.webDriver = new ChromeDriver(options);
        restaurants = new ArrayList<>();
    }

    @Override
    public List<Restaurants> crawling(){

    }
}
