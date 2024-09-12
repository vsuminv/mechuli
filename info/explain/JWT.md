# JWT


## JWT 토큰을 생성하는 빌더

JWT.create()

- .withSubject(ACCESS_TOKEN_SUBJECT) 
    빌더를 통해 JWT의 Subject를 정합니다. AccessToken이므로 위에서 설정했던 
    AccessToken의 subject를 합니다.

- .withExpiresAt(new Date(System.currentTimeMillis() + accessTokenValidityInSeconds * 1000))
만료시간을 설정하는 것입니다. 현재 시간 + 저희가 설정한 시간(밀리초) * 1000을 하면
현재 accessTokenValidityInSeconds이 80이기 때문에
현재시간에 80 * 1000 밀리초를 더한 '현재시간 + 80초'가 설정이 되고
따라서 80초 이후에 이 토큰은 만료됩니다.

- .withClaim(USERNAME_CLAIM, email)
  클레임으로는 email 하나만 사용합니다.
  추가적으로 식별자나, 이름 등의 정보를 더 추가가능합니다.
  추가하는 경우 .withClaim(클래임 이름, 클래임 값) 으로 설정합니다.

- .sign(Algorithm.HMAC512(secret));
  HMAC512 알고리즘을 사용하여, 저희가 지정한 secret 키로 암호화 합니다.

## 토큰에서 유저 정보 추출하기

```java
  JWT.require(Algorithm.HMAC512(secret))
//토큰의 서명의 유효성을 검사하는데 사용할 알고리즘이 있는
//JWT verifier builder를 반환합니다

    .build()//반환된 빌더로 JWT verifier를 생성합니다
    
    .verify(accessToken)//accessToken을 검증하고 유효하지 않다면 예외를 발생시킵니다.
    .getClaim(USERNAME_CLAIM)//claim을 가져옵니다
    .asString();
```

## LoginSuccessJWTProvideHandler
로그인이 성공했을때의 동작을 관리하는 LoginSuccessJWTProvideHandler
로그인 성공시 JWT 토큰 발급하게 할 때 씀

