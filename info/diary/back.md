# 변경

## 컨트롤러 


```java
//    @PostMapping("/login")
//    public String login() {
//        return "redirect:/";
//    }
// 회원가입 전송 시 새 유저 생성하고 메인페이지로 redirect
//    @PostMapping("/join")
//    public String join(@Valid @RequestBody UserDTO userDto, BindingResult bindingResult) {
//        if (bindingResult.hasErrors()) {
//            return "/join";
//        }
//        userService.save(userDto);
//        return "redirect:/login";
////    }
```


```java
    @PostMapping("/join")
    public ResponseEntity<String> userJoin(UserDTO dto) {
        userService.save(dto);
        return ResponseEntity.ok("good");
    }
```

```java
@RequestMapping( method = RequestMethod.POST, consumes = {"application/x-www-form-urlencoded"})
```


http://localhost:8081/updateUpdate