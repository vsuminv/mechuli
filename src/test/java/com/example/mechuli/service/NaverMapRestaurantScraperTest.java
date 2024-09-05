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

import static org.junit.jupiter.api.Assertions.*;


public class NaverMapRestaurantScraperTest {

    private WebDriver driver;
    private WebDriverWait wait;
    private JavascriptExecutor jsExecutor;

    @BeforeEach
    public void setUp() {
        // 크롬 드라이버 설정
        System.setProperty("webdriver.chrome.driver", "C:\\workspace\\chromedriver.exe");
        ChromeOptions options = new ChromeOptions();
        options.setBinary("C:\\Program Files\\Google\\chrome\\chrome.exe");
        options.addArguments("--no-sandbox");
        options.addArguments("--disable-dev-shm-usage");
        driver = new ChromeDriver(options);
        jsExecutor = (JavascriptExecutor) driver;

        // WebDriverWait 설정
        wait = new WebDriverWait(driver, Duration.ofSeconds(20));
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
        // 프레임으로 전환
        WebElement iframe = wait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//*[@id='" + frameId + "']")));
        driver.switchTo().frame(iframe);
        try {
            Thread.sleep(2000); // 프레임 전환 후 대기 시간 조정
        } catch (InterruptedException e) {
            System.out.println("Interrupted while waiting: " + e.getMessage());
        }
    }


    @Test
    public void testRestaurantMenuData() {
        // 네이버 지도 URL로 이동
        String url = "https://map.naver.com/p/search/%ED%98%9C%ED%99%94%EC%97%AD%20%EC%8B%9D%EB%8B%B9?c=15.00,0,0,0,dh";
        driver.get(url);

        // IFrame으로 전환
        switchToFrame("searchIframe");

        // 모든 식당의 정보를 저장할 Set
        Set<JsonObject> restaurantDataSet = new HashSet<>();

        boolean hasMorePages = true;

        while (hasMorePages) {
            try {
                // 현재 페이지의 식당 정보 수집
                List<WebElement> listItems = wait.until(ExpectedConditions.presenceOfAllElementsLocatedBy(By.cssSelector("li.UEzoS.rTjJo")));

                if (listItems.isEmpty()) {
                    System.out.println("No restaurants found on this page.");
                    hasMorePages = false; // 더 이상 식당이 없으면 종료
                } else {
                    System.out.println("Found " + listItems.size() + " restaurants on this page.");

                    for (WebElement listItem : listItems) {
                        try {
                            // 식당 이름 추출
                            WebElement nameElement = listItem.findElement(By.cssSelector(".place_bluelink.TYaxT"));
                            String restaurantName = nameElement.getText();
                            System.out.println("Restaurant Name: " + restaurantName);

                            nameElement.click();

                            // 메뉴 페이지로 전환
                            switchToFrame("entryIframe");
                            System.out.println("switchToEntryIframe done...");

                            // 메뉴 링크 찾기 (XPath로 메뉴탭 찾기)
                            try {
                                // 메뉴탭 XPath로 찾기
                                WebElement menuTab = wait.until(ExpectedConditions.presenceOfElementLocated(
                                        By.xpath("//*[@id='app-root']/div/div/div/div[4]/div/div/div/div/a/span[text()='메뉴']")));

                                // '메뉴' 텍스트 확인
                                if (menuTab.getText().equals("메뉴")) {
                                    // 메뉴 링크 클릭
                                    menuTab.click();
                                    System.out.println("Menu tab clicked for restaurant: " + restaurantName);

                                    // 메뉴 정보 수집
                                    List<WebElement> menuItems = wait.until(ExpectedConditions.presenceOfAllElementsLocatedBy(
                                            By.xpath("//*[@id='app-root']/div/div/div/div[6]/div/div[1]/div/ul/li")));

                                    // JsonArray로 메뉴 정보를 저장할 준비
                                    JsonArray menuArray = new JsonArray();

                                    for (int i = 0; i < menuItems.size(); i++) {
                                        WebElement menuItem = menuItems.get(i);

                                        // 메뉴 이름 추출
                                        WebElement menuNameElement = menuItem.findElement(By.xpath(".//div[@class='yQlqY']//span[@class='lPzHi']"));
                                        String menuName = menuNameElement.getText();

                                        // 메뉴 가격 추출
                                        WebElement menuPriceElement = menuItem.findElement(By.xpath(".//div[@class='GXS1X']"));
                                        String menuPrice = menuPriceElement.getText();

                                        // 메뉴 정보를 JsonObject로 저장
                                        JsonObject menuJson = new JsonObject();
                                        menuJson.addProperty("메뉴 이름", menuName);
                                        menuJson.addProperty("가격", menuPrice);

                                        // JsonArray에 추가
                                        menuArray.add(menuJson);
                                    }

                                    // 식당 정보 저장
                                    JsonObject restaurantJson = new JsonObject();
                                    restaurantJson.addProperty("가게이름", restaurantName);
                                    restaurantJson.add("메뉴 목록", menuArray);

                                    // Set에 저장
                                    restaurantDataSet.add(restaurantJson);

                                    // 원래 창으로 복귀
                                    driver.switchTo().defaultContent();
                                    Thread.sleep(3000); // 페이지 로딩 후 대기 시간

                                    // IFrame으로 다시 전환
                                    switchToFrame("searchIframe");
                                } else {
                                    System.out.println("'메뉴' 탭을 찾지 못했습니다.");
                                }
                            } catch (NoSuchElementException e) {
                                System.out.println("Element not found: " + e.getMessage());
                            } catch (TimeoutException e) {
                                System.out.println("Timeout waiting for the menu tab: " + e.getMessage());
                            }

                        } catch (NoSuchElementException e) {
                            System.out.println("Element not found: " + e.getMessage());
                        } catch (StaleElementReferenceException e) {
                            System.out.println("Stale element reference: " + e.getMessage());
                            switchToFrame("searchIframe");
                        } catch (Exception e) {
                            System.out.println("An error occurred: " + e.getMessage());
                        }
                    }

                    // 다음 페이지 버튼 클릭 처리
                    try {
                        WebElement nextPageButton = driver.findElement(By.xpath("//span[text()='다음페이지']/.."));
                        if (nextPageButton.isEnabled()) {
                            nextPageButton.click();
                            Thread.sleep(3000); // 페이지 이동 후 대기 시간 조정
                            System.out.println("Moved to the next page.");
                            // 프레임으로 다시 전환
                            switchToFrame("searchIframe");
                        } else {
                            hasMorePages = false;
                            System.out.println("No more pages.");
                        }
                    } catch (NoSuchElementException e) {
                        hasMorePages = false;
                        System.out.println("Next page button not found: " + e.getMessage());
                    } catch (Exception e) {
                        hasMorePages = false;
                        System.out.println("An error occurred while trying to move to the next page: " + e.getMessage());
                    }
                }
            } catch (Exception e) {
                System.out.println("An error occurred while processing the page: " + e.getMessage());
                hasMorePages = false; // 예외 발생 시 루프 종료
            }
        }

        // 최종적으로 모든 식당과 메뉴 정보를 출력
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
/*public class NaverMapRestaurantScraperTest {

    private WebDriver driver;
    private WebDriverWait wait;
    private JavascriptExecutor jsExecutor;

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

    // 서브 판넬(EntryIframe) 이동 테스트
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

//    여러 매장의 정보 크롤링
@Test
public void testRestaurantData() throws InterruptedException {
    // 네이버 지도 URL로 이동
    testPageLoad();

    // IFrame으로 전환
    switchToFrame("searchIframe");
    System.out.println("switchToSearchIframe done...");

    // 모든 식당의 정보를 저장할 Set
    Set<String> restaurantNames = new HashSet<>();
    Set<String> restaurantAddresses = new HashSet<>();

    boolean hasMorePages = true;

    while (hasMorePages) {
        boolean hasMoreItemsInCurrentPage = true;

        while (hasMoreItemsInCurrentPage) {
            try {
                // 현재 페이지의 식당 정보 수집
                List<WebElement> listItems = wait.until(ExpectedConditions.presenceOfAllElementsLocatedBy(By.cssSelector("li.UEzoS.rTjJo")));

                if (listItems.isEmpty()) {
                    System.out.println("No restaurants found on this page.");
                    hasMoreItemsInCurrentPage = false; // 더 이상 식당이 없으면 루프 종료
                } else {
                    System.out.println("Found " + listItems.size() + " restaurants on this page.");

                    for (WebElement listItem : listItems) {
                        try {
                            // 식당 이름 추출
                            WebElement nameElement = listItem.findElement(By.cssSelector(".place_bluelink.TYaxT"));
                            String name = nameElement.getText();
                            if (!restaurantNames.contains(name)) { // 중복 검사
                                restaurantNames.add(name);
                                System.out.println("Restaurant Name: " + name);

                                // 식당 이름 클릭
                                nameElement.click();
                                // 식당 페이지로 전환
                                switchToFrame("entryIframe");
                                System.out.println("switchToEntryIframe done...");

                                // 서브 패널에서 식당의 주소 수집
                                WebElement addressElement = wait.until(ExpectedConditions.presenceOfElementLocated(By.className("LDgIH")));
                                String address = addressElement.getText();
                                if (!restaurantAddresses.contains(address)) { // 중복 검사
                                    restaurantAddresses.add(address);
                                    System.out.println("Restaurant Address: " + address);
                                }

                                // 원래 창으로 복귀
                                driver.switchTo().defaultContent();
                                // 다시 searchIframe으로 전환
                                switchToFrame("searchIframe");
                            }
                        } catch (NoSuchElementException e) {
                            System.out.println("Element not found: " + e.getMessage());
                        } catch (StaleElementReferenceException e) {
                            System.out.println("Stale element reference: " + e.getMessage());
                            driver.navigate().refresh(); // 페이지 새로 고침
                            switchToFrame("searchIframe");
                        } catch (Exception e) {
                            System.out.println("An error occurred: " + e.getMessage());
                        }
                    }

                    // 스크롤하여 더 많은 항목을 로드
                    scrollToEndOfPage();

                    // 다시 스크롤 후 식당 리스트를 가져와 이전과 중복인지 확인
                    List<WebElement> updatedListItems = wait.until(ExpectedConditions.presenceOfAllElementsLocatedBy(By.cssSelector("li.UEzoS.rTjJo")));

                    // 중복 확인: 스크롤 후 이전과 동일한 아이템이면 더 이상 로드되지 않은 것으로 판단
                    if (updatedListItems.size() <= listItems.size()) {
                        hasMoreItemsInCurrentPage = false;
                        System.out.println("No more items to load in current page.");
                    }
                }
            } catch (Exception e) {
                System.out.println("An error occurred while processing the page: " + e.getMessage());
                hasMoreItemsInCurrentPage = false; // 예외 발생 시 루프 종료
            }
        }

        // 페이지가 더 있는지 확인
        try {
            WebElement nextPageButton = driver.findElement(By.xpath("//div[@class='zRM9F']//a[contains(@class, 'eUTV2')][contains(., '다음페이지')]"));
            if (nextPageButton.isEnabled()) {
                nextPageButton.click();
                Thread.sleep(3000); // 페이지 이동 후 대기 시간 조정
                System.out.println("Moved to the next page.");
                // 프레임으로 다시 전환
                switchToFrame("searchIframe");
            } else {
                hasMorePages = false;
                System.out.println("No more pages.");
            }
        } catch (NoSuchElementException e) {
            hasMorePages = false;
            System.out.println("Next page button not found: " + e.getMessage());
        } catch (Exception e) {
            hasMorePages = false;
            System.out.println("An error occurred while trying to move to the next page: " + e.getMessage());
        }
    }

    System.out.println("Total unique restaurants found: " + restaurantNames.size());
    System.out.println("Total unique addresses found: " + restaurantAddresses.size());
}

    private void scrollToEndOfPage() {
        // 페이지 끝까지 스크롤
        jsExecutor.executeScript("window.scrollTo(0, document.body.scrollHeight)");
        try {
            Thread.sleep(2000);  // 스크롤 후 페이지가 로드될 시간을 기다림
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }

    @AfterEach
    public void tearDown() {
        // 드라이버 종료
        if (driver != null) {
            driver.quit();
        }
    }

}*/
