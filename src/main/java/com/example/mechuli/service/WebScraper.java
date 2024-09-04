package com.example.mechuli.service;

import java.time.Duration;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.springframework.stereotype.Component;
import org.springframework.util.ObjectUtils;
import org.springframework.beans.factory.annotation.Value;

// 120.0.6099.71버전 크롬 드라이버
@Component
public class WebScraper {
  private static String WEB_DRIVER_PATH = "C:/workspace/chromedriver.exe";

  public static WebDriver getDriver() {
    if (ObjectUtils.isEmpty(System.getProperty("webdriver.chrome.driver"))) {
      System.setProperty("webdriver.chrome.driver", WEB_DRIVER_PATH);
    }
    ChromeOptions chromeOptions = new ChromeOptions();
    // chromeOptions.setHeadless(true);
    chromeOptions.addArguments("--lang=ko");
    chromeOptions.addArguments("--no-sandbox");
    chromeOptions.addArguments("--disable-dev-shm-usage");
    chromeOptions.addArguments("--disable-gpu");
    chromeOptions.setCapability("ignoreProtectedModeSettings", true);
    WebDriver driver = new ChromeDriver(chromeOptions);
    driver.manage().timeouts().pageLoadTimeout(Duration.ofSeconds(30));
    return driver;
  }

  @Value("C:/workspace/chromedriver.exe")
  public void initDriver(String path) {
    WEB_DRIVER_PATH = path;
  }

  public static void quit(WebDriver driver) {
    if (!ObjectUtils.isEmpty(driver)) {
      driver.quit();
    }
  }

  public static void close(WebDriver driver) {
    if (!ObjectUtils.isEmpty(driver)) {
      driver.close();
    }
  }

}