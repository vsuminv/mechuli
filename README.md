### 메뉴 추천 app MECHULI
- [notion](https://sasha1107.notion.site/Team-Project-Template-cdcd0a777261493eb42a035b6a12589b)
- [miro](https://miro.com/app/board/uXjVKlGWC2M=/)
- [swagger](http://localhost:8081/swagger)

---

## 개발 환경

- JDK 17
- Spring Boot 3.3.3
- gradle
- Security
- Spring Data JPA - H2,MySql
- thymeleaf, node-tailwind
- intelliJ , Eclipse

```
dependencies {
		//basic
	implementation 'org.springframework.boot:spring-boot-starter-web'
	implementation 'org.springframework.boot:spring-boot-starter-web-services'
	implementation 'org.springframework.boot:spring-boot-starter-logging'
	developmentOnly 'org.springframework.boot:spring-boot-devtools'
	implementation 'org.springframework.boot:spring-boot-starter-security'
	compileOnly 'org.projectlombok:lombok'
	annotationProcessor 'org.projectlombok:lombok'
	testImplementation 'org.springframework.boot:spring-boot-starter-test'
	testImplementation 'org.springframework.security:spring-security-test'
	testRuntimeOnly 'org.junit.platform:junit-platform-launcher'
	implementation 'org.springdoc:springdoc-openapi-starter-webmvc-ui:2.1.0'
	implementation 'org.springframework.boot:spring-boot-starter-thymeleaf'
	implementation 'nz.net.ultraq.thymeleaf:thymeleaf-layout-dialect'

	implementation 'org.thymeleaf.extras:thymeleaf-extras-springsecurity6'
	implementation 'org.springframework.boot:spring-boot-starter-data-jpa'
	implementation 'org.springframework.boot:spring-boot-starter-validation'
	implementation 'io.github.cdimascio:java-dotenv:5.2.2'
	// DB
//	runtimeOnly 'com.mysql:mysql-connector-j'
	runtimeOnly 'com.h2database:h2'


```
## 구현 기능
- 로그인/회원가입
- 지도
- CRUD

---
### Front
⬜✅
- 디자인 된 화면 구현
- 백엔드에 대응하여 컴포넌트 생성

---
### Back
⬜✅
- Database table 설계
- 로그인 / 회원가입 검증 로직 중복 예외 처리 api

---
### Server
⬜✅
aws ec2 + s3 + docker 배포

---
---

### Truble shooting

- 테이블 설계. 관계 매핑⬜


