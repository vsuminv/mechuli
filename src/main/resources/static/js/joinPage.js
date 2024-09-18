const JoinPage = {
    init() {
        this.joinPage();
        this.joinEvents();
        this.updateNextButton();
        this.response_category_data();




    },

    joinPage() {
        this.userIdChecked = false;
        this.nicknameChecked = false;
        this.selectedCategories = 0 ;
        this.currentStep = 1;

        this.$userId = $("#userId");
        this.$userPw = $("#userPw");
        this.$userPw2 = $("#userPw2");
        this.$nickname = $("#nickname");
        this.$nextBtn = $("#next_btn");
        this.$backBtn = $("#back_btn");
        this.$stepIndicator = $("#step-indicator .m-auto");
        this.$nextButtonMessage = $("#nextButtonMessage");
        this.$selectedCategory = $("#selected_category");
        this.$hiddenInputs = $("#hidden_category_inputs");
        this.$joinForm = $("#joinForm");
        this.$categoryList = $("#categoryList");

        this.$userPwIcon = this.$userPw.siblings('.validation-icon');
        this.$userPw2Icon = this.$userPw2.siblings('.validation-icon');
        this.$userPw.on('input', this.onPasswordInput.bind(this));
        this.$userPw2.on('input', this.onPasswordConfirmInput.bind(this));
    },

    //async로 패치 먼저 실행. 패치 리스폰 전엔 대기.
    async response_category_data() {
        try {
            const response = await $.ajax({
                url: url_api_category,
                type: 'GET',
                dataType: 'json'
            });
            console.log('서버 응답:', response);
            this.renderCategories(response);
        } catch (error) {
            console.error('카테고리 가져오기 오류:', error);
            alert('카테고리를 불러오는 데 실패했습니다. 페이지를 새로고침 해주세요.');
        }
    },

    joinEvents() {
        $('#userId_check').click(() => this.checkDuplicate('userId'));
        $('#nickname_check').click(() => this.checkDuplicate('nickname'));

        this.$userId.on('input', this.onInputChange.bind(this, 'userId'));
        this.$nickname.on('input', this.onInputChange.bind(this, 'nickname'));
        this.$userPw.on('input', this.updateNextButton.bind(this));
        this.$userPw2.on('input', this.updateNextButton.bind(this));

        this.$backBtn.click(this.onBackBtnClick.bind(this));
        this.$nextBtn.click(this.onNextBtnClick.bind(this));

        $(document).on('click', '.category-btn', this.onCategoryBtnClick.bind(this));
        this.$joinForm.submit(this.onJoinFormSubmit.bind(this));
    },

    updateNextButton() {
        const allFieldsFilled = this.$userId.val() && this.$userPw.val() && this.$userPw2.val() && this.$nickname.val();
        const passwordMatch = this.$userPw.val() === this.$userPw2.val() && this.$userPw.val().length >= 2;
        let isValid = this.userIdChecked && this.nicknameChecked && allFieldsFilled && passwordMatch;

        if (this.currentStep === 2) {
            isValid = this.selectedCategories >= 3;
        }

        this.$nextBtn.prop("disabled", !isValid);
        if (isValid) {
            this.$nextBtn.removeClass("hidden bg-yellow-300").addClass("bg-yellow-200 hover:bg-yellow-400");
        } else {
            this.$nextBtn.removeClass("bg-yellow-200 hover:bg-yellow-400").addClass("bg-yellow-300");
        }
    },



    renderCategories(categories) {
        this.$categoryList.empty();

        Object.entries(categories).forEach(([categoryName, restaurants]) => {
            const $categoryBtn = $('<button>')
                .attr('type', 'button')
                .addClass('category-btn bg-yellow-200 hover:bg-yellow-300 font-bold py-1 px-2 rounded-full transition-colors duration-200')
                .attr('data-category-id', categoryName)
                .text(categoryName);

            console.log('카테고리 렌더링:', categoryName);
            this.$categoryList.append($categoryBtn);
        });
    },

    validateForm() {
        const userPwMatch = this.$userPw.val() === this.$userPw2.val();
        let errorMessages = [];

        if (!userPwMatch) errorMessages.push("비밀번호가 일치하지 않습니다.");
        if (!this.userIdChecked) errorMessages.push("아이디 중복 체크를 완료해주세요.");
        if (!this.nicknameChecked) errorMessages.push("닉네임 중복 체크를 완료해주세요.");

        return errorMessages;
    },

    async checkDuplicate(type) {
        const $checkButton = $(`#${type}_check`);
        $checkButton.prop('disabled', true).addClass('opacity-50 cursor-not-allowed');
        const value = this[`$${type}`].val();
        if (!value) {
            this.updateValidationState(type, false, `${type === 'userId' ? '아이디' : '닉네임'}를 입력해라`);
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
                this.updateValidationState(type, true, `사용 가능한 ${type === 'userId' ? '아이디' : '닉네임'}임`);
                type === 'userId' ? this.userIdChecked = true : this.nicknameChecked = true;
            } else if (response === 1) {
                this.updateValidationState(type, false, `이미 사용 중인 ${type === 'userId' ? '아이디' : '닉네임'}임`);
                type === 'userId' ? this.userIdChecked = false : this.nicknameChecked = false;
            }
            this.updateNextButton();
        } catch (error) {
            console.error('중복 체크 실패함:', error);
            this.updateValidationState(type, false, '중복 체크 중 오류 발생. 다시 해봐');
        } finally {
            $checkButton.prop('disabled', false).removeClass('opacity-50 cursor-not-allowed');
        }
    },

    updateValidationState(type, isValid, message) {
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
                .fadeIn(200);
        });

        // 중복 체크 버튼을 숨기고 비활성화
        $checkButton.prop('disabled', true).addClass('opacity-50 cursor-not-allowed').hide();
    },

    onInputChange(type) {
        const $input = this[`$${type}`];
        const $checkButton = $(`#${type}_check`);
        const $icon = $input.siblings('.validation-icon');
        const $message = $(`#${type}Message`);

        // 결과 메시지와 아이콘을 숨기고 중복 체크 버튼을 다시 보이게 함
        $message.fadeOut(300);
        $icon.removeClass('text-red-500 text-green-500').html('');
        $checkButton.fadeIn(300).prop('disabled', false).removeClass('opacity-50 cursor-not-allowed');

        // 중복 체크 상태 초기화
        if (type === 'userId') {
            this.userIdChecked = false;
        } else {
            this.nicknameChecked = false;
        }

        this.updateNextButton();
    },


    onPasswordInput() {
        const password = this.$userPw.val();
        if (password.length >= 2) {
            this.$userPwIcon.removeClass('text-red-300 text-sm').addClass('text-green-300 text-sm').html('&#10004;');
        } else {
            this.$userPwIcon.removeClass('text-green-300 text-sm').addClass('text-red-300 text-sm').html('&#10008;');
        }
        this.onPasswordConfirmInput();
        this.updateNextButton();
    },
    onPasswordConfirmInput() {
        const password = this.$userPw.val();
        const confirmPassword = this.$userPw2.val();
        if (password === confirmPassword && password.length >= 2) {
            this.$userPw2Icon.removeClass('text-red-500').addClass('text-green-500').html('&#10004;');
        } else {
            this.$userPw2Icon.removeClass('text-green-500').addClass('text-red-500').html('&#10008;');
        }
        this.updateNextButton();
    },

    onBackBtnClick() {
        $(".form-container > div").css("transform", "translateX(0)");
        this.$stepIndicator.text("1 / 2");
        this.$nextBtn.text("다음").removeClass("bg-yellow-500 hover:bg-yellow-600").addClass("bg-yellow-200 hover:bg-yellow-500");
        this.$backBtn.addClass("hidden");
        this.currentStep = 1;
        // this.animateStepTransition(false);
    },

    onNextBtnClick() {
        if (this.currentStep === 1) {
            const errorMessages = this.validateForm();
            if (errorMessages.length === 0) {
                $(".form-container > div").css("transform", "translateX(-50%)");
                this.$stepIndicator.text("2 / 2");
                this.$nextBtn.text("회원가입").removeClass("bg-yellow-500 hover:bg-yellow-600").addClass("bg-yellow-200 hover:bg-yellow-500");
                this.$backBtn.removeClass("hidden");
                this.currentStep = 2;
            } else {
                this.$nextButtonMessage.html(errorMessages.join("<br>")).removeClass("hidden");
            }
        } else {
            if (this.selectedCategories >= 3) {
                this.$joinForm.submit();
            } else {
                alert("최소 3개의 카테고리를 선택해주세요.");
            }
        }
    },

    onCategoryBtnClick(event) {
        event.preventDefault(); // 기본 동작 방지
        const $this = $(event.currentTarget);
        const categoryId = $this.data("category-id");
        const categoryName = $this.text();

        console.log('클릭된 카테고리:', categoryName, 'ID:', categoryId);

        if ($this.hasClass("selected")) {
            // 이미 선택된 카테고리라면 제거
            $this.removeClass("selected bg-yellow-500").addClass("bg-yellow-200");
            this.selectedCategories--;
        } else {
            // 새로운 카테고리 선택
            if (this.selectedCategories >= 5) {
                alert("최대 5개의 카테고리만 선택할 수 있습니다.");
                console.log('최대 선택 개수 도달');
                return;
            }
            $this.removeClass("bg-yellow-200").addClass("selected bg-yellow-500");
            this.selectedCategories++;
        }

        console.log('현재 선택된 카테고리 수:', this.selectedCategories);

        this.updateSelectedCategories();
        this.updateNextButton();
    },

    updateSelectedCategories() {
        this.$selectedCategory.empty();
        this.$hiddenInputs.empty();

        $('.category-btn.selected').each((index, button) => {
            const $button = $(button);
            const categoryId = $button.data('category-id');
            const categoryName = $button.text();

            const $categoryTag = $(`<div class="bg-yellow-300 font-bold py-1 px-2 rounded inline-block m-1">${categoryName}</div>`);
            this.$selectedCategory.append($categoryTag);
            this.$hiddenInputs.append(`<input type="hidden" name="categoryIds[${index}]" value="${categoryId}">`);
        });

        // 선택된 카테고리 수 표시
        const countText = `${this.selectedCategories}/5 선택됨`;
        console.log("카테고리 담은거." + countText)
        const $countDisplay = $(`<div class="text-sm text-gray-600 mt-2">${countText}</div>`);
        this.$selectedCategory.append($countDisplay);

        this.updateNextButton();
    },

    async onJoinFormSubmit(e) {
        e.preventDefault();
        if (this.selectedCategories < 3) {
            alert("최소 3개의 취향을 선택해w주세요");
            return;
        }

        const userData = {
            userId: this.$userId.val(),
            userPw: this.$userPw.val(),
            nickname: this.$nickname.val(),
            categoryIds: $('.category-btn.selected').map(function() {
                return $(this).data('category-id');
            }).get(),
            role: 'USER' //권한 억지로 넣음 보안상 하면 안될듯. 해봤는데 되지도 않음.
        };

        try {
            const response = await $.ajax({
                url: url_join,
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(userData)
            });
            console.log('회원가입 성공. 들어온거.', response );
            alert('회원가입 성공. 들어온거.', response )
            window.location.href = "/";
        } catch (error) {
            console.error('회원가입 실패.', error);
            alert("회원가입 실패. 다시 시도해주세요.");
        }
    },
};

$(function() {
    JoinPage.init();
});