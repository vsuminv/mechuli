package com.example.mechuli.service;

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

import static org.junit.jupiter.api.Assertions.*;

public class NaverMapRestaurantScraperTest {

    private WebDriver driver;
    private WebDriverWait wait;

    @BeforeEach
    public void setUp() {
        // 크롬 드라이버 설정
        System.setProperty("webdriver.chrome.driver", "C:\\workspace\\chromedriver.exe");
        ChromeOptions options = new ChromeOptions();
        options.setBinary("C:\\Program Files\\Google\\chrome\\chrome.exe");
        options.addArguments("--no-sandbox");
        options.addArguments("--disable-dev-shm-usage");
        driver = new ChromeDriver(options);

        // WebDriverWait 설정
        wait = new WebDriverWait(driver, Duration.ofSeconds(20));
    }

    //    @Test
    public void testPageLoad() {
        // 네이버 지도 URL로 이동
        String url = "https://map.naver.com/p/search/%ED%98%9C%ED%99%94%EC%97%AD%20%EC%8B%9D%EB%8B%B9?c=15.00,0,0,0,dh";
        driver.get(url);

    }

    public void switchToSearchIframe() {
        driver.switchTo().defaultContent();

        // 'searchIframe' 프레임으로 전환
        WebElement searchIframe = wait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//*[@id='searchIframe']")));
        driver.switchTo().frame(searchIframe);
    }

    public void switchToEntryIframe() {
        driver.switchTo().defaultContent();

        // 'entryIframe' 프레임으로 전환
        WebElement entryIframe = wait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//*[@id='entryIframe']")));
        driver.switchTo().frame(entryIframe);
    }

    public void switchToFrame(String frameId) {
        driver.switchTo().defaultContent();
        // 프레임으로 전환
        WebElement iframe = wait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//*[@id='" + frameId + "']")));
        driver.switchTo().frame(iframe);
        try {
            Thread.sleep(2000); // 프레임 전환 후 대기 시간 조정
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }

    @Test
    public void testRestaurantDataCollection() {
        // 네이버 지도 URL로 이동
        testPageLoad();

        // IFrame으로 전환
        driver.switchTo().frame(driver.findElement(By.xpath("//*[@id='searchIframe']")));
        System.out.println("switchToSearchIframe done...");

        // 식당 정보 수집
        System.out.println("start _pcmap_list_scroll_container search");
        List<WebElement> restaurants = wait.until(ExpectedConditions.presenceOfAllElementsLocatedBy(By.cssSelector(".place_bluelink")));
        if (restaurants.isEmpty()) {
            System.out.println("#_pcmap_list_scroll_container > ul > li:nth-child(1) > div.CHC5F > a > div > div > span.place_bluelink.TYaxT is null!!!!!!!!!!");
        }

        for (WebElement restaurant : restaurants) {
            // 이름과 서브 패널 이동
            WebElement nameElement = restaurant.findElement(By.xpath("//*[@id=\"_pcmap_list_scroll_container\"]/ul/li[3]/div[1]/a[1]"));
            assertNotNull(nameElement, "Restaurant name element should not be null.");

            nameElement.click();
            // 식당 페이지
            System.out.println("switchToEntryIframe start...");
            switchToEntryIframe();
            System.out.println("switchToEntryIframe done...");
            // 서브 패널에서 식당의 정보 수집
            WebElement addressElement = wait.until(ExpectedConditions.presenceOfElementLocated(By.className("GHAhO")));
            String address = addressElement.getText();
            assertNotNull(address, "Address should not be null.");

            // 기타 정보 수집 테스트...

            // 원래 창으로 복귀
            switchToSearchIframe();
        }
    }

    @Test
    public void testRestaurantData() throws InterruptedException {
        // 네이버 지도 URL로 이동
        testPageLoad();

        // IFrame으로 전환
        driver.switchTo().frame(driver.findElement(By.xpath("//*[@id='searchIframe']")));
        System.out.println("switchToSearchIframe done...");

        // 모든 식당의 정보를 저장할 Set
        Set<String> restaurantNames = new HashSet<>();
        Set<String> restaurantAddresses = new HashSet<>();

        boolean hasMorePages = true;

        while (hasMorePages) {
            try {
                // 식당 목록 가져오기
                List<WebElement> listItems = wait.until(ExpectedConditions.presenceOfAllElementsLocatedBy(By.cssSelector("li.UEzoS.rTjJo")));

                if (listItems.isEmpty()) {
                    System.out.println("No restaurants found on this page.");
                    hasMorePages = false;
                } else {
                    System.out.println("Found " + listItems.size() + " restaurants on this page.");

                    for (WebElement listItem : listItems) {
                        try {
                            // 식당 이름 추출
                            WebElement nameElement = listItem.findElement(By.cssSelector(".place_bluelink.TYaxT"));
                            String name = nameElement.getText();
                            if (!restaurantNames.contains(name)) {  // 중복 검사
                                restaurantNames.add(name);
                                System.out.println("Restaurant Name: " + name);

                                // 식당 클릭
                                nameElement.click();

                                // 식당 상세 정보 IFrame으로 전환
                                switchToFrame("entryIframe");

                                // 상세 정보 수집 (주소 등)
                                WebElement addressElement = wait.until(ExpectedConditions.presenceOfElementLocated(By.className("LDgIH")));
                                String address = addressElement.getText();
                                System.out.println("Restaurant Address: " + address);

                                // 원래 IFrame으로 복귀
                                driver.switchTo().defaultContent();
                                driver.switchTo().frame(driver.findElement(By.xpath("//*[@id='searchIframe']")));

                                // 페이지 새로 고침 대기
                                Thread.sleep(2000);
                            }
                        } catch (NoSuchElementException e) {
                            System.out.println("Element not found: " + e.getMessage());
                        } catch (StaleElementReferenceException e) {
                            System.out.println("Stale element reference: " + e.getMessage());
                        }
                    }

                    // 다음 페이지로 이동
                    try {
                        WebElement nextPageButton = driver.findElement(By.xpath("//a[contains(@class, 'eUTV2')][contains(text(), '다음페이지')]"));
                        if (nextPageButton.isEnabled()) {
                            nextPageButton.click();
                            Thread.sleep(3000);  // 페이지 이동 후 대기 시간
                        } else {
                            hasMorePages = false;
                        }
                    } catch (NoSuchElementException e) {
                        hasMorePages = false;
                        System.out.println("Next page button not found: " + e.getMessage());
                    }
                }
            } catch (Exception e) {
                System.out.println("An error occurred: " + e.getMessage());
                hasMorePages = false;
            }
        }

        System.out.println("Total unique restaurants found: " + restaurantNames.size());
        System.out.println("Total unique addresses found: " + restaurantAddresses.size());
    }

    @AfterEach
    public void tearDown() {
        // 드라이버 종료
        if (driver != null) {
            driver.quit();
        }
    }

}
