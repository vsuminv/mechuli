# Design 진행 상황

### - 9.3 
초석

---
#### - 오늘 할 거
1. 페이지 layout 컨셉 설정 및 적용 , 컴포넌트(버튼 등) design 컨셉 논의 후 설정 및 적용함,  
2. 주요 Page { login  /  join   /  join2  }  
3. Component { mainSearch / button / search / } 
---

#### - 나중에 할 거
1. 입체감 주기 {선 두께와 각도 조절, shadow 적용}
2. 텍스트 사이즈,공간 정립하기
3. loading page. (새 발자국 생각중)
4. 하단 디자인 자갈 밭

--- 
#### - 비고
- `discus` 디자인에 어울리는 `메이플스토리 폰트` 사용
- `setting` 타임리프 레이아웃 설정을 위해 `thymeleaf-layout-dialect` 의존성 주입.  

--- 




### - 9.4
myPage 위주 작업

--- 

#### - 오늘 할 거
1. 컴포넌트 분배와 역할 정의하고 도식화
2. Page {  myPage  /  userUpate  /  partyDial  }
3. Component {  userSearch  /  partySearch  /  foodList  /  storeList  /  partyList  }
4. PPT 컨셉,개요 정립
5. merge join2 on to join

--- 

#### - 나중에 할 거
1. 시간에 따라 백그라운드 색 조절 하기.(점심 밝게 저녁 어둡게)
2. 최근 같이 식사한 그룹 생성.-> 레디스로 해야하나
3. list들 걍 Map으로 api 뽑자
4. 로그인 onclic으로 join,login 화면 전환하기. request로 전환 X
5. joinBtn 화면 전환시 db 검증 예외처리.- js로 하는게 편할듯
---

#### - 비고
- 

--- 

### - 9.5
- `feat` myPage 위주 작업

--- 

#### - 오늘 할 거
1. Page {  myPage  /  userUpate  /  partyDial  }
2. Component {  userSearch  /  partySearch  /  foodList  /  storeList  /  partyList  }
3. grid 잡기 위해 right,left 생성.
4. 협업과 Test 편의성을 위해 right-grid에 Get버튼들 생성.
5. 스무스한 렌더링 config.js 에서 추가.

--- 

#### - 나중에 할 거
1. 업데이트 페이지 진입 전, 로그인 페이지 가져와서 비밀번호 확인시키기.
2. 업데이트 페이지에서 아이디,닉네임 잠구기.
3. title 옆에 favicon icon 집어넣고싶다.
4. footer에 걍 myPage 아이콘 넣자.
5. footer에 sns 연동 넣기. 팝업 메뉴로 하면 좋을듯.
6. left에 앱으로 연결 QR코드 박기
7. 실시간 회원가입 항목별 조건 체크 

---

#### - 비고
- 

--- 
### - 9.6

#### 한거
1. 준호컴에 ide 커뮤니티,h2-console,git 저장.
2. ide DB navigator 플러그인 설치 후 h2 연결.

#### 나중에 할 거

---
#### 비고


---
### 9.8

#### 한거
1. 디자이너의 수정요청 : background 색, header 제거. 
2. footer 조정.
3. http test와 api 명세서 작성을 위해 swagger setting
4. 가입,로그인 텍스트 안에 체크박스 유효성 실시간 체크

#### 나중에 할 거
1. 내가 쓴 리뷰에서 하단에 가게명,날짜 정도 나오면 좋을듯
2. 서버 검색 측 엔드포인트
3. 페이저블, 페이지네이션. 둘 중 하나로 페이징 처리하기.
4. 상세보기 페이지 merge 
5. joinPage 아이디,닉 중복검사 할때 api 콜하고 값 받아서 체크표시. 
6. 에러메세지 띄우기 팀원간 논의
7. default 색상 재정의. 

---
#### 비고
- `ref` : [회원가입 유효성 검사 참고](https://xetown.com/questions/1420104)


---
### 9.9

#### 한거
1. main.dev에 백,프론트 병합
2. WebConfig,UserController 수정.{controller GetMapping 메서드들 WebConfig에 등록함}
3. tailwind 색,자간 등 등록
4. 중복체크
#### 나중에 할 거
1. 로그인 에러처리.
2. 
---
#### 비고
- `discus` : 검색기능에 식당 이름 넣을지 아님 뺄지.
- `truble` : 시큐리티 csrf 

- [시큐리티와 CSRF 관련 포스트](https://junhyunny.github.io/information/security/spring-boot/spring-security/cross-site-reqeust-forgery/)
- [CSRF Token 임의 발행하기](https://velog.io/@kimujin99/Side-project-Spring-Security-CSRF-Token-%ED%99%9C%EC%9A%A9%ED%95%98%EA%B8%B01)

----

### 9.10
목표 : 프론트 전체 리펙토링 내일까지 마무리  
#### 한거
1. 개발용 DB에서 배포용 DB로 갈아끼우기
2. 데이터 파싱{myPage,joinPage,loginPage} 테스트
3. 로그인 후처리 화면 전환
#### 나중에 할 거
1. mainPage,detailPage 리펙토링
2. 현재 static 하위 전체에 접근권한을 준 상태 보안상 안좋음. 나중에 접근권한 유,무 폴더 하나씩 나누기.
3. 로그인 클라용 예외처리 failureUrl
4. 로그인 후처리 화면 전환 디테일 = 디자이너와 논의 후 결정
5. 로그인,회원가입은 th:sec으로 js click none 박으면 될듯.
6. 홍엽에게 home.html에 mainPage 작업한거 리펙토링 요청하기

---
#### 비고
1. joinform,loginform input으로 마크업하기. 
2. loginpage 에서 joinPage로 가는거 ajax 비동기 방식으로 변경
3. loginPage에서  url 반환하는거 alert로 띄울수 있게 Param값으로 보내주세요.
4. @RequestMapping( method = RequestMethod.POST, consumes = {"application/x-www-form-urlencoded"}) 컨트롤러에 추가했음.

- [Form Login 필터](https://docs.spring.io/spring-security/reference/servlet/authentication/passwords/form.html)



----
### 9.15
#### 한거
1. 회원가입시 중복로직탓에 화면상 버벅이던 문제 해결.(무한 리다이랙트 아님)
2. joinPage 로드했을 때 카테고리 바로 뿌려줌.
3. joinForm 제출시 유저정보(+ role), 카테고리 정보 같이 담아감. user_img 빼고 다 담김.
#### 나중에 할 거

---
#### 비고 

- userService
  1. save 메서드 변경. void 타입이던거 UserDAO 타입으로 변경,
  2. 중복체크 코드 줄임. 로직에는 변화 없음.
- userController
  1. 나중에 requestMapping에 "/joinPage" 넣기. 우선 회원가입 관련된 매핑메서드들에 집어넣고, securityConfig에 "/joinPage/**" 허용
  2. 회원가입 메서드 모델엔뷰 ResponseEntity로 반환. 맵에 담아서 뿌림. 이거로 JoinPage에 카테고리 선택창 구현
  3. 위에 맞게 joinPage.js,joinForm.html 수정.
----







---

## 일지 

### 색감 편.

- 야식에 해당하는 음식 광고는 대체로 배경이 어둡더라. 반대로 점심 음식 광고들은 대체로 밝으며 선명함.


### ux 편.

- 인디케이터 :
- 버튼 : 
- 



----
---- 
---- 
---- 
---- 


##### 인디케이터
- 장점 : 영역 차지 비율 낮음!
- 정보를 명확하게 전달 가능함
- 단점 : 텍스트가 많은 배너에서는 사용 X


