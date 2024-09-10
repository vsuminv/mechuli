# ajax


##
- input type을 submit으로 하는 경우가 있는데 submit은 동기방식이라 비동기방식인ajax에서는 자바스크립트가 작동이 잘 안될 수 있으니 input type="button"으로 되어 있는지 확인 해보길 바란다.
- html의 form의 기본 Content-Type으로 는 key=value&key=value의 형태로 전달된다
- 키 벨류 형태로만 보내야함.
- 컨트롤러에서 RequestBody,ResponseBody 박혀있으면 ajax 무조건 키벨류로 해주거나, 아니면 컨트롤러에서 걍 두 어노테이션 지워서 써야댐

## 
[spring이 읽을 수 있는 타입](https://stackoverflow.com/questions/34782025/http-post-request-with-content-type-application-x-www-form-urlencoded-not-workin/38252762#38252762)
