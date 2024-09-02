1. static 디렉토리에 node_modules 설치
2. tailwindcss 설치 및 적용
3. gradle node 빌드
4. 실행시 tailwindcss 자동 빌드하기


# 1. node_modules 설치
node와 npm이 깔려있지 않다면 node 사이트에서 다운 받습니다.
- https://nodejs.org/en

`cd src/main/resources/static`

npm init을 진행합니다.

`npm init -y`

package.json 파일이 생성됩니다.

---

# 2. tailwindCss 설치 및 적용

npm install 해줍니다.

`npm i -D tailwindcss@latest postcss@latest autoprefixer@latest postcss-cli`

설치가 완료 되면 package.json 파일에 아래 devDependencies가 추가 됩니다.



tailwindcss 설치합니다.

`npx tailwindcss init -p`


`tailwind.config.js` 에 templates(html 파일 위치)를 지정해줍니다.

```shell
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['../templates/**/*.html'],
  theme: {
    extend: {},
  },
  plugins: [],
}
```
static 디렉토리에 tailwind directive css파일을 추가해줍니다. 

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

tailwind CLI 빌드를 진행합니다.

-i 뒤에 directive css 파일(input)을 지정하고,

'-o' 뒤에 output css 파일을 지정해줍니다.


`npx tailwindcss -i ./tailwinds.css -o css/tailwind-out.css  `





# 3. Gradle로 node 빌드하기

tailwindcss 가 node 모듈로 설치했기 때문에 Spring boot 빌드시 npm build가 같이 진행되야 실행됩니다. 다행히 gradle build에 node를 빌드해주는 좋은 plugin이 있습니다.

```
plugins {
	...
    id("com.github.node-gradle.node") version "7.0.1"
}
...
node {
    download = true
    /**
     * node version
     */
    version = "20.16.0"

    /**
     * npm version
     */
    npmVersion = "10.8.3"
    nodeProjectDir = file("${projectDir}/src/main/resources/static")
}
```

---
- download : node 패키지를 설치할지 여부 입니다. true로 지정합니다.
- version : node 버전입니다. 터미널에서 node -v로 버전을 확인합니다.
- npmVersion : npm 버전입니다. npm -v로 버전을 확인하여 기입합니다.
- nodeProjectDir: node 프로젝트가 있는 위치입니다. node_modules가 있는 위치라고 보면됩니다. 이 프로젝트는 static에 설치했으므로 static 파일의 위치를 지정합니다.



