function userIdCheck() {
    const userId = $(`#userId`).val();
    if (userId === "") {
        alert("아이디를 정확히 입력해주세요.");
        console.log("들어온값" + userId);
        $("#userId").focus();
        return false;
    }
    $.ajax({
        url: "/ajaxCheckId",
        type: "POST",
        data: userId,
        contentType: "text/plain",
        success: function (result) {
            console.log(result);
            if (result === 0) {
                if (confirm("해당 아이디는 사용 가능합니다. \n 사용하시겠습니까?")) {
                    userIdOverlapCheck = 1;
                    $("#userId").attr("readonly", true);
                    $("#userid_check").attr("disabled", true);
                    $("#userid_check").css("display", "none");
                    $("#resetUserId").attr("disabled", false);
                    $("#resetUserId").css("display", "inline-block");
                }
            } else if (result === 1) {
                alert("이미 사용중인 아이디입니다.");
                $("#userId").focus();
            } else {
                alert("result 값 못찾음");
            }
        },
        error: function (request, status, error) {
            alert("요청값" + request + "상태:" + request.status + "\n" + "에러" + error);
        }
    });
}

function nickNameCheck() {
    const nickname = $(`#nickname`).val();
    if (nickname === "") {
        alert("닉네임을 정확히 입력해주세요.");
        $("#nickname").focus();
        return false;
    }
    $.ajax({
        type: "POST",
        url: "/ajaxCheckNickname",
        data: nickname,
        contentType: "text/plain",
        success: function (result) {
            console.log(result);
            if (result === 0) {
                if (confirm("해당 닉네임은 사용 가능합니다. \n 사용하시겠습니까?")) {
                    nicknameOverlapCheck = 1;
                    $("#nickname").attr("readonly", true);
                    $("#nickname_check").attr("disabled", true);
                    $("#nickname_check").css("display", "none");
                    $("#resetNickname").attr("disabled", false);
                    $("#resetNickname").css("display", "inline-block");
                }
            } else if (result === 1) {
                alert("이미 사용중인 닉넴입니다.");
                $("#nickname").focus();
            } else {
                alert("result 값 못찾음");
            }
        },
        error: function (request, status, error) {
            alert("요청값" + request + "상태:" + request.status + "\n" + "에러" + error);
        }
    });
}

function checkAll() {
    if (userIdOverlapCheck === 1 && nicknameOverlapCheck === 1) {
        console.log("통과");
        return true;
    } else {
        alert("아이디, 닉네임 중복체크 미완료");
        return false;
    }
}

function join(){
    // if (!checkAll()) {
    //     return false;
    // }
    let userId = $('#userId').val();
    let userPw = $('#userPw').val();
    let userPw2 = $('#userPw2').val();
    let nickname = $('#nickname').val();


    // if (pw !== pw2) {
    //     alert("비밀번호가 일치하지 않습니다.");
    //     $('#pw2').focus();
    //     return false;
    // }

    const userData = {
        userId :  $('#userId').val(),
        userPw : $('#userPw').val(),
        userPw2 : $('#userPw2').val(),
        nickname : $('#nickname').val(),
    };
    $.ajax({
        url: "/join",
        type: "POST",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(userData),
        success: function(response) {
            if (response === "success") {
                alert("join 됨.");
                window.location.href = "/login"; // 로그인 페이지로 이동
                console.log(userData);
            } else {
                alert("join fail");
            }
        },
        error: function(xhr, status, error) {
            alert("failfailfailfailfail");
            console.log(userData);
            console.error("Error: " + status + " " + error);
        }
    });
}