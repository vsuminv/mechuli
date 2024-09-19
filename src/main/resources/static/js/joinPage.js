const join_page = {
    init() {
        this.userIdChecked = false;
        this.nicknameChecked = false;
        this.selectedCategories = [];
        this.currentStep = 1;
        this.cacheDOM();
        this.bind_events();
        this.loadCategories();
        this.updateNextButton();
    },

    cacheDOM() {
        this.$userId = $("#userId");
        this.$userPw = $("#userPw");
        this.$userPw2 = $("#userPw2");
        this.$nickname = $("#nickname");
        this.$nextBtn = $("#next_btn");
        this.$backBtn = $("#back_btn");
        this.$stepIndicator = $("#step-indicator span");
        this.$categoryList = $("#category_list");
        this.$selectedCategory = $("#selected_category");
        this.$hiddenCategoryInputs = $("#hidden_category_inputs");
        this.$joinForm = $("#joinForm");
        this.$nextButtonMessage = $("#next_button_message");

    },

    bind_events() {
        $('#userId_check').click(() => this.check_duplicate('userId'));
        $('#nickname_check').click(() => this.check_duplicate('nickname'));
        this.$userId.on('input', () => this.handleInputChange('userId'));
        this.$nickname.on('input', () => this.handleInputChange('nickname'));
        this.$userPw.on('input', this.handlePasswordInput.bind(this));
        this.$userPw2.on('input', this.handlePasswordConfirmInput.bind(this));
        this.$backBtn.click(this.handleBackBtn.bind(this));
        this.$nextBtn.click(this.handleNextBtn.bind(this));
        this.$categoryList.on('click', '.category-btn', this.handleCategoryClick.bind(this));
        this.$joinForm.submit(this.handleFormSubmit.bind(this));
    },
    async loadCategories() {
        try {
            const response = await $.ajax({
                url: '/api/category',
                type: 'GET',
                dataType: 'json'
            });
            console.log('카테고리 데이터:', response);  // 받아온 데이터 로깅
            this.renderCategories(response);
        } catch (error) {
            console.error('카테고리 로딩 실패:', error);
        }
    },
    renderCategories(categories) {
        this.$categoryList.empty();
        if (Object.keys(categories).length === 0) {
            console.log('카테고리 데이터가 비어있습니다.');
            this.$categoryList.append('<p>카테고리를 불러올 수 없습니다.</p>');
            return;
        }
        Object.entries(categories).forEach(([category, restaurants]) => {
            const $btn = $('<button>')
                .addClass('category-btn bg-yellow-200 hover:bg-yellow-300 font-bold py-1 px-2 rounded-full m-1')
                .attr('type', 'button')
                .attr('data-category-id', category)
                .text(category);
            this.$categoryList.append($btn);
        });
        console.log('카테고리 버튼 생성 완료');  // 버튼 생성 완료 로깅
    },
    updateNextButton() {
        const allFieldsFilled = this.$userId.val() && this.$userPw.val() && this.$userPw2.val() && this.$nickname.val();
        const passwordMatch = this.$userPw.val() === this.$userPw2.val();
        const isValid = this.userIdChecked && this.nicknameChecked && allFieldsFilled && passwordMatch;

        this.$nextBtn.prop("disabled", !isValid);
        if (isValid) {
            this.$nextBtn.removeClass("bg-yellow-300").addClass("bg-yellow-500 hover:bg-yellow-600");
        } else {
            this.$nextBtn.removeClass("bg-yellow-500 hover:bg-yellow-600").addClass("bg-yellow-300");
        }
    }, async check_duplicate(type) {
        const $input = this[`$${type}`];
        const $checkButton = $(`#${type}_check`);
        $checkButton.prop('disabled', true).addClass('opacity-50 cursor-not-allowed');
        const value = $input.val();
        if (!value) {
            this.update_validation_state(type, false, `${type === 'userId' ? '아이디' : '닉네임'}를 입력해주세요.`);
            $checkButton.prop('disabled', false).removeClass('opacity-50 cursor-not-allowed');
            return;
        }
        const url = type === 'userId' ? '/ajaxCheckId' : '/ajaxCheckNickname';
        try {
            const response = await $.ajax({
                url: url,
                type: 'POST',
                contentType: 'text/plain',
                data: value
            });
            if (response === 0) {
                this.update_validation_state(type, true, `사용 가능한 ${type === 'userId' ? '아이디' : '닉네임'}입니다.`);
                type === 'userId' ? this.userIdChecked = true : this.nicknameChecked = true;
            } else {
                this.update_validation_state(type, false, `이미 사용 중인 ${type === 'userId' ? '아이디' : '닉네임'}입니다.`);
                type === 'userId' ? this.userIdChecked = false : this.nicknameChecked = false;
            }
            this.updateNextButton();
        } catch (error) {
            console.error('중복 체크 실패:', error);
            this.update_validation_state(type, false, '중복 체크 중 오류가 발생했습니다. 다시 시도해주세요.');
        } finally {
            $checkButton.prop('disabled', false).removeClass('opacity-50 cursor-not-allowed');
        }
    },
    // 비번 유효성 검사 현재 1
    async check_duplicate(type) {
        const $checkButton = $(`#${type}_check`);
        $checkButton.prop('disabled', true).addClass('opacity-50 cursor-not-allowed');
        const value = $(`#${type}`).val();
        if (!value) {
            this.update_validation_state(type, false, `${type === 'userId' ? '아이디' : '닉네임'}를 입력해주세요.`);
            $checkButton.prop('disabled', false).removeClass('opacity-50 cursor-not-allowed');
            return;
        }
        const url = type === 'userId' ? url_ajaxCheckId : url_ajaxCheckNickname;
        try {
            const response = await $.ajax({
                url: url,
                type: 'POST',
                contentType: 'text/plain',
                data: value
            });
            console.log(`${type === 'userId' ? '아이디' : '닉네임'} 중복 결과:`, response);
            if (response === 0) {
                this.update_validation_state(type, true, `사용 가능한 ${type === 'userId' ? '아이디' : '닉네임'}입니다.`);
                type === 'userId' ? this.userIdChecked = true : this.nicknameChecked = true;
            } else if (response === 1) {
                this.update_validation_state(type, false, `이미 사용 중인 ${type === 'userId' ? '아이디' : '닉네임'}입니다.`);
                type === 'userId' ? this.userIdChecked = false : this.nicknameChecked = false;
            }
            this.updateNextButton();
        } catch (error) {
            console.error('중복 체크 실패:', error);
            this.update_validation_state(type, false, '중복 체크 중 오류가 발생했습니다. 다시 시도해주세요.');
        } finally {
            $checkButton.prop('disabled', false).removeClass('opacity-50 cursor-not-allowed');
        }
    },
    update_validation_state(type, isValid, message) {
        const $input = this[`$${type}`];
        const $icon = $input.siblings('.validation-icon');
        const $message = $(`#${type}Message`);

        $icon.removeClass('text-red-500 text-green-500')
            .addClass(isValid ? 'text-green-500' : 'text-red-500')
            .html(isValid ? '&#10004;' : '&#10008;');

        $message.removeClass('text-red-500 text-green-500 hidden')
            .addClass(isValid ? 'text-green-300 text-sm' : 'text-red-400 text-sm')
            .text(message)
            .fadeIn(300);
    },
    validateForm() {
        const allFieldCheck = $("#userId").val() && $("#userPw").val() && $("#userPw2").val() && $("#nickname").val();
        const userPwMatch = $("#userPw").val() === $("#userPw2").val();

        let errorMessages = [];
        if (!allFieldCheck) errorMessages.push("모든 필드를 입력해주세요.");
        if (!userPwMatch) errorMessages.push("비밀번호가 일치하지 않습니다.");
        if (!this.userIdChecked) errorMessages.push("아이디 중복 체크를 완료해주세요.");
        if (!this.nicknameChecked) errorMessages.push("닉네임 중복 체크를 완료해주세요.");

        return errorMessages;
    },
    handleInputChange(type) {
        const $input = this[`$${type}`];
        const $icon = $input.siblings('.validation-icon');
        const $message = $(`#${type}Message`);

        $message.fadeOut(300);
        $icon.removeClass('text-red-500 text-green-500').html('');

        type === 'userId' ? this.userIdChecked = false : this.nicknameChecked = false;
        this.updateNextButton();
    },
    handlePasswordInput() {
        const password = this.$userPw.val();
        const $icon = this.$userPw.siblings('.validation-icon');

        if (password.length >= 1) {
            $icon.removeClass('text-red-500').addClass('text-green-500').html('&#10004;');
        } else {
            $icon.removeClass('text-green-500').addClass('text-red-500').html('&#10008;');
        }
        this.handlePasswordConfirmInput();
        this.updateNextButton();
    },
    handlePasswordConfirmInput() {
        const password = this.$userPw.val();
        const confirmPassword = this.$userPw2.val();
        const $icon = this.$userPw2.siblings('.validation-icon');

        if (password === confirmPassword && password.length >= 8) {
            $icon.removeClass('text-red-500').addClass('text-green-500').html('&#10004;');
        } else {
            $icon.removeClass('text-green-500').addClass('text-red-500').html('&#10008;');
        }
        this.updateNextButton();
    },
    handleBackBtn() {
        $(".form-container > div").css("transform", "translateX(0)");
        this.$stepIndicator.text("1 / 2");
        this.$nextBtn.text("다음");
        this.$backBtn.addClass("hidden");
        this.currentStep = 1;
        this.updateNextButton();
    },

    handleNextBtn() {
        if (this.currentStep === 1) {
            const errorMessages = this.validateForm();
            if (errorMessages.length === 0) {
                $(".form-container > div").css("transform", "translateX(-50%)");
                this.$stepIndicator.text("2 / 2");
                this.$nextBtn.text("회원가입");
                this.$backBtn.removeClass("hidden");
                this.currentStep = 2;
                this.loadCategories();  // 카테고리 로딩을 여기로 이동
            } else {
                this.$nextButtonMessage.html(errorMessages.join("<br>")).removeClass("hidden");
            }
        } else {
            if (this.selectedCategories.length >= 3 && this.selectedCategories.length <= 5) {
                this.$joinForm.submit();
            } else {
                alert("카테고리를 3개 이상 5개 이하로 선택해주세요.");
            }
        }
    },

    handleCategoryClick(event) {
        const $button = $(event.currentTarget);
        const categoryId = $button.data("category-id");
        const categoryName = $button.text();

        if ($button.hasClass("selected")) {
            $button.removeClass("selected bg-yellow-500").addClass("bg-yellow-200");
            this.selectedCategories = this.selectedCategories.filter(c => c.id !== categoryId);
        } else {
            if (this.selectedCategories.length >= 5) {
                alert("최대 5개의 카테고리만 선택할 수 있습니다.");
                return;
            }
            $button.removeClass("bg-yellow-200").addClass("selected bg-yellow-500");
            this.selectedCategories.push({id: categoryId, name: categoryName});
        }

        this.updateSelectedCategories();
    },
    updateSelectedCategories() {
        this.$selectedCategory.empty();
        this.$hiddenCategoryInputs.empty();
        this.selectedCategories.forEach((category, index) => {
            this.$selectedCategory.append(`<span class="bg-yellow-300 font-bold py-1 px-2 rounded inline-block m-1">${category.name}</span>`);
            this.$hiddenCategoryInputs.append(`<input type="hidden" name="categoryIds" value="${category.id}">`);
        });
    },
    validateForm() {
        let errorMessages = [];
        if (!this.$userId.val()) errorMessages.push("아이디를 입력해주세요.");
        if (!this.$userPw.val()) errorMessages.push("비밀번호를 입력해주세요.");
        if (this.$userPw.val() !== this.$userPw2.val()) errorMessages.push("비밀번호가 일치하지 않습니다.");
        if (!this.$nickname.val()) errorMessages.push("닉네임을 입력해주세요.");
        if (!this.userIdChecked) errorMessages.push("아이디 중복 체크를 완료해주세요.");
        if (!this.nicknameChecked) errorMessages.push("닉네임 중복 체크를 완료해주세요.");
        return errorMessages;
    },
    handleFormSubmit(event) {
        event.preventDefault();
        if (this.selectedCategories.length < 3 || this.selectedCategories.length > 5) {
            alert("카테고리를 3개 이상 5개 이하로 선택해주세요.");
            return;
        }

        // 폼 데이터를 JSON 형태로 생성
        var formData = {
            userId: this.$userId.val(),
            userPw: this.$userPw.val(),
            nickname: this.$nickname.val(),
            categoryIds: this.selectedCategories.map(function(category) {
                return Number(category.id);
            })
        };



        // AJAX를 사용하여 폼 데이터 전송
        // $.ajax({
        //     url: this.$joinForm.attr('action'),
        //     type: 'POST',
        //     data: formData,
        //     processData: false,
        //     contentType: false,
        //     success: (response) => {
        //         alert("회원가입이 완료되었습니다.");
        //         console.log("성공?", response);
        //         // window.location.href = "/";  // 메인 페이지로 리다이렉트
        //     },
        //     error: (xhr, status, error) => {
        //         alert("회원가입 중 오류가 발생했습니다: " + xhr.responseText);
        //     }
        // });

        $.ajax({
            url: this.$joinForm.attr('action'),
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(formData),
            success: (response) => {
                alert("회원가입이 완료되었습니다.");
                console.log("성공?", response);
                // window.location.href = "/";  // 메인 페이지로 리다이렉트
            },
            error: (xhr, status, error) => {
                alert("회원가입 중 오류가 발생했습니다: " + xhr.responseText);
            }
        });
    }
};

$(function() {
    join_page.init();
});