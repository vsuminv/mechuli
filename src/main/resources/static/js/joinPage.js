let post= {
    //UserController : requestBody로 들옴.
    userIdCheck: "1",
    nicnameCheck: "1",

    init : function () {
        $("#userid_check").on("click", () => {
            this.userIdCheck();
        });
        $("#nicname_check").on("click", () => {
            this.nickNameCheck();
        });
        $("#next_btn").on("click", () => {
            this.nextBtn();
        });
        $("#join").on("click", () => {
            this.join();
        });
    },

    userIdCheck : function () {
        const userId = $("#userId").val();
        if (userId === "") {
            alert("아이디를 정확히 입력해주세요.");
            $("#userId").focus();
            return false;
        }
        $.ajax({
            type: "POST",
            url: "/ajaxCheckId",
            data: userId, // 일단 String 으로 함.
            contentType: "text/plain",
            // dataType: "json",

            success: function (resp) {
                if (resp === "0") {
                    if (confirm("해당 아이디는 사용 가능합니다. \n 사용하시겠습니까?")) {
                        userIdCheck = 0;
                        $("#userId").attr("readonly", true);
                        $("#userIdOverlay").attr("disabled", true);
                        $("#userIdOverlay").css("display", "none");
                        $("#resetUserId").attr("disabled", false);
                        $("#resetUserId").css("display", "inline-block");
                    }
                    return false;
                    }else if (resp === "1") {
                    alert("이미 사용중인 아이디입니다.");
                    $("#userId").focus();
                }else {
                    alert("result 값 못찾음")
                }
            },
            error: function (request, status, error) {
                alert("요청값"+request+"상태:"+request.status+"\n"+"에러"+error);
            }
        });
    },

    nickNameCheck : function () {
        const nickname = $("#nickname").val();
        if (nickname === "") {
            alert("아이디를 정확히 입력해주세요.");
            $("#nickname").focus();
            return false;
        }
        $.ajax({
            type: "POST",
            url: "/ajaxCheckNickname",
            data: nickname, // 얘도 일단 String
            contentType: "text/plain",
            // dataType: "json",

            success: function (resp) {
                if (resp === "0") {
                    if (confirm("해당 닉네임은 사용 가능합니다. \n 사용하시겠습니까?")) {
                        nicnameCheck = 0;
                        $("#nicname").attr("readonly", true);
                        $("#nicnameOverlay").attr("disabled", true);
                        $("#nicnameOverlay").css("display", "none");
                        $("#resetNicname").attr("disabled", false);
                        $("#resetNicname").css("display", "inline-block");
                    }
                    return false;
                }else if (resp === "1") {
                    alert("이미 사용중인 닉넴입니다.");
                    $("#nicname").focus();
                }else {
                    alert("result 값 못찾음")
                }
            },
            error: function (request, status, error) {
                alert("요청값"+request+"상태:"+request.status+"\n"+"에러"+error);
            }
        });
    },

    nextBtn: function () {
        if (post.userIdCheck === 0 && post.nicnameCheck === 0) {
            console.log("통과");
            $("#joinFormContainer").html(
                `<div th:replace="~{contents/join/joinForm2 :: joinForm2}"></div>`
            );
        } else {
            alert("아이디, 닉네임 중복체크 미완료");
            return false;
        }
    },
    join : function () {

    }

}

post.init();