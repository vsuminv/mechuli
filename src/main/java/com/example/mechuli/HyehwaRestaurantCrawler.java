package com.example.mechuli;

// HyehwaRestaurantCrawler.java

import java.io.IOException;

public class HyehwaRestaurantCrawler {

    public static void main(String[] args) throws IOException {

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