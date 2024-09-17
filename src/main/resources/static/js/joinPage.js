// const JoinPage = {
//     init() {
//         this.joinPage();
//         this.joinEvents();
//         this.updateNextButton();
//     },
//
//     joinPage() {
//         this.userIdChecked = false;
//         this.nicknameChecked = false;
//         this.selectedCategories = [];
//         this.currentStep = 1;
//
//         this.$userId = $("#userId");
//         this.$userPw = $("#userPw");
//         this.$userPw2 = $("#userPw2");
//         this.$nickname = $("#nickname");
//         this.$nextBtn = $("#next_btn");
//         this.$backBtn = $("#back_btn");
//         this.$stepIndicator = $("#step-indicator .m-auto");
//         this.$nextButtonMessage = $("#nextButtonMessage");
//         this.$selectedCategory = $("#selected_category");
//         this.$hiddenInputs = $("#hidden_category_inputs");
//         this.$joinForm = $("#joinForm");
//     },
//
//     joinEvents() {
//         $('#userId_check').click(() => this.checkDuplicate('userId'));
//         $('#nickname_check').click(() => this.checkDuplicate('nickname'));
//
//         this.$userId.on('input', this.onInputChange.bind(this));
//         this.$nickname.on('input', this.onInputChange.bind(this));
//         this.$userPw.on('input', this.updateNextButton.bind(this));
//         this.$userPw2.on('input', this.updateNextButton.bind(this));
//
//         this.$backBtn.click(this.onBackBtnClick.bind(this));
//         this.$nextBtn.click(this.onNextBtnClick.bind(this));
//
//         $(".category-btn").click(this.onCategoryBtnClick.bind(this));
//         this.$joinForm.submit(this.onJoinFormSubmit.bind(this));
//     },
//
//     updateNextButton() {
//         const allFieldsFilled = this.$userId.val() && this.$userPw.val() && this.$userPw2.val() && this.$nickname.val();
//         const passwordMatch = this.$userPw.val() === this.$userPw2.val();
//         const isValid = this.userIdChecked && this.nicknameChecked && allFieldsFilled && passwordMatch;
//
//         this.$nextBtn.prop("disabled", !isValid);
//     },
//
//     validateForm() {
//         const allFieldCheck = this.$userId.val() && this.$userPw.val() && this.$userPw2.val() && this.$nickname.val();
//         const userPwMatch = this.$userPw.val() === this.$userPw2.val();
//
//         let errorMessages = [];
//         if (!allFieldCheck) errorMessages.push("모든 필드를 입력해주세요.");
//         if (!userPwMatch) errorMessages.push("비밀번호가 일치하지 않습니다.");
//         if (!this.userIdChecked) errorMessages.push("아이디 중복 체크를 완료해주세요.");
//         if (!this.nicknameChecked) errorMessages.push("닉네임 중복 체크를 완료해주세요.");
//
//         return errorMessages;
//     },
//
//     checkDuplicate(type) {
//         const value = $(`#${type}`).val();
//         if (!value) {
//             this.updateValidationState(type, false, `${type === 'userId' ? '아이디' : '닉네임'}를 입력해주세요.`);
//             return;
//         }
//
//         $.post(type === 'userId' ? url_ajaxCheckId : url_ajaxCheckNickname, { value: value }, (response) => {
//             if (response === 0) {
//                 this.updateValidationState(type, true, `사용 가능한 ${type === 'userId' ? '아이디' : '닉네임'}입니다.`);
//                 type === 'userId' ? this.userIdChecked = true : this.nicknameChecked = true;
//             } else {
//                 this.updateValidationState(type, false, `이미 사용 중인 ${type === 'userId' ? '아이디' : '닉네임'}입니다.`);
//                 type === 'userId' ? this.userIdChecked = false : this.nicknameChecked = false;
//             }
//             this.updateNextButton();
//         });
//     },
//
//     updateValidationState(type, isValid, message) {
//         const $input = $(`#${type}`);
//         const $checkButton = $(`#${type}_check`);
//         const $icon = $input.siblings('.validation-icon');
//         const $message = $(`#${type}Message`);
//
//         $checkButton.fadeOut(100, function() {
//             $icon.removeClass('text-red-500 text-green-500')
//                 .addClass(isValid ? 'text-green-500' : 'text-red-500')
//                 .html(isValid ? '&#10004;' : '&#10008;');
//
//             $message.removeClass('text-red-500 text-green-500 hidden')
//                 .addClass(isValid ? 'text-green-300 text-sm' : 'text-red-400 text-sm')
//                 .text(message)
//                 .fadeIn(300);
//         });
//     },
//
//     onInputChange() {
//         const type = $(this).attr('id');
//         if (type === 'userId' || type === 'nickname') {
//             const $checkButton = $(`#${type}_check`);
//             const $icon = $(this).siblings('.validation-icon');
//             const $message = $(`#${type}Message`);
//
//             $message.fadeOut(300, function() {
//                 $icon.removeClass('text-red-500 text-green-500').html('');
//                 $checkButton.fadeIn(300);
//             });
//
//             type === 'userId' ? this.userIdChecked = false : this.nicknameChecked = false;
//         }
//         this.updateNextButton();
//     },
//
//     onBackBtnClick() {
//         $(".form-container > div").css("transform", "translateX(0)");
//         this.$stepIndicator.text("1 / 2");
//         this.$nextBtn.text("다음").removeClass("bg-yellow-500 hover:bg-yellow-600").addClass("bg-yellow-200 hover:bg-yellow-500");
//         this.$backBtn.addClass("hidden");
//         this.currentStep = 1;
//     },
//
//     onNextBtnClick() {
//         if (this.currentStep === 1) {
//             const errorMessages = this.validateForm();
//             if (errorMessages.length === 0) {
//                 $(".form-container > div").css("transform", "translateX(-50%)");
//                 this.$stepIndicator.text("2 / 2");
//                 this.$nextBtn.text("회원가입").removeClass("bg-yellow-500 hover:bg-yellow-600").addClass("bg-yellow-200 hover:bg-yellow-500");
//                 this.$backBtn.removeClass("hidden");
//                 this.currentStep = 2;
//             } else {
//                 this.$nextButtonMessage.html(errorMessages.join("<br>")).removeClass("hidden");
//             }
//         } else {
//             if (this.selectedCategories.length >= 3) {
//                 this.$joinForm.submit();
//             } else {
//                 alert("최소 3개의 카테고리를 선택해주세요.");
//             }
//         }
//     },
//
//     onCategoryBtnClick() {
//         const categoryId = $(this).data("category-id");
//         const categoryName = $(this).text();
//
//         if ($(this).hasClass("selected")) {
//             $(this).removeClass("selected bg-yellow-500").addClass("bg-yellow-200");
//             this.selectedCategories = this.selectedCategories.filter(c => c.id !== categoryId);
//         } else {
//             if (this.selectedCategories.length >= 5) {
//                 alert("최대 5개의 카테고리만 선택할 수 있습니다.");
//                 return;
//             }
//             $(this).addClass("selected bg-yellow-500").removeClass("bg-yellow-200");
//             this.selectedCategories.push({ id: categoryId, name: categoryName });
//         }
//
//         this.updateSelectedCategories();
//     },
//
//     updateSelectedCategories() {
//         this.$selectedCategory.empty();
//         this.$hiddenInputs.empty();
//         this.selectedCategories.forEach((category, index) => {
//             this.$selectedCategory.append(`<div class="bg-yellow-300 font-bold py-1 px-2 rounded">${category.name}</div>`);
//             this.$hiddenInputs.append(`<input type="hidden" name="categoryIds[${index}]" value="${category.id}">`);
//         });
//     },
//
//     onJoinFormSubmit(e) {
//         e.preventDefault();
//         if (this.selectedCategories.length < 3) {
//             alert("최소 3개의 카테고리를 선택해주세요.");
//             return;
//         }
//         const formData = new FormData(this);
//         this.selectedCategories.forEach(category => formData.append('categoryIds[]', category.id));
//
//         $.ajax({
//             url: url_join,
//             type: post,
//             data: formData,
//             processData: false,
//             contentType: false,
//             success: function(response) {
//                 console.log(response.message);
//                 window.location.href = "/";
//             },
//             error: function(xhr, status, error) {
//                 console.log(JSON.parse(xhr.responseText).message || "회원가입. 서버랑 통신오류남");
//             }
//         });
//     }
// };
//
// $(function() {
//     JoinPage.init();
// });
$(document).ready(function() {
    let userIdChecked = false;
    let nicknameChecked = false;
    let selectedCategories = [];
    let currentStep = 1;
    function updateNextButton() {
        const allFieldsFilled = $("#userId").val() && $("#userPw").val() && $("#userPw2").val() && $("#nickname").val();
        const passwordMatch = $("#userPw").val() === $("#userPw2").val();
        const isValid = userIdChecked && nicknameChecked && allFieldsFilled && passwordMatch;

        $("#next_btn").prop("disabled", !isValid);
    }

    function validateForm() {
        const allFieldCheck = $("#userId").val() && $("#userPw").val() && $("#userPw2").val() && $("#nickname").val();
        const userPwMatch = $("#userPw").val() === $("#userPw2").val();
        // const userPwCondition = $("#userPw").val();

        let errorMessages = [];
        if (!allFieldCheck) errorMessages.push("모든 필드를 입력해주세요.");
        // if (!userPwCondition) errorMessages.push("비밀번호를 조건에 맞추주세요");
        if (!userPwMatch) errorMessages.push("비밀번호가 일치하지 않습니다.");
        if (!userIdChecked) errorMessages.push("아이디 중복 체크를 완료해주세요.");
        if (!nicknameChecked) errorMessages.push("닉네임 중복 체크를 완료해주세요.");

        return errorMessages;
    }

    function checkDuplicate(type) {
        const value = $(`#${type}`).val();
        if (!value) {
            updateValidationState(type, false, `${type === 'userId' ? '아이디' : '닉네임'}를 입력해주세요.`);
            return;
        }

        $.post('/ajaxCheckNickname', {  value: value }, function(response) {
            if (response === 0) {
                updateValidationState(type, true, `사용 가능한 ${type === 'userId' ? '아이디' : '닉네임'}입니다.`);
                type === 'userId' ? userIdChecked = true : nicknameChecked = true;
            } else {
                updateValidationState(type, false, `이미 사용 중인 ${type === 'userId' ? '아이디' : '닉네임'}입니다.`);
                type === 'userId' ? userIdChecked = false : nicknameChecked = false;
            }
            updateNextButton();
        });
        $.post('/ajaxCheckId', { type: type, value: value }, function(response) {
            if (response === 0) {
                updateValidationState(type, true, `사용 가능한 ${type === 'userId' ? '아이디' : '닉네임'}입니다.`);
                type === 'userId' ? userIdChecked = true : nicknameChecked = true;
            } else {
                updateValidationState(type, false, `이미 사용 중인 ${type === 'userId' ? '아이디' : '닉네임'}입니다.`);
                type === 'userId' ? userIdChecked = false : nicknameChecked = false;
            }
            updateNextButton();
        });
    }

    function updateValidationState(type, isValid, message) {
        const $input = $(`#${type}`);
        const $checkButton = $(`#${type}_check`);
        const $icon = $input.siblings('.validation-icon');
        const $message = $(`#${type}Message`);

        $checkButton.fadeOut(100, function() {
            $icon.removeClass('text-red-500 text-green-500')
                .addClass(isValid ? 'text-green-500' : 'text-red-500')
                .html(isValid ? '&#10004;' : '&#10008;');

            $message.removeClass('text-red-500 text-green-500 hidden')
                .addClass(isValid ? 'text-green-300 text-sm' : 'text-red-400 text-sm')
                .text(message)
                .fadeIn(300);
        });
    }

    $('#userId_check').click(() => checkDuplicate('userId'));
    $('#nickname_check').click(() => checkDuplicate('nickname'));

    $("#userId, #nickname, #userPw, #userPw2").on('input', function() {
        const type = $(this).attr('id');
        if (type === 'userId' || type === 'nickname') {
            const $checkButton = $(`#${type}_check`);
            const $icon = $(this).siblings('.validation-icon');
            const $message = $(`#${type}Message`);

            $message.fadeOut(300, function() {
                $icon.removeClass('text-red-500 text-green-500').html('');
                $checkButton.fadeIn(300);
            });

            type === 'userId' ? userIdChecked = false : nicknameChecked = false;
        }
        updateNextButton();
    });

    $("#back_btn").click(function() {
        $(".form-container > div").css("transform", "translateX(0)");
        $("#step-indicator .m-auto").text("1 / 2");
        $("#next_btn").text("다음").removeClass("bg-yellow-500 hover:bg-yellow-600").addClass("bg-yellow-200 hover:bg-yellow-500");
        $(this).addClass("hidden");
        currentStep = 1;
    });
    $("#next_btn").click(function() {
        if (currentStep === 1) {
            const errorMessages = validateForm();
            if (errorMessages.length === 0) {
                $(".form-container > div").css("transform", "translateX(-50%)");
                $("#step-indicator .m-auto").text("2 / 2");
                $(this).text("회원가입").removeClass("bg-yellow-500 hover:bg-yellow-600").addClass("bg-yellow-200 hover:bg-yellow-500");
                $("#back_btn").removeClass("hidden");
                currentStep = 2;
            } else {
                $("#nextButtonMessage").html(errorMessages.join("<br>")).removeClass("hidden");
            }
        } else {
            // 회원가입 제출 로직
            if (selectedCategories.length >= 3) {
                $("#joinForm").submit();
            } else {
                alert("최소 3개의 카테고리를 선택해주세요.");
            }
        }
    });


    // 카테고리 선택 로직
    $(".category-btn").click(function() {
        let categoryId = $(this).data("category-id");
        let categoryName = $(this).text();

        if ($(this).hasClass("selected")) {
            $(this).removeClass("selected bg-gray-200").addClass("bg-yellow-200");
            selectedCategories = selectedCategories.filter(c => c.id !== categoryId);
        } else {
            $(this).removeClass("bg-yellow-200").addClass("selected bg-gray-200");
            selectedCategories.push({id: categoryId, name: categoryName});
        }

        updateSelectedCategories();
    });
    $(".category-btn").click(function() {
        const categoryId = $(this).data("category-id");
        const categoryName = $(this).text();

        if ($(this).hasClass("selected")) {
            $(this).removeClass("selected bg-yellow-500").addClass("bg-yellow-200");
            selectedCategories = selectedCategories.filter(c => c.id !== categoryId);
        } else {
            if (selectedCategories.length >= 5) {
                alert("최대 5개의 카테고리만 선택할 수 있습니다.");
                return;
            }
            $(this).addClass("selected bg-yellow-500").removeClass("bg-yellow-200");
            selectedCategories.push({id: categoryId, name: categoryName});
        }

        updateSelectedCategories();
    });
    function updateSelectedCategories() {
        const $selectedCategory = $("#selected_category");
        const $hiddenInputs = $("#hidden_category_inputs");
        $selectedCategory.empty();
        $hiddenInputs.empty();
        selectedCategories.forEach(function(category, index) {
            $selectedCategory.append(`<div class="bg-yellow-300 font-bold py-1 px-2 rounded">${category.name}</div>`);
            $hiddenInputs.append(`<input type="hidden" name="categoryIds[${index}]" value="${category.id}">`);
        });
    }

    // 폼 제출
    $("#joinForm").submit(function(e) {
        e.preventDefault();
        if (selectedCategories.length < 3) {
            alert("최소 3개의 카테고리를 선택해주세요.");
            return;
        }
        let formData = new FormData(this);
        selectedCategories.forEach(function(category) {
            formData.append('categoryIds[]', category.id);
        });
        $.ajax({
            url: $(this).attr('action'),
            type: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            success: function(response) {
                if (response.success) {
                    console.log(response.message);
                    window.location.href = "/";
                } else {
                    console.log(response.message);
                }
            },
            error: function(xhr, status, error) {
                const response = JSON.parse(xhr.responseText);
                console.log(xhr.responseText)
                console.log(response.message || "회원가입. 서버랑 통신오류남 ");
            }
        });
    });
});