const join_page = {
    init() {
        this.join_page();
        this.join_events();
        this.update_next_button();
        this.response_category_data();
    },

    join_page() {
        this.user_id_checked = false;
        this.nickname_checked = false;
        this.selected_categories = 0;
        this.current_step = 1;

        this.$userId = $("#userId");
        this.$userPw = $("#userPw");
        this.$userPw2 = $("#userPw2");
        this.$nickname = $("#nickname");
        this.$nextBtn = $("#next_btn");
        this.$backBtn = $("#back_btn");
        this.$step_indicator = $("#step-indicator .m-auto");
        this.$nextButtonMessage = $("#next_button_message");
        this.$selectedCategory = $("#selected_category");
        this.$hiddenInputs = $("#hidden_category_inputs");
        this.$joinForm = $("#joinForm");
        this.$category_list = $("#category_list");

        this.$userPwIcon = this.$userPw.siblings('.validation-icon');
        this.$userPw2Icon = this.$userPw2.siblings('.validation-icon');
        this.$userPw.on('input', this.onPasswordInput.bind(this));
        this.$userPw2.on('input', this.onPasswordConfirmInput.bind(this));
    },
    join_events() {
        $('#userId_check').on('click', () => this.check_duplicate('userId'));
        $('#nickname_check').on('click', () => this.check_duplicate('nickname'));

        this.$userId.on('input', () => this.onInputChange('userId'));
        this.$nickname.on('input', () => this.onInputChange('nickname'));
        this.$userPw.on('input', this.onPasswordInput.bind(this));
        this.$userPw2.on('input', this.onPasswordConfirmInput.bind(this));

        this.$backBtn.on('click', this.onBackBtnClick.bind(this));
        this.$nextBtn.on('click', this.onNextBtnClick.bind(this));

        this.$category_list.on('click', '.category-btn', this.onCategoryBtnClick.bind(this));
        this.$joinForm.on('submit', this.onJoinFormSubmit.bind(this));
    },
    async response_category_data() {
        try {
            const response = await $.ajax({
                url: url_api_category,
                type: 'GET',
                dataType: 'json'
            });
            console.log('서버 응답:', response);
            this.render_categories(response);
        } catch (error) {
            console.error('카테고리 가져오기 오류:', error);
            alert('카테고리를 불러오는 데 실패했습니다. 페이지를 새로고침 해주세요.');
        }
    },
    update_next_button() {
        const all_fields_filled = this.$userId.val() && this.$userPw.val() && this.$userPw2.val() && this.$nickname.val();
        const password_match = this.$userPw.val() === this.$userPw2.val() && this.$userPw.val().length >= 2;
        let is_valid = this.user_id_checked && this.nickname_checked && all_fields_filled && password_match;

        if (this.current_step === 2) {
            is_valid = this.selected_categories >= 3;
        }

        this.$nextBtn.prop("disabled", !is_valid);
        if (is_valid) {
            this.$nextBtn.removeClass("hidden bg-yellow-300").addClass("bg-yellow-200 hover:bg-yellow-400");
        } else {
            this.$nextBtn.removeClass("bg-yellow-200 hover:bg-yellow-400").addClass("bg-yellow-300");
        }
    },

    render_categories(categories) {
        this.$category_list.empty();

        Object.entries(categories).forEach(([category_name, restaurants]) => {
            const $category_btn = $('<button>')
                .attr('type', 'button')
                .addClass('category-btn bg-yellow-200 hover:bg-yellow-300 font-bold py-1 px-2 rounded-full transition-colors duration-200')
                .attr('data-category-id', category_name)
                .text(category_name);

            console.log('카테고리 렌더링:', category_name);
            this.$category_list.append($category_btn);
        });
    },

    validate_form() {
        const user_pw_match = this.$userPw.val() === this.$userPw2.val();
        let error_messages = [];

        if (!user_pw_match) error_messages.push("비밀번호가 일치하지 않습니다.");
        if (!this.user_id_checked) error_messages.push("아이디 중복 체크를 완료해주세요.");
        if (!this.nickname_checked) error_messages.push("닉네임 중복 체크를 완료해주세요.");

        return error_messages;
    },

    async check_duplicate(type) {
        const $checkButton = $(`#${type}_check`);
        $checkButton.prop('disabled', true).addClass('opacity-50 cursor-not-allowed');
        const value = this[`$${type}`].val();
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
                type === 'userId' ? this.user_id_checked = true : this.nickname_checked = true;
            } else if (response === 1) {
                this.update_validation_state(type, false, `이미 사용 중인 ${type === 'userId' ? '아이디' : '닉네임'}입니다.`);
                type === 'userId' ? this.user_id_checked = false : this.nickname_checked = false;
            }
            this.update_next_button();
        } catch (error) {
            console.error('중복 체크 실패:', error);
            this.update_validation_state(type, false, '중복 체크 중 오류가 발생했습니다. 다시 시도해주세요.');
        } finally {
            $checkButton.prop('disabled', false).removeClass('opacity-50 cursor-not-allowed');
        }
    },

    update_validation_state(type, is_valid, message) {
        const $input = $(`#${type}`);
        const $checkButton = $(`#${type}_check`);
        const $icon = $input.siblings('.validation-icon');
        const $message = $(`#${type}Message`);

        $checkButton.fadeOut(100, function() {
            $icon.removeClass('text-red-500 text-green-500')
                .addClass(is_valid ? 'text-green-500' : 'text-red-500')
                .html(is_valid ? '&#10004;' : '&#10008;');

            $message.removeClass('text-red-500 text-green-500 hidden')
                .addClass(is_valid ? 'text-green-300 text-sm' : 'text-red-400 text-sm')
                .text(message)
                .fadeIn(200);
        });

        $checkButton.prop('disabled', true).addClass('opacity-50 cursor-not-allowed').hide();
    },

    onInputChange(type) {
        const $input = this[`$${type}`];
        const $checkButton = $(`#${type}_check`);
        const $icon = $input.siblings('.validation-icon');
        const $message = $(`#${type}Message`);

        $message.fadeOut(300);
        $icon.removeClass('text-red-500 text-green-500').html('');
        $checkButton.fadeIn(300).prop('disabled', false).removeClass('opacity-50 cursor-not-allowed');

        if (type === 'userId') {
            this.user_id_checked = false;
        } else {
            this.nickname_checked = false;
        }

        this.update_next_button();
    },

    onPasswordInput() {
        const password = this.$userPw.val();
        if (password.length >= 2) {
            this.$userPwIcon.removeClass('text-red-300 text-sm').addClass('text-green-300 text-sm').html('&#10004;');
        } else {
            this.$userPwIcon.removeClass('text-green-300 text-sm').addClass('text-red-300 text-sm').html('&#10008;');
        }
        this.onPasswordConfirmInput();
        this.update_next_button();
    },

    onPasswordConfirmInput() {
        const password = this.$userPw.val();
        const confirm_password = this.$userPw2.val();
        if (password === confirm_password && password.length >= 2) {
            this.$userPw2Icon.removeClass('text-red-500').addClass('text-green-500').html('&#10004;');
        } else {
            this.$userPw2Icon.removeClass('text-green-500').addClass('text-red-500').html('&#10008;');
        }
        this.update_next_button();
    },

    onBackBtnClick() {
        $(".form-container > div").css("transform", "translateX(0)");
        this.$step_indicator.text("1 / 2");
        this.$nextBtn.text("다음").removeClass("bg-yellow-500 hover:bg-yellow-600").addClass("bg-yellow-200 hover:bg-yellow-500");
        this.$backBtn.addClass("hidden");
        this.current_step = 1;
        this.update_next_button();
    },


    onNextBtnClick() {
        if (this.current_step === 1) {
            const error_messages = this.validate_form();
            if (error_messages.length === 0) {
                $(".form-container > div").css("transform", "translateX(-50%)");
                this.$step_indicator.text("2 / 2");
                this.$nextBtn.text("회원가입").removeClass("bg-yellow-500 hover:bg-yellow-600").addClass("bg-yellow-200 hover:bg-yellow-500");
                this.$backBtn.removeClass("hidden");
                this.current_step = 2;
            } else {
                this.$nextButtonMessage.html(error_messages.join("<br>")).removeClass("hidden");
            }
        } else {
            if (this.selected_categories >= 3) {
                this.$joinForm.submit();
            } else {
                alert("최소 3개의 카테고리를 선택해주세요.");
            }
        }
        this.update_next_button();
    },

    onCategoryBtnClick(event) {
        event.preventDefault();
        const $this = $(event.currentTarget);
        const category_id = $this.data("category-id");
        const category_name = $this.text();

        console.log('클릭된 카테고리:', category_name, 'ID:', category_id);

        if ($this.hasClass("selected")) {
            $this.removeClass("selected bg-yellow-500").addClass("bg-yellow-200");
            this.selected_categories--;
        } else {
            if (this.selected_categories >= 5) {
                alert("최대 5개의 카테고리 선택할 수 있습니다.");
                console.log('최대 선택 개수 도달');
                return;
            }
            $this.removeClass("bg-yellow-200").addClass("selected bg-yellow-500");
            this.selected_categories++;
        }

        console.log('현재 선택된 카테고리 수:', this.selected_categories);

        this.update_selected_categories();
        this.update_next_button();
    },

    update_selected_categories() {
        this.$selectedCategory.empty();
        this.$hiddenInputs.empty();

        $('.category-btn.selected').each((index, button) => {
            const $button = $(button);
            const category_id = $button.data('category-id');
            const category_name = $button.text();

            const $category_tag = $(`<div class="bg-yellow-300 font-bold py-1 px-2 rounded inline-block m-1">${category_name}</div>`);
            this.$selectedCategory.append($category_tag);
            this.$hiddenInputs.append(`<input type="hidden" name="categoryIds[${index}]" value="${category_id}">`);
        });

        const count_text = `${this.selected_categories}/5 선택됨`;
        console.log("카테고리 담은거: " + count_text);
        const $count_display = $(`<div class="text-sm text-gray-600 mt-2">${count_text}</div>`);
        this.$selectedCategory.append($count_display);

        this.update_next_button();
    },

    async onJoinFormSubmit(e) {
        e.preventDefault();
        if (this.selected_categories < 3) {
            alert("최소 3개의 취향을 선택해 주세요");
            return;
        }

        const user_data = {
            userId: this.$userId.val(),
            userPw: this.$userPw.val(),
            nickname: this.$nickname.val(),
            categoryIds: $('.category-btn.selected').map(function() {
                return $(this).data('category-id');
            }).get()
        };
        try {
            const response = $.ajax({
                url: url_join,
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(user_data)
            });
            console.log('회원 가입 성공, 메인페이지로 유저정보 들고가기??', response);
            window.location.href = "/";
            console.log('회원 가입 성공:', response);
        } catch (error) {
            console.error('회원가입 실패:', error);
            alert("회원가입 실패. 다시 시도해주세요.");
        }
    },
};

$(function() {
    join_page.init();
});