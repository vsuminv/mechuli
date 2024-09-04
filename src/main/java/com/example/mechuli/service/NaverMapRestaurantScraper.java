package com.example.mechuli.service;

import org.openqa.selenium.*;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;
import java.util.List;

public class NaverMapRestaurantScraper {

    private static WebDriver driver;
    private static WebDriverWait wait;

    public static void setUp() {
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

    public static void switchToSearchIframe() {
        driver.switchTo().defaultContent();

        // 'searchIframe' 프레임으로 전환
        WebElement searchIframe = wait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//*[@id='searchIframe']")));
        driver.switchTo().frame(searchIframe);
    }

    public static void switchToEntryIframe() {
        driver.switchTo().defaultContent();

        // 'entryIframe' 프레임으로 전환
        WebElement entryIframe = wait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//*[@id='entryIframe']")));
        driver.switchTo().frame(entryIframe);
    }

    public void testRestaurantDataCollection() {
        // 네이버 지도 URL로 이동
        String url = "https://map.naver.com/p/search/%ED%98%9C%ED%99%94%EC%97%AD%20%EC%8B%9D%EB%8B%B9?c=15.00,0,0,0,dh";
        driver.get(url);

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

            nameElement.click();
            // 식당 페이지
            System.out.println("switchToEntryIframe start...");
            switchToEntryIframe();
            System.out.println("switchToEntryIframe done...");
            // 서브 패널에서 식당의 정보 수집
            WebElement addressElement = wait.until(ExpectedConditions.presenceOfElementLocated(By.className("GHAhO")));
            String address = addressElement.getText();

            // 기타 정보 수집 테스트...

            // 원래 창으로 복귀
            switchToSearchIframe();
        }

    }
    public static void main(String[] args) {

        setUp();


        if (driver != null) {
            driver.quit();
        }
    }

    private static class RestaurantData {
        private String name;
        private List<String> images;
        private String rating;
        private String hours;
        private String address;

        public RestaurantData(String name, List<String> images, String rating, String hours, String address) {
            this.name = name;
            this.images = images;
            this.rating = rating;
            this.hours = hours;
            this.address = address;
        }

        public String getName() {
            return name;
        }

        public List<String> getImages() {
            return images;
        }

        public String getRating() {
            return rating;
        }

        public String getHours() {
            return hours;
        }

        public String getAddress() {
            return address;
        }
    }
}
