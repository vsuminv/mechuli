const ERROR_MESSAGE = {
    null_user_id: "아이디를 입력해주세요.",
    null_nickname: "닉네임을 입력해주세요.",
    used_user_id: "이미 사용중인 아이디입니다.",
    used_nickname: "이미 사용중인 닉네임입니다.",
    unknown_error: "알 수 없는 오류가 발생했습니다.",
    missmatch_userPw: "비밀번호가 일치하지 않습니다.",
    all_check: "아이디와 닉네임 중복체크를 완료해주세요."
};

const JOIN_AJAX = {
    ajaxCheckId: "/ajaxCheckId",
    ajaxCheckNickname: "/ajaxCheckNickname",
    join: "/join"
};

let ajaxCheckId = 0;
let ajaxCheckNickname = 0;

function switchStep(showStep, hideStep) {
    $(`#${showStep}`).show();
    $(`#${hideStep}`).hide();
    $(`#step-indicator-${showStep.slice(-1)}`).show();
    $(`#step-indicator-${hideStep.slice(-1)}`).hide();
}

function resetField(type) {
    const id = type === 'id' ? 'userId' : 'nickname';
    $(`#${id}`).attr("readonly", false).val("").focus();
    $(`#${id}_check`).prop("disabled", false);
    $(`#reset${id.charAt(0).toUpperCase() + id.slice(1)}`).prop("disabled", true);
    type === 'id' ? ajaxCheckId = 0 : ajaxCheckNickname = 0;
}

function checkDuplicate(type) {
    const id = type === 'id' ? 'userId' : 'nickname';
    const value = $(`#${id}`).val().trim();
    if (!value) {
        alert(ERROR_MESSAGE[`null_${type}`]);
        return;
    }

    $.ajax({
        url: JOIN_AJAX[`ajaxCheck${type.charAt(0).toUpperCase() + type.slice(1)}`],
        type: "POST",
        contentType: "application/x-www-form-urlencoded",
        data: value,
        success: function(result) {
            if (result === 0) {
                alert("사용 가능합니다.");
                $(`#${id}`).attr("readonly", true);
                $(`#${id}_check`).prop("disabled", true);
                $(`#reset${id.charAt(0).toUpperCase() + id.slice(1)}`).prop("disabled", false);
                type === 'id' ? ajaxCheckId = 1 : ajaxCheckNickname = 1;
            } else {
                alert(ERROR_MESSAGE[`used_${type}`]);
            }
        },
        error: function() {
            alert(ERROR_MESSAGE.unknown_error);
        }
    });
}

function checkAll() {
    if (ajaxCheckId === 0 || ajaxCheckNickname === 0) {
        alert(ERROR_MESSAGE.all_check);
        return false;
    }
    if ($('#userPw').val() !== $('#userPw2').val()) {
        alert(ERROR_MESSAGE.missmatch_userPw);
        return false;
    }
    return true;
}

function join(e) {
    e.preventDefault();
    if (!checkAll()) return false;

    $.ajax({
        url: JOIN_AJAX.join,
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify({
            userId: $('#userId').val(),
            userPw: $('#userPw').val(),
            nickname: $('#nickname').val()
        }),
        success: function() {
            alert("회원가입이 완료되었습니다.");
            window.location.href = "/login";
        },
        error: function(xhr) {
            alert("회원가입 중 오류가 발생했습니다: " + xhr.responseText);
        }
    });
    return false;
}

$(document).ready(function() {
    $('#joinForm').submit(join);
    $('#next_btn').click(() => switchStep('step2', 'step1'));
    $('#back_btn').click(() => switchStep('step1', 'step2'));
    $('#userid_check').click(() => checkDuplicate('id'));
    $('#nickname_check').click(() => checkDuplicate('nickname'));
    $('#resetUserId').click(() => resetField('id'));
    $('#resetNickname').click(() => resetField('nickname'));
});