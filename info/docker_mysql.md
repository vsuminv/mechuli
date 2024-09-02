# 1. Docker 설치

Docker 홈페이지에 접속하여 자신의 OS에 맞는 Docker를 내려 받아 설치한다.

설치가 완료되면 다음 명령어를 실행하여 버전을 출력해 보자.


`docker -v`


`Docker version 27.1.1`



# 2. MySQL Docker 이미지 다운로드

`docker pull mysql`

다운받은 이미지 확인 :
`docker images`

# 3. MySQL Docker 컨테이너 생성.

`docker run --name mysql-container -e MYSQL_ROOT_PASSWORD=비번 -d -p 3306:3306 mysql:latest`

- `--name` 컨테이너 명
- `-e`: 환경변수 (PASSWORD) 설정
- `-d`: Dispatch mode (백그라운드에서 실행)
- `-p`: 포트 (외부포트 : Docker 내부포트)
- `mysql`: sql 버전

`docker run --name mysql-container -e MYSQL_ROOT_PASSWORD=sa -d -p 3306:3306 mysql:latest`

# 4. 생성된 컨테이너 확인.
`docker ps`

```shell
CONTAINER ID IMAGE      COMMAND                  CREATED         STATUS         PORTS                               NAMES
f95ad85c7e02 mysql:5.7  "docker-entrypoint.s…"   27 seconds ago  Up 26 seconds  0.0.0.0:3306->3306/tcp, 33060/tcp   mysql-container
```
- `ps`: 실행중인 컨테이너 리스트 보기
- `ps -a`: 모든 컨테이너 리스트 보기

---



# 5. 컨테이너 시작/종료/재시작

- 컨테이너 시작

`docker start mysql-container // "mysql-container" 대신 ID 로도 실행 가능`


- 컨테이너 종료

` docker stop mysql-container`


- 컨테이너 재시작

` docker restart mysql-container`



# 6. MySQL 컨테이너 bash 쉘 접속

`docker exec -it mysql-container bash`

- `-it` : Interactive Terminal Mode

# 7. Locale 설정

locale 정보 확인.

`locale -a`

locale 한국어 설정

`docker exec -it -e LC_ALL=C.UTF-8 mysql-container bash`



# 8. MySQL 서버 접속.

관리자로 서버에 접속하기

`mysql -u root -p`


# 9. MySQL 데이터베이스에 사용자 생성 및 권한 부여

사용자 생성

`create user 'test'@'localhost' identified by 'password';`

생성한 유저에게 모든 DB 및 테이블 접근 권한 부여

`grant all privileges on *.* to 'test'@'localhost';`

설정한 권한 적용

`flush privileges;`


        : 컨테이너 외부에서 MySQL에 로그인이 필요할 시, localhost 대신 %를 입력한다.


---


# 10. 테이블 생성

