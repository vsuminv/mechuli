# 정적 리소스 디렉토리 구조

├─templates
│
│    layout.html
│
├─component
│   
│    join.html
│    login.html
│
├─default
│
│    footer.html
│    head.html
│    header.html
│    index.html
│    main.html
├
│  layout.html


---

# 각 디렉토리 정의

## default/

default page인 index.html 파일이 베이스보드가 되어 아래 네가지 엘리먼트들로 이뤄져있다.


- head : cdn, link 등 외부 링크 관리
- header : 최상단에 위치함. 검색,네비게이션 들어갈 예정.
- main :  중간에 위치함. 주 컨텐츠가 들어가게 될 것.
- footer : 최하단에 위치함. 미정.


## component/

- join : join form
- login : login form