var userIdOverlapCheck = 3;
var nicknameOverlapCheck = 3;

$(document).ready(function () {
    // 아이디 중복 체크
    $("#userid_check").click(function () {
        var userId = $("#userId").val();
        // if (userId.length < 4) {
        //     alert("아이디는 4자 이상 입력해주세요.");
        //     return;
        // }

        $.ajax({
            type: "POST",
            url: "/ajaxCheckId",
            data: { userId: userId },
            success: function (response) {
                if (response === 0) {
                    alert("사용 가능한 아이디입니다.");
                    userIdOverlapCheck = 0;
                    $("#userId").attr("readonly", true);
                    $("#userid_check").attr("disabled", true);
                    $("#resetUserId").attr("disabled", false);
                } else if (response === 1) {
                    alert("이미 사용 중인 아이디입니다.");
                    userIdOverlapCheck = 1;
                }
            },
            error: function (xhr, status, error) {
                console.log(error);
            }
        });
    });
    // 아이디 다시 입력
    $("#resetUserId").click(function () {
        $("#userId").attr("readonly", false).val("");
        $("#userid_check").attr("disabled", false);
        $("#resetUserId").attr("disabled", true);
        userIdOverlapCheck = 3;
    });

    // 닉네임 중복 체크
    $("#nickname_check").click(function () {
        var nickname = $("#nickname").val();
        if (nickname.length < 2) {
            alert("닉네임은 2자 이상 입력해주세요.");
            return;
        }

        $.ajax({
            type: "POST",
            url: "/ajaxCheckNickname",
            data: { nickname: nickname },
            success: function (response) {
                if (response === 0) {
                    alert("사용 가능한 닉네임입니다.");
                    nicknameOverlapCheck = 0;
                    $("#nickname").attr("readonly", true);
                    $("#nickname_check").attr("disabled", true);
                    $("#resetNickname").attr("disabled", false);
                } else if (response === 1) {
                    alert("이미 사용 중인 닉네임입니다.");
                    nicknameOverlapCheck = 1;
                }
            },
            error: function (xhr, status, error) {
                console.log(error);
            }
        });
    });
    // 닉네임 다시 입력
    $("#resetNickname").click(function () {
        $("#nickname").attr("readonly", false).val("");
        $("#nickname_check").attr("disabled", false);
        $("#resetNickname").attr("disabled", true);
        nicknameOverlapCheck = 3;
    });

    // 다음 버튼 클릭 시
    $("#next_btn").click(function () {
        if (userIdOverlapCheck === 0 && nicknameOverlapCheck === 0) {
            $("#step1").hide();
            $("#step2").show();
            $("#step-indicator").text("2 / 2");
        } else {
            alert("아이디와 닉네임 중복 체크를 완료해주세요.");
        }
    });

    // 이전 버튼 클릭 시
    $("#back_btn").click(function () {
        $("#step2").hide();
        $("#step1").show();
        $("#step-indicator").text("1 / 2");
    });

    // 폼 제출 시
    $("#joinForm").submit(function (event) {
        if (userIdOverlapCheck !== 0 || nicknameOverlapCheck !== 0) {
            alert("아이디와 닉네임 중복 체크를 완료해주세요.");
            event.preventDefault();
        }
    });
});
