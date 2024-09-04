package com.example.mechuli;

// HyehwaRestaurantCrawler.java

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;

public class HyehwaRestaurantCrawler {

    public static void main(String[] args) throws IOException {
        // 크롤링할 혜화동 식당 목록 페이지 URL
        String url = "https://www.mangoplate.com/restaurants/L3J93k";

        // Jsoup를 사용하여 해당 페이지의 HTML 문서를 파싱
        Document doc = Jsoup.connect(url).get();

        // 식당 정보를 담을 리스트
        List<Restaurant> restaurants = new ArrayList<>();

        // 각 식당 정보를 추출
        Elements restaurantElements = doc.select("li.list-restaurant");
        for (Element restaurantElement : restaurantElements) {
            // 매장 이름
            String name = restaurantElement.selectFirst("a.title").text();

            // 메뉴
            String menu = restaurantElement.selectFirst("p.etc").text();

            // 가격
            String price = restaurantElement.selectFirst("span.price-info").text();

            // 이미지
            String imageUrl = restaurantElement.selectFirst("img.restaurant-img").attr("src");

            // 식당 정보 객체 생성
            Restaurant restaurant = new Restaurant(name, menu, price, imageUrl);

            // 리스트에 추가
            restaurants.add(restaurant);
        }

        // 크롤링한 식당 정보 출력
        for (Restaurant restaurant : restaurants) {
            System.out.println(restaurant);
        }
    }

    // 식당 정보를 담는 클래스
    private static class Restaurant {
        private String name;
        private String menu;
        private String price;
        private String imageUrl;

        public Restaurant(String name, String menu, String price, String imageUrl) {
            this.name = name;
            this.menu = menu;
            this.price = price;
            this.imageUrl = imageUrl;
        }

        @Override
        public String toString() {
            return String.format("매장 이름: %s, 메뉴: %s, 가격: %s, 이미지 URL: %s", name, menu, price, imageUrl);
        }
    }
}
// ```

// 이 파일을 `HyehwaRestaurantCrawler.java`라는 이름으로 저장하고 다음 명령을 사용하여 실행하세요.

// ```
// javac HyehwaRestaurantCrawler.java
// java HyehwaRestaurantCrawler
// ```

// 이렇게 하면 크롤링한 식당 정보가 콘솔에 출력됩니다.