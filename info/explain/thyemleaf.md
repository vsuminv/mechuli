# Spring Security + Thymeleaf 기능

---
```html
<!-- 인증되지 않은(로그인하지 않은) 사용자에게 보임 -->
<button sec:authorize="isAnonymous()" type="button" onclick="location.href='/admin/loginView'">로그인</button>
<!-- 인증된(로그인한) 사용자에게 보임 -->
<button sec:authorize="isAuthenticated()" type="button" onclick="location.href='/admin/logout'">로그아웃</button>

<!-- ROLE_ADMIN 권한을 가지고 있다면 보임 -->
<div sec:authorize="hasRole('ADMIN')">ROLE_ADMIN 권한이 있습니다.</div>
<!-- ROLE_SUB_ADMIN 권한을 가지고 있다면 보임 -->
<div sec:authorize="hasRole('SUB_ADMIN')">ROLE_SUB_ADMIN 권한이 있습니다.</div>
<!-- ROLE_USER 권한을 가지고 있다면 보임 -->
<div sec:authorize="hasRole('USER')">ROLE_USER 권한이 있습니다.</div>
<!-- ROLE_ADMIN 혹은 ROLE_SUB_ADMIN 권한을 가지고 있다면 보임 -->
<div sec:authorize="hasAnyRole('ADMIN, SUB_ADMIN')">ROLE_ADMIN 혹은 ROLE_SUB_ADMIN 권한이 있습니다.</div>

<br/>
<!--인증시 사용된 객체에 대한 정보-->
<b>Authenticated DTO:</b>
<div sec:authorize="isAuthenticated()" sec:authentication="principal"></div>

<br/>
<!--인증시 사용된 객체의 Username (ID)-->
<b>Authenticated username:</b>
<div sec:authorize="isAuthenticated()" sec:authentication="name"></div>

<br/>
<!--객체의 권한-->
<b>Authenticated admin role:</b>
<div sec:authorize="isAuthenticated()" sec:authentication="principal.authorities"></div>
```

## button th:onclick으로 페이지 이동

- `<input type="button" th:onclick="|location.href='@{join}'|" value="회원가입" id="join">`
- `<input type="button" th:onclick="|location.href='@{/}'|">` 인덱스 첫 페이지 이동.
- `<input type="button" th:onclick="|location.href='@{이동할 url}'|"> `





