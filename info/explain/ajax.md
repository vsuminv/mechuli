# ajax


## 스프링이 읽을 수 있는 타입
- input type을 submit으로 하는 경우가 있는데 submit은 동기방식이라 비동기방식인ajax에서는 자바스크립트가 작동이 잘 안될 수 있으니 input type="button"으로 되어 있는지 확인 해보길 바란다.
- html의 form의 기본 Content-Type으로 는 key=value&key=value의 형태로 전달된다
- 키 벨류 형태로만 보내야함.
- 컨트롤러에서 RequestBody,ResponseBody 박혀있으면 ajax 무조건 키벨류로 해주거나, 아니면 컨트롤러에서 걍 두 어노테이션 지워서 써야댐



## dataType / contentType 차이

- dataType : 서버 -> Ajax로 전달되는 데이터 타입
- ContentType :  Ajax -> 서버로 전달되는 데이터 타입

### Content-Type이란
api연동할때 보내는 자원을 명시하기 위해서 사용.
HTTP 요청을 보낼 때 사용되는 헤더 중 하나로, 요청 본문의 데이터 타입을 지정하는 역할을 한다.
요청에 포함된 데이터가 어떤 형식으로 인코딩되었는지 서버에게 알려주는 역할을 한다.
이는 서버가 요청을 올바르게 처리하고 데이터를 파싱하는 데 도움을 준다.
MessageBody에 들어가는 타입을 HTTP Header에 명시해주는 필드이다.

### application/x-www-form-urlencoded
웹 양식 데이터를 인코딩하는데 사용되는 기본 데이터 유형!
주로 HTML 폼 요소에서 사용자로부터 입력된 데이터를 서버로 전송하는데 사용하며 API요청에서도 사용된다.

형식 : 데이터의 각 키-값 쌍을 '&'기호로 구분하고, 각 키와 값은 '='기호로 연결하여 인코딩한다.
데이터 표현 : 단순 키-값 쌍 데이터를 표현하는데 적합하다. 부족한 구조의 데이터를 표현하기 어렵다.
인코딩 형식이 단순하여 구현이 간단하고, 브라우저에서 웹 폼을 통해 쉽게 전송 가능. 중첩 데이터 구조표현이 어려우며 특히 JSON표현에는 적합하지 않다.

### application/json
데이터 교환 형식으로 많이 사용된다. 서버와 클라이언트 간에 구조화된 데이터를 교환하는데 사용한다. 웹 어플리케이션과 API에서 데이터를 전송하고 수신하는데 자주 사용된다.

형식 : JSON형식으로 데이터를 표현. 키-값 쌍을 중괄호{}로 둘러싸고, 각 키와 값은 콜론:으로 연결. 각 데이터 항목은 쉼표로 구분.
데이터 표현 : 복잡한 데이터 구조를 효과적으로 표현. 중첩된 객체와 배열을 포함하여 다양한 데이터 구조를 지원한다.
데이터 구조의 유연성과 표현력이 뛰어남. 데이터 크기가 커질 수 있으며, 인코딩과 디코딩에 비용발생 가능성 있음.

### 
application/x-www-form-urlencoded 는 간단한 폼 데이터를 전송하는 데 유용
application/json 은 구조화된 데이터를 교환하는 데 적합


## 
[spring이 읽을 수 있는 타입](https://stackoverflow.com/questions/34782025/http-post-request-with-content-type-application-x-www-form-urlencoded-not-workin/38252762#38252762)
[ajax 스프링 통신 값의 타입](https://velog.io/@nayoung188/SPRING-x-www-form-urlencoded%EC%99%80-applicationjson)
