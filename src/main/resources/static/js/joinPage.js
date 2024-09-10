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
            if (result === 0) {
                if (confirm("해당 닉네임은 사용 가능합니다. \n 사용하시겠습니까?")) {
                    nicknameOverlapCheck = 0;
                    $("#nickname").attr("readonly", true);
                    $("#nicknameOverlay").attr("disabled", true);
                    $("#nicknameOverlay").css("display", "none");
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
    if (userIdOverlapCheck === 1 && nicknameOverlapCheck === 0) {
        console.log("통과");
        return true;
    } else {
        alert("아이디, 닉네임 중복체크 미완료");
        return false;
    }
}