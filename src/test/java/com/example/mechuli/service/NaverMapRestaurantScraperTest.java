package com.example.mechuli.service;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.openqa.selenium.*;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

public class NaverMapRestaurantScraperTest {

    private WebDriver driver;
    private WebDriverWait wait;
    private JavascriptExecutor jsExecutor;

    @BeforeEach
    public void setUp() {
        System.setProperty("webdriver.chrome.driver", "C:\\workspace\\chromedriver.exe");
        ChromeOptions options = new ChromeOptions();
        options.setBinary("C:\\Program Files\\Google\\chrome\\chrome.exe");
        options.addArguments("--no-sandbox");
        options.addArguments("--disable-dev-shm-usage");
        driver = new ChromeDriver(options);
        jsExecutor = (JavascriptExecutor) driver;

        wait = new WebDriverWait(driver, Duration.ofSeconds(20));  // WebDriverWait 설정
    }

    private void scrollToEndOfPage() {
        jsExecutor.executeScript("window.scrollTo(0, document.body.scrollHeight)");
        try {
            Thread.sleep(2000);  // 스크롤 후 페이지가 로드될 시간을 기다림
        } catch (InterruptedException e) {
            System.out.println("Interrupted while waiting: " + e.getMessage());
        }
    }

    private void switchToFrame(String frameId) {
        driver.switchTo().defaultContent();
        WebElement iframe = wait.until(ExpectedConditions.presenceOfElementLocated(By.id(frameId)));
        driver.switchTo().frame(iframe);
        try {
            Thread.sleep(2000);  // 프레임 전환 후 대기 시간
        } catch (InterruptedException e) {
            System.out.println("Interrupted while waiting: " + e.getMessage());
        }
    }

    @Test
    public void testRestaurantMenuData() {
        String url = "https://map.naver.com/p/search/%ED%98%9C%ED%99%94%EC%97%AD%20%EC%8B%9D%EB%8B%B9?c=15.00,0,0,0,dh";
        driver.get(url);

        switchToFrame("searchIframe");

        Set<JsonObject> restaurantDataSet = new HashSet<>();
        boolean hasMorePages = true;

        while (hasMorePages) {
            try {
                List<WebElement> listItems = wait.until(ExpectedConditions.presenceOfAllElementsLocatedBy(By.cssSelector("li.UEzoS.rTjJo")));

                if (listItems.isEmpty()) {
                    System.out.println("No restaurants found on this page.");
                    hasMorePages = false;
                } else {
                    System.out.println("Found " + listItems.size() + " restaurants on this page.");

                    for (WebElement listItem : listItems) {
                        try {
                            WebElement nameElement = listItem.findElement(By.cssSelector(".place_bluelink.TYaxT"));
                            String restaurantName = nameElement.getText();
                            System.out.println("Restaurant Name: " + restaurantName);

                            nameElement.click();

                            switchToFrame("entryIframe");
                            System.out.println("switchToEntryIframe done...");

                            try {
                                WebElement menuTab = wait.until(ExpectedConditions.presenceOfElementLocated(
                                        By.xpath("//*[@id='app-root']/div/div/div/div[4]/div/div/div/div/a/span[text()='메뉴']")));

                                if (menuTab.getText().equals("메뉴")) {
                                    menuTab.click();
                                    System.out.println("Menu tab clicked for restaurant: " + restaurantName);

                                    List<WebElement> menuItems = wait.until(ExpectedConditions.presenceOfAllElementsLocatedBy(
                                            By.xpath("//*[@id='app-root']/div/div/div/div[6]/div/div[1]/div/ul/li")));

                                    JsonArray menuArray = new JsonArray();

                                    for (WebElement menuItem : menuItems) {
                                        WebElement menuNameElement = menuItem.findElement(By.xpath(".//div[@class='yQlqY']//span[@class='lPzHi']"));
                                        String menuName = menuNameElement.getText();

                                        WebElement menuPriceElement = menuItem.findElement(By.xpath(".//div[@class='GXS1X']"));
                                        String menuPrice = menuPriceElement.getText();

                                        JsonObject menuJson = new JsonObject();
                                        menuJson.addProperty("메뉴 이름", menuName);
                                        menuJson.addProperty("가격", menuPrice);

                                        menuArray.add(menuJson);
                                    }

                                    JsonObject restaurantJson = new JsonObject();
                                    restaurantJson.addProperty("가게이름", restaurantName);
                                    restaurantJson.add("메뉴 목록", menuArray);

                                    restaurantDataSet.add(restaurantJson);

                                    driver.switchTo().defaultContent();
                                    Thread.sleep(3000);  // 페이지 로딩 후 대기

                                    switchToFrame("searchIframe");
                                } else {
                                    System.out.println("'메뉴' 탭을 찾지 못했습니다.");
                                }
                            } catch (TimeoutException e) {
                                System.out.println("Timeout waiting for the menu tab: " + e.getMessage());
                            }

                        } catch (NoSuchElementException | StaleElementReferenceException e) {
                            System.out.println("Error: " + e.getMessage());
                            switchToFrame("searchIframe");
                        } catch (Exception e) {
                            System.out.println("An error occurred: " + e.getMessage());
                        }
                    }

                    try {
                        WebElement nextPageButton = driver.findElement(By.xpath("//span[text()='다음페이지']/.."));
                        if (nextPageButton.isEnabled()) {
                            nextPageButton.click();
                            Thread.sleep(3000);  // 페이지 이동 후 대기
                            switchToFrame("searchIframe");
                        } else {
                            hasMorePages = false;
                            System.out.println("No more pages.");
                        }
                    } catch (NoSuchElementException e) {
                        hasMorePages = false;
                        System.out.println("Next page button not found: " + e.getMessage());
                    }
                }
            } catch (Exception e) {
                System.out.println("Error while processing the page: " + e.getMessage());
                hasMorePages = false;
            }
        }

        Gson gson = new Gson();
        System.out.println(gson.toJson(restaurantDataSet));
    }

    @AfterEach
    public void tearDown() {
        if (driver != null) {
            driver.quit();
        }
    }
}