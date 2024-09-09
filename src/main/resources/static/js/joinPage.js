function getCsrfToken() {
    let name = 'XSRF-TOKEN=';
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    console.log(decodedCookie);
    console.log("decodedCookie");
    for(let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === '') {
            c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "84809cbb-8fa8-4f10-a6af-fe56b1df9fde";
}


function userIdCheck() {
    // let csrfToken = $('meta[name="csrf-token"]').attr('content');
    // let userIdValue = $('userId').attr('value');
    let userIdValue = 'hihihi';

    $.ajaxSetup({

        headers: {
            'X-CSRF-TOKEN': '84809cbb-8fa8-4f10-a6af-fe56b1df9fde'
        }
    })

    $.ajax({
        url: '/ajaxCheckId',
        type: 'POST',
        // headers: {
        //     'X-CSRF-TOKEN': csrfToken
        // },
        data: {
            userIdValue
        },
        success: function(response) {
            console.log(response);
        },
        error: function(xhr, status, error) {
            console.log(xhr.responseText);
        }
    })
}
// $(document).ready(function() {
//     // AJAX 요청을 보낼 때 CSRF 토큰을 헤더에 추가하기
//     $.ajaxSetup({
//         headers: {
//             'X-XSRF-TOKEN': getCsrfToken()
//         }
//     });
//
//     $.ajax({
//         url: "/ajaxCheckId",
//         type: 'POST',
//         data: {userId
//             // your data
//         },
//         success: function(response) { console.log(result);
//             // Handle success
//         },
//         error: function(jqXHR, textStatus, errorThrown) {
//             console.log(jqXHR,textStatus);
//             // Handle error
//         }
//     });
// });




// function userIdCheck() {
//     const userId = $("#userId").val();
//     // if (userId === "") {
//     //     alert("아이디를 정확히 입력해주세요.");
//     //     console.log("들어온값"+userId)
//     //     $("#userId").focus();
//     //     return false;
//     // }
//     $.ajax({
//         type: "POST",
//         url: "/ajaxCheckId",
//         data: userId,
//         contentType: "text/plain",
//
//
//         success: function (result) {
//             console.log(result);
//
//             // if (result.idCheckResult === "0") {
//             //
//             //     if (confirm("해당 아이디는 사용 가능합니다. \n 사용하시겠습니까?")) {
//             //         userIdOverlapCheck = 1;
//             //         $("#userId").attr("readonly", true);
//             //         $("#userIdOverlay").attr("disabled", true);
//             //         $("#userIdOverlay").css("display", "none");
//             //         $("#resetUserId").attr("disabled", false);
//             //         $("#resetUserId").css("display", "inline-block");
//             //     }
//             //     return false;
//             // } else if (resp === "1") {
//             //     alert("이미 사용중인 아이디입니다.");
//             //     $("#userId").focus();
//             // } else {
//             //     alert("result 값 못찾음")
//             // }
//         },
//         error: function (request, status, error) {
//
//             alert("요청값" + request + "상태:" + request.status + "\n" + "에러" + error);
//         }
//     })
// }


//
//
// let() {
// }post = {
//     //UserController : requestBody로 들옴.
//     init: function () {
//         $("#userid_check").on("click", () => {
//             this.userIdCheck();
//         });
//         $("#nicname_check").on("click", () => {
//             this.nickNameCheck();
//         });
//         $("#next_btn").on("click", () => {
//             this.nextBtn();
//         });
//         // $("#join").on("click", () => {
//         //     this.join();
//         // });
//     },
//     userIdCheck : function () {
//         const userId = $("#userId").val();
//         // if (userId === "") {
//         //     alert("아이디를 정확히 입력해주세요.");
//         //     console.log("들어온값"+userId)
//         //     $("#userId").focus();
//         //     return false;
//         // }
//         console.log(result);
//         $.ajax({
//             type: "POST",
//             url: "/ajaxCheckId",
//             data: userId,
//             contentType: "text/plain",
//
//
//
//             success: function (result) {
//                 console.log(result);
//
//                 // if (result.idCheckResult === "0") {
//                 //
//                 //     if (confirm("해당 아이디는 사용 가능합니다. \n 사용하시겠습니까?")) {
//                 //         userIdOverlapCheck = 1;
//                 //         $("#userId").attr("readonly", true);
//                 //         $("#userIdOverlay").attr("disabled", true);
//                 //         $("#userIdOverlay").css("display", "none");
//                 //         $("#resetUserId").attr("disabled", false);
//                 //         $("#resetUserId").css("display", "inline-block");
//                 //     }
//                 //     return false;
//                 // } else if (resp === "1") {
//                 //     alert("이미 사용중인 아이디입니다.");
//                 //     $("#userId").focus();
//                 // } else {
//                 //     alert("result 값 못찾음")
//                 // }
//             },
//             error: function (request, status, error) {
//
//                 alert("요청값" + request + "상태:" + request.status + "\n" + "에러" + error);
//             }
//         });
//     },
//
//     nickNameCheck: function () {
//         const nickname = $("#nickname").val();
//         if (nickname === "") {
//             alert("아이디를 정확히 입력해주세요.");
//             $("#nickname").focus();
//             return false;
//         }
//         $.ajax({
//             type: "POST",
//             url: "/ajaxCheckNickname",
//             data: nickname,
//             contentType: "text/plain",
//
//             success: function (result) {
//                 if (result.result === "0") {
//                     if (confirm("해당 닉네임은 사용 가능합니다. \n 사용하시겠습니까?")) {
//                         nicknameOverlapCheck = 0;
//                         $("#nickname").attr("readonly", true);
//                         $("#nicknameOverlay").attr("disabled", true);
//                         $("#nicknameOverlay").css("display", "none");
//                         $("#resetNickname").attr("disabled", false);
//                         $("#resetNickname").css("display", "inline-block");
//                     }
//                     return false;
//                 } else if (resp === "1") {
//                     alert("이미 사용중인 닉넴입니다.");
//                     $("#nickname").focus();
//                 } else {
//                     alert("result 값 못찾음")
//                 }
//             },
//             error: function (request, status, error) {
//                 alert("요청값" + request + "상태:" + request.status + "\n" + "에러" + error);
//             }
//         });
//     },
//
//     nextBtn: function () {
//         if (post.userIdCheck === 0 && post.nicnameCheck === 0) {
//             console.log("통과");
//             $("#joinFormContainer").html(
//                 `<div th:replace="~{contents/join/joinForm2 :: joinForm2}"></div>`
//             );
//         } else {
//             alert("아이디, 닉네임 중복체크 미완료");
//             return false;
//         }
//     },
//
//
// }
//
// post.init();