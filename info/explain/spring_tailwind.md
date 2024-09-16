# java application에서 Tailwind CSS 사용하기 (Spring Boot + Thymeleaf + Tailwind CSS )

Java의 compile과 별도로 node로 대상 html, js의 변경에 대해 빌드해야 한다.
Spring Boot + Thymeleaf 기반 application은 다음 위치에서 html과 static resource (css, js)를 관리한다.



thymeleaf html : /src/main/resources/template
static resource (css, js) : /src/main/resources/static

Spring Boot와 Thymeleaf관련 프로젝트 설정은 이미 진행되었다고 가정하고 설명을 생략한다.(간단하게 만들고 싶은 경우 https://start.spring.io/


       을 이용하면 된다.)
node 빌드 대상 위치는 /src/main/frontend 로 정하고빌드한 결과물은 static resource 위치인 /src/main/resources/static 아래에 생성되도록 한다.
/src/main/frontend 에 package.json 을 만들고 기본적인 정보를 선언한다.


