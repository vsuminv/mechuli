# Thymeleaf 튜토리얼 요약

## 1. Thymeleaf 소개

Thymeleaf는 웹과 독립형 환경에서 사용할 수 있는 현대적인 서버 사이드 Java 템플릿 엔진임. HTML, XML, JavaScript, CSS 및 일반 텍스트를 처리할 수 있음.

주요 특징:
- 우아하고 유지보수가 쉬운 템플릿 생성
- 자연스러운 템플릿 개념 사용
- 표준 방식으로 작동

## 2. 기본 사용법

### 2.1 표준 표현식 구문

Thymeleaf는 다양한 표현식을 제공함:

- 변수 표현식: `${...}`
- 선택 변수 표현식: `*{...}`
- 메시지 표현식: `#{...}`
- 링크 URL 표현식: `@{...}`
- 조각 표현식: `~{...}`

예시:
```html
<p th:text="${user.name}">사용자 이름</p>
<p th:text="#{welcome.message}">환영 메시지</p>
<a th:href="@{/user/profile}">프로필</a>
```

### 2.2 속성 수정

th:* 속성을 사용해 HTML 속성을 동적으로 수정할 수 있음:

```html
<input type="text" name="username" th:value="${user.name}" />
```

### 2.3 반복

th:each를 사용해 컬렉션을 반복할 수 있음:

```html
<ul>
  <li th:each="product : ${products}" th:text="${product.name}">상품 이름</li>
</ul>
```

### 2.4 조건부 평가

th:if와 th:unless를 사용해 조건부 렌더링을 할 수 있음:

```html
<div th:if="${user.isAdmin()}">
  관리자 메뉴
</div>
```

## 3. 레이아웃

### 3.1 템플릿 조각

th:fragment를 사용해 재사용 가능한 템플릿 조각을 정의할 수 있음:

```html
<!-- footer.html -->
<footer th:fragment="copy">
  &copy; 2021 내 웹사이트
</footer>

<!-- 다른 페이지에서 사용 -->
<div th:insert="~{footer :: copy}"></div>
```

### 3.2 레이아웃 상속

레이아웃 템플릿을 만들고 다른 페이지에서 상속받아 사용할 수 있음:

```html
<!-- layout.html -->
<!DOCTYPE html>
<html th:fragment="layout(title, content)">
<head>
    <title th:replace="${title}">레이아웃 제목</title>
</head>
<body>
    <div th:replace="${content}">
        <p>레이아웃 내용</p>
    </div>
</body>
</html>

<!-- page.html -->
<html th:replace="~{layout :: layout(~{::title}, ~{::section})}">
<head>
    <title>페이지 제목</title>
</head>
<body>
    <section>
        <p>페이지 내용</p>
    </section>
</body>
</html>
```

## 4. 유틸리티 객체

Thymeleaf는 다양한 유틸리티 객체를 제공함:

- #dates: 날짜 형식화
- #numbers: 숫자 형식화
- #strings: 문자열 조작
- #lists, #sets, #maps: 컬렉션 처리

예시:
```html
<p th:text="${#dates.format(today, 'yyyy-MM-dd')}">2021-01-01</p>
<p th:text="${#numbers.formatDecimal(price, 1, 2)}">100.00</p>
```

## 5. 국제화 (i18n)

메시지 표현식을 사용해 다국어 지원을 구현할 수 있음:

```properties
# messages_en.properties
welcome.message=Welcome, {0}!

# messages_ko.properties
welcome.message=환영합니다, {0}님!
```

```html
<p th:text="#{welcome.message(${user.name})}">환영 메시지</p>
```

## 6. 폼 처리

Thymeleaf는 Spring MVC와 통합되어 폼 처리를 쉽게 할 수 있음:

```html
<form th:action="@{/save}" th:object="${user}" method="post">
    <input type="text" th:field="*{name}" />
    <span th:if="${#fields.hasErrors('name')}" th:errors="*{name}"></span>
    <button type="submit">저장</button>
</form>
```

## 결론

Thymeleaf는 강력하고 유연한 템플릿 엔진임. 자연스러운 템플릿을 만들 수 있고, 다양한 표현식과 유틸리티를 제공해 동적인 웹 페이지를 쉽게 만들 수 있음. Spring 프레임워크와의 통합도 뛰어나 Java 웹 개발에 매우 유용함.


[타임리프 공홈](https://www.thymeleaf.org/doc/tutorials/3.0/usingthymeleaf.html#the-thref-attribute)