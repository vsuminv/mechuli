let joinForm = {
    userIdCheck: 3,
    nickNameCheck: 3,

    ERROR_MESSAGE: {
        id_length: "아이디는 4자 이상 입력해주세요.",
        nickname_length: "닉네임은 2자 이상 입력해주세요.",
        duplicate_check: "아이디와 닉네임 중복 체크를 완료해주세요.",
        category_select: "관심 카테고리를 3개 이상 선택해주세요."
    },

    init: function() {
        // 중복 체크 버튼
        $("#userid_check").click(() => this.userCheck('userId'));
        $("#nickname_check").click(() => this.userCheck('nickname'));

        // 리셋 버튼
        $("#resetUserId").click(() => this.resetField('userId'));
        $("#resetNickname").click(() => this.resetField('nickname'));

        // 다음/이전 버튼
        $("#next_btn").click(() => this.nextStep());
        $("#back_btn").click(() => this.backStep());

        // 폼 제출
        $("#joinForm").submit((event) => this.submitForm(event));

        // 실시간 유효성 검사
        $('#userId').on('input', () => this.validateField('userId'));
        $('#userPw').on('input', () => this.validateField('userPw'));
        $('#userPw2').on('input', () => this.validateField('userPw2'));
        $('#nickname').on('input', () => this.validateField('nickname'));
    },

    userCheck: function(type) {
        const field = type === 'user_data' ? 'userId' : 'nickname';
        const value = $(`#${field}`).val();

        if (type === 'nickname' && value.length < 2) {
            alert(this.ERROR_MESSAGE.nickname_length);
            return;
        }

        $.ajax({
            type: "POST",
            url: type === 'user_data' ? "/ajaxCheckId" : "/ajaxCheckNickname",
            data: { [field]: value },
            success: (response) => {
                if (response === 0) {
                    alert(`사용 가능한 ${type === 'user_data' ? '아이디' : '닉네임'}입니다.`);
                    this[`${type}Check`] = 0;
                    $(`#${field}`).attr("readonly", true);
                    $(`#${field}_check`).attr("disabled", true);
                    $(`#reset${field.charAt(0).toUpperCase() + field.slice(1)}`).attr("disabled", false);
                } else if (response === 1) {
                    alert(`이미 사용 중인 ${type === 'user_data' ? '아이디' : '닉네임'}입니다.`);
                    this[`${type}Check`] = 1;
                }
                this.updateValidationUI(field, response === 0);
            },
            error: (xhr, status, error) => {
                console.log(error);
            }
        });
    },

    resetField: function(field) {
        $(`#${field}`).attr("readonly", false).val("");
        $(`#${field}_check`).attr("disabled", false);
        $(`#reset${field.charAt(0).toUpperCase() + field.slice(1)}`).attr("disabled", true);
        this[`${field}Check`] = 3;
        this.updateValidationUI(field, false);
    },

    nextStep: function() {
        if (this.userIdCheck === 0 && this.nickNameCheck === 0) {
            $("#step1").fadeOut();
            $("#step2").fadeIn();
            $("#step-indicator").text("2 / 2");
        } else {
            alert(this.ERROR_MESSAGE.duplicate_check);
        }
    },

    backStep: function() {
        $("#step2").fadeOut();
        $("#step1").fadeIn();
        $("#step-indicator").text("1 / 2");
    },

    // submitForm: function(event) {
    //     if (this.userIdCheck !== 0 || this.nickNameCheck !== 0) {
    //         alert(this.ERROR_MESSAGE.category_select);
    //         event.preventDefault();
    //         return;
    //     }
    //
    //     if (!this.validateAllFields()) {
    //         alert("모든 필드를 올바르게 입력해주세요.");
    //         event.preventDefault();
    //         return;
    //     }
    // },

    validateField: function(fieldId) {
        const value = $(`#${fieldId}`).val();
        let isValid = false;

        switch(fieldId) {
            case 'userId':
                isValid = value.length >= 4;
                break;
            case 'userPw':
                isValid = value.length >= 6;
                this.validateField('userPw2');
                break;
            case 'userPw2':
                isValid = value === $('#userPw').val() && value.length >= 6;
                break;
            case 'nickname':
                isValid = value.length >= 2;
                break;
        }

        this.updateValidationUI(fieldId, isValid);
        return isValid;
    },
    validateAllFields: function() {
        return this.validateField('userId') &&
            this.validateField('userPw') &&
            this.validateField('userPw2') &&
            this.validateField('nickname');
    },


    updateValidationUI: function(fieldId, isValid) {
        const inputGroup = $(`#${fieldId}`).closest('.input-group');
        inputGroup.removeClass('valid invalid');
        inputGroup.addClass(isValid ? 'valid' : 'invalid');
    }
};

$(document).ready(() => {
    joinForm.init();
});