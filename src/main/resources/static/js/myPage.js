// back에 authedUser 설정 임시방편
let authed_test = {
    userIndex: 14,
    userId: "test1111",
    userPw: "testbb",
    userName: "하이용17"
};
const MyPage = {
    init() {
        this.my_page();
        this.my_events();
        this.init_carousel();
        this.my_contents("#my_state_fragment");
        this.response_my_state();
        this.response_my_store_list();
        this.response_my_sub();

        this.my_btn_style(this.$my_state_btn);


    },
    my_page() {
        this.$my_state_fragment = $("#my_state_fragment");
        this.$my_store_list_fragment = $("#my_store_list_fragment");
        this.$my_sub_fragment = $("#my_sub_fragment");

        this.$my_state_btn = $("#my_state_btn");
        this.$my_store_list_btn = $("#my_store_list_btn");
        this.$my_sub_btn = $("#my_sub_btn");

        this.$user_profile_img = $("#user_profile_img");
        this.$user_nickname = $("#user_nickname");
        //////////////////
        this.$userPw = $("#userPw");
        this.$userPw2 = $("#userPw2");
        this.$userPwIcon = this.$userPw.siblings('.validation-icon');
        this.$userPw2Icon = this.$userPw2.siblings('.validation-icon');
        ///////////////////
        this.$selected_categories_container = $("#selected_categories_container");
        this.$store_list_container = $("#store_list_container");
        this.$review_container = $("#review_container");
        this.$my_friend_list = $("#my_friend_list");

        this.$friend_search = $("#friendSearch");
        console.log(this.$friend_search)
        this.$friend_list = $("#friendList");
        this.$no_friends = $("#noFriends");

        this.$review_modal = $("#review_modal");
        this.$review_modal_content = $("#review_modal_content");
        this.$close_review_modal = $("#close_review_modal");

        this.$cancel_update_btn = $("#cancel_update_btn");


        this.$prev_store_btn = $("#prev_btn");
        this.$next_store_btn = $("#next_btn");
        this.$prev_review_btn = $("#prev_review_btn");
        this.$next_review_btn = $("#next_review_btn");

        // this.$my_search = $("#on_my_search");
        this.$myCategoryNum = 0;
        // this.$categorySection = $("[category-id]");

        this.$withdraw_btn = $("#withdraw_btn");

        this.$update_btn = $("#update_btn");

        this.$update_img_file = $("#update_img_file");

        this.$selectedCategoryIds = [];
    },

    my_events() {
        ////////////////////
        this.$userPw.on('input', this.onPasswordInput.bind(this));
        this.$userPw2.on('input', this.onPasswordConfirmInput.bind(this));
        ////////////////////
        this.$my_state_btn.on("click", this.on_my_state_btn_click.bind(this));
        this.$my_store_list_btn.on("click", this.on_my_store_list_btn_click.bind(this));
        this.$my_sub_btn.on("click", this.on_my_sub_btn_click.bind(this));
        this.$close_review_modal.on("click", this.close_review_modal.bind(this));
        // this.$update_user_btn.on("click", this.on_update_user_btn_click.bind(this));
        // this.$confirm_password_form.on("submit", this.on_confirm_password_form_submit.bind(this));
        // this.$cancel_confirm_btn.on("click", this.on_cancel_confirm_btn_click.bind(this));
        // this.$save_user_info_btn.on("click", this.on_save_user_info_btn_click.bind(this));
        // this.$cancel_update_btn.on("click", this.on_cancel_update_btn_click.bind(this));


        this.$prev_store_btn.on("click", () => this.move_carousel(this.$store_list_container, "prev"));
        this.$next_store_btn.on("click", () => this.move_carousel(this.$store_list_container, "next"));
        this.$prev_review_btn.on("click", () => this.move_carousel(this.$review_container, "prev"));
        this.$next_review_btn.on("click", () => this.move_carousel(this.$review_container, "next"));
        // this.$friend_search.on("input", this.search_friends.bind(this));
        // 엔터 키 이벤트 리스너
        this.$friend_search.on("keydown", (event) => {
            if (event.key === "Enter") {
                this.search_friends();
            }
        });

        this.$withdraw_btn.on("click", (event) => this.withdraw_mechuli(event));
        this.$update_btn.on("click", () => this.submit_update())},

    // myState 컨텐츠 요청.
    async response_my_state() {
        try {
            const response = await $.ajax({
                url: '/auth/myPage',
                type: 'POST',
                // dataType: json,
                xhrFields: {withCredentials: true}
            });
            this.render_my_state(response);
        } catch (error) {
            console.error("my state: ", error);
        }
    },
    // myStore 컨텐츠 요청
    async response_my_store_list() {
        try {
            const response = await $.ajax({
                url: url_api_myPage_myLists,
                type: 'POST',
                dataType: json,
                contentType: 'application/json',
                data: JSON.stringify({}),
                xhrFields: {withCredentials: true}
            });
            console.info("맛집 리스트 다 가져온거:", response);
            this.render_my_store_list(response);
        } catch (error) {
            console.error("맛집 리스트 못가져옴:", error);
        }
    },
    // mySub 컨텐츠 요청
    async response_my_sub() {
        try {
            const response = await $.ajax({
                url: '/subscriptions/subscriberList',
                type: 'GET',
                dataType: json,
                xhrFields: {withCredentials: true}
            });
            console.log("구독 리스트 요청한거 :", response);
            this.render_my_sub(response);
        } catch (error) {
            console.error("구독리스트 데이터 가공 실패. render_my_sub() 함수에서 에러", error);
        }
    },
    render_my_state(data) {
        console.log(data);
        this.$user_nickname.text(data.nickname);
        if (data.userImg) {
            this.$user_profile_img.attr('src', data.userImg);
        } else {
            this.$user_profile_img.attr('src', '/img/mechuri_logo.png');
        }

        // 전체 카테고리 값 가져오기

        // 카테고리들 중 선택된 카테고리들은 배경색 바꾸기
        this.fetchCategories(data.restaurantCategories);

        // this.$selected_categories_container.empty();
        // data.restaurantCategories.forEach(category => {
        //     const $category_txt = $('<div>')
        //         .addClass('category-txt selected text-gray-500 font-bold m-1')
        //         .text(category.categoryName)
        //         .attr('category_id', category.categoryId);
        //     this.$selected_categories_container.append($category_txt);
        // });
    },

    // 처음에 데이터를 불러올 때, 리뷰 리스트와 맛집 리스트를 저장
    render_my_store_list(data) {
        this.myRestaurantListDTOList = data.myRestaurantListDTOList;  // 맛집 리스트 저장
        this.myReviewDTOList = data.myReviewDTOList;  // 리뷰 리스트 저장
        console.log("my store List에 넣을 데이터. 전부 가져온거", data);
        console.log('myRestaurantListDTOList 통째로', this.myRestaurantListDTOList);
        console.log('myReviewDTOList 가져옴?', this.myReviewDTOList);

        // 맛집 리스트 렌더링
        this.render_store_list();

        // 리뷰 리스트 렌더링
        this.render_review_list();

        this.init_carousel();
    },

    // 맛집 리스트만 렌더링하는 함수
    render_store_list() {
        this.$store_list_container.empty();
        this.myRestaurantListDTOList.forEach(store => {
            const $store_wrapper = $("<div>").addClass("flex-none w-32 h-32 mr-4 bg-white rounded-lg shadow-md overflow-hidden");
            const $store_item = $("<div>").addClass("relative w-full h-full bg-gray-200");
            const $star_btn = $("<button>").text("★").addClass("absolute top-0 right-0 m-2 text-yellow-500")
                .attr("id", "myPageStar-" + store.restaurant_id)
                .on("click", () => this.handleStarClick(store.restaurant_id));  // 클릭 이벤트 등록
            const $store_img = $("<img>").attr("src", store.restaurantImg || "/img/된찌.png").attr("alt", store.restaurantName).addClass("w-full h-full object-cover");
            const $store_title = $("<h2>").text(store.restaurantName || "가게 이름 없음")
                .addClass("absolute bottom-0 left-0 w-full text-center text-white bg-black bg-opacity-50 text-lg font-bold p-1");

            $store_item.append($star_btn, $store_img, $store_title);
            $store_wrapper.append($store_item);
            this.$store_list_container.append($store_wrapper);
        });
    },

    // 리뷰 리스트만 렌더링하는 함수
    render_review_list() {
        this.$review_container.empty();
        this.myReviewDTOList.forEach(review => {
            const $review_item = $("<div>").addClass("flex-none w-64 h-48 mr-4 bg-white rounded-lg shadow-lg p-4");
            const $restaurant_name = $("<h2>").text(review.restaurantName || "가게 이름 없음").addClass("text-lg font-bold");
            $review_item.append($restaurant_name);
            const $review_text = $("<p>").text(review.content).addClass("text-sm");
            $review_item.append($review_text);
            $review_item.on("click", () => this.open_review_modal(review.restaurantId, review.restaurantName, review.content));
            this.$review_container.append($review_item);
        });
    },

    // 찜 해제 후에도 리뷰 리스트는 변경하지 않음
    handleStarClick(restaurantId) {
        const confirmUnfavorite = confirm("정말로 이 맛집을 찜 해제하시겠습니까?");
        if (!confirmUnfavorite) return;

        $.ajax({
            url: `/api/ajax/DoMyRestaurant`,  // 찜/해제 API 엔드포인트
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({restaurant_id: restaurantId}),
            success: (result) => {
                if (result === 0) {
                    alert("찜 해제가 완료되었습니다.");

                    // UI에서 해당 가게를 실시간으로 삭제
                    $(`#myPageStar-${restaurantId}`).closest(".w-32").remove();  // 해당 가게의 HTML 요소를 삭제

                    // 찜 해제 성공 시 리스트에서 해당 가게 삭제
                    this.myRestaurantListDTOList = this.myRestaurantListDTOList.filter(store => store.restaurantId !== restaurantId);
                } else if (result === 1) {
                    alert("찜이 추가되었습니다.");
                }
            },
            error: (error) => {
                console.error("찜/해제 실패:", error);
                alert("서버 오류로 인해 요청이 실패했습니다.");
            }
        });
    },

    render_my_sub(data) {
        const $friendList = $("#friendList");
        const $template = $friendList.find('.friend-item').first();
        const $noFriends = $("#noFriends");
        this.$friend_list.empty();
        this.$no_friends.addClass('hidden');

        $friendList.find('.friend-item:not(:first)').remove();
        $noFriends.addClass('hidden');

        if (Array.isArray(data) && data.length > 0) {
            data.forEach(subscriber => {
                const $item = $template.clone().removeClass('hidden');
                const formattedNickname = subscriber.nickName.charAt(0).toUpperCase() + subscriber.nickName.slice(1);
                $item.find('.nickname').text(formattedNickname);
                if (subscriber.userImg) {
                    $item.find('img').attr('src', subscriber.userImg).attr('alt', formattedNickname).show();
                    $item.find('.initial').hide();
                } else {
                    $item.find('img').hide();
                    $item.find('.initial').text(formattedNickname.charAt(0)).show();
                }
                $item.find('.nickname').text(subscriber.nickName);
                $item.find('.friend_info_btn').on('click', () => this.go_to_friend_page(subscriber.subscriberIndex));
                this.$friend_list.append($item);
                $friendList.append($item);
            });
        } else {
            $noFriends.removeClass('hidden');
        }
    },
    init_carousel() {
        this.$store_list_container.css("transform", "translateX(0)");
        this.$review_container.css("transform", "translateX(0)");
        this.update_carousel_buttons(this.$store_list_container);
        this.update_carousel_buttons(this.$review_container);
    },
    move_carousel($container, direction) {
        const item_width = $container.is(this.$store_list_container) ? 144 : 272;
        let current_position = parseInt($container.css("transform").split(",")[4] || 0);
        const container_width = $container.width();
        const scroll_width = $container[0].scrollWidth;
        const max_position = container_width - scroll_width;

        let new_position;
        if (direction === "prev") {
            new_position = Math.min(current_position + item_width, 0);
        } else {
            new_position = Math.max(current_position - item_width, max_position);
        }

        $container.css("transform", `translateX(${new_position}px)`);

        current_position = new_position;

        this.update_carousel_buttons($container);
    },

    update_carousel_buttons($container) {
        const current_position = parseInt($container.css("transform").split(",")[4] || 0);
        const container_width = $container.width();
        const scroll_width = $container[0].scrollWidth;
        const max_position = container_width - scroll_width;

        console.log("current_position: ", current_position);
        console.log("max_position: ", max_position);

        if ($container.is(this.$store_list_container)) {
            this.$prev_store_btn.toggle(current_position < 0);
            this.$next_store_btn.toggle(current_position > max_position);
        } else {
            this.$prev_review_btn.toggle(current_position < 0);
            this.$next_review_btn.toggle(current_position > max_position);
        }
    },

    async search_friends() {
        // const search_term = this.$friend_search.val();
        const search_term = this.$friend_search.val() || ""; // 기본값으로 빈 문자열 설정
        let ajaxResponse = null;
        // 검증 추가: 검색어가 비어 있는지 확인
        if (search_term.trim() === "") {
            console.log("검색어가 비어 있습니다.");
            alert("검색어를 입력해 주세요."); // 사용자에게 알림
            return; // 요청을 하지 않고 함수 종료
        } else if (search_term === undefined) {
            console.log("search_term이 undefined입니다.");
            return; // 함수를 종료
        }

        try {
            const response = await $.ajax({
                url: `${url_subscriptions_search}?nickname=${search_term}`,
                type: 'GET',
                dataType: 'json',
                xhrFields: {withCredentials: true}
            });

            // 응답이 undefined인지 확인
            if (response === undefined) {
                // throw new Error("서버에서 응답을 받지 못했습니다."); // 강제로 에러 발생
                console.log("서버에서 응답 받지 못했습니다.")
                return;
            }
            console.log(response);
            // this.render_my_sub(response);
            ajaxResponse = response;
        } catch (error) {
            console.error("친구 검색 실패:", error);
            // 사용자에게 에러 메시지 표시
            alert("친구 검색 중 문제가 발생했습니다.");
            return;
        }
        if (ajaxResponse != null) {
            this.render_my_sub(ajaxResponse);
        }

    },

    go_to_friend_page(subscriberIndex) {
        console.info(subscriberIndex)
        window.location.href = `/friendPage?subscriberId=${subscriberIndex}`;
        // go_to_friend_page(userIndex) {
        //     console.info(userIndex)
        //     try {
        //         const friend_user_index = $.ajax({
        //             url: `${url_subscriber}${userIndex}`,
        //             type: 'GET',
        //             dataType: json,
        //             xhrFields: { withCredentials: true }
        //         });
        //     } catch (error) {
        //         console.error("친구 페이지로 이동 실패:", error);
        //     }
    },

    async unsubscribe(subscriberId) {
        try {
            await $.ajax({
                url: `${url_subscriptions_subscriber}${subscriberId}`,
                type: 'DELETE',
                xhrFields: {withCredentials: true}
            });
            console.info("구취 성공");
            console.log("취소한거. id 잘 맞는지?", subscriberId)
            this.response_my_sub();
        } catch (error) {
            console.error("구취 실패 사유", error)
        }
    },

    my_contents(selector) {
        this.$my_state_fragment.addClass("hidden");
        this.$my_store_list_fragment.addClass("hidden");
        this.$my_sub_fragment.addClass("hidden");
        $(selector).removeClass("hidden");
    },
    my_btn_style($clicked_button) {
        this.$my_state_btn.removeClass("bg-yellow-500").addClass("bg-yellow-200");
        this.$my_store_list_btn.removeClass("bg-yellow-500").addClass("bg-yellow-200");
        this.$my_sub_btn.removeClass("bg-yellow-500").addClass("bg-yellow-200");
        $clicked_button.removeClass("bg-yellow-200").addClass("bg-yellow-500");
    },
    // on_update_user_btn_click() {
    //     this.$cancel_update_btn;
    // },
    // onUpdateUserBtnClick() {
    //     this.$confirmPasswordModal.removeClass("hidden");
    // },
    on_my_state_btn_click() {
        this.my_contents("#my_state_fragment");
        this.my_btn_style(this.$my_state_btn);
    },
    on_my_store_list_btn_click() {
        this.my_contents("#my_store_list_fragment");
        this.my_btn_style(this.$my_store_list_btn);
        this.response_my_store_list();
    },
    on_my_sub_btn_click() {
        this.my_contents("#my_sub_fragment");
        this.my_btn_style(this.$my_sub_btn);
        this.response_my_sub();
    },
    open_review_modal(store_id, store_name, content) {
        const review_modal_link = `boardPage?restaurantId=${store_id}`;
        $("#review_modal_link").text(`${store_name}`);
        $("#review_modal_link").attr("href", review_modal_link);
        this.$review_modal_content.text(content);
        this.$review_modal.removeClass("hidden");
    },

    close_review_modal() {
        this.$review_modal.addClass("hidden");
    },
    // on_my_search() {
    //     const searchTerm = this.$my_search.val().toLowerCase();
    //     this.$my_friend_list.find("li").each(function () {
    //         const friendName = $(this).find(".text-lg").text().toLowerCase();
    //         $(this).toggle(friendName.includes(searchTerm));
    //     });
    // },

    /////////////////////////////////////
    validatePassword(password) {
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,12}$/;
        return passwordRegex.test(password);
    },

    onPasswordInput() {
        const password = this.$userPw.val();
        console.log("Password input: ", password);

        if (this.validatePassword(password)) {
            this.$userPwIcon.removeClass('text-red-500').addClass('text-green-500').html('&#10004;');
        } else {
            this.$userPwIcon.removeClass('text-green-500').addClass('text-red-500').html('&#10008;');
        }
    },

    onPasswordConfirmInput() {
        const password = this.$userPw.val();
        const passwordConfirm = this.$userPw2.val();

        if (password === passwordConfirm && this.validatePassword(password)) {
            this.$userPw2Icon.removeClass('text-red-500').addClass('text-green-500').html('&#10004;');
        } else {
            this.$userPw2Icon.removeClass('text-green-500').addClass('text-red-500').html('&#10008;');
        }
    },

    fetchCategories: function (myCategories) {
        $.ajax({
            url: '/api/categoryAll',
            method: 'GET',
            dataType: 'json',
            success: (data) => {
                console.log("카테고리 데이터:", data); // 데이터 구조 확인
                this.displayCategories(data, myCategories);
                // this.displaySelectedCategories(data);
            },
            error: (xhr, status, error) => {
                console.error('Error fetching main category data:', error);
            }
        });
    },

    displayCategories: function (allCategories, myCategories) {
        const $container = $('#category-list-container').addClass('gap-2').attr('id', 'category-container');

        if (typeof allCategories === 'object' && Array.isArray(allCategories)) {
            // Object.keys(allCategories).forEach((categoryData) => {
            allCategories.forEach((categoryData) => {
                const $section = $('<div>').addClass('bg-[#e5e5e5] h-12 w-full rounded-xl flex flex-col items-center justify-center')
                    .attr('category-id', categoryData.categoryId);
                const $categoryList = $('<h1>').text(categoryData.categoryName).addClass('text-center text-xl');

                $section.append($categoryList);

                $section.on('click', (event) => this.checkIsOverMaxCategory(event));

                $container.append($section);
            });
        } else {
            console.error('전체 카테고리 관련 데이터 형식이 올바르지 않습니다.');
        }

        if (typeof myCategories === 'object' && Array.isArray(myCategories)) {
            console.log("myCategories: ", myCategories);
            myCategories.forEach((myCategoryData) => {
                const categoryIdValue = myCategoryData.categoryId; // 원하는 category-id 값
                const $targetSection = $(`[category-id=${categoryIdValue}]`);
                $targetSection.removeClass('bg-[#e5e5e5]').addClass('bg-[#FFDD33]');
                this.$myCategoryNum++;
                this.$selectedCategoryIds.push(categoryIdValue); // ID를 배열에 추가
            });
        } else {
            console.error('내 카테고리 관련 데이터 형식이 올바르지 않습니다.')
        }
    },

    checkIsOverMaxCategory: function (event) {
        if (this.$myCategoryNum >= 5 && $(event.currentTarget).hasClass('bg-[#e5e5e5]')) {
            alert("선호 취향은 3~5개 고를 수 있습니다.");
            return false;
        } else {
            this.toggleCategoryBtn(event);
        }
    },

    toggleCategoryBtn: function (event) {
        const $section = $(event.currentTarget); // 클릭한 섹션을 선택
        const categoryId = parseInt($section.attr('category-id'), 10);

        if ($section.hasClass('bg-[#e5e5e5]')) {
            $section.removeClass('bg-[#e5e5e5]').addClass('bg-[#FFDD33]');
            this.$myCategoryNum++;
            this.$selectedCategoryIds.push(categoryId); // ID를 배열에 추가
        } else if ($section.hasClass('bg-[#FFDD33]')) {
            $section.removeClass('bg-[#FFDD33]').addClass('bg-[#e5e5e5]');
            this.$myCategoryNum--;
            this.$selectedCategoryIds = this.$selectedCategoryIds.filter(id => id !== categoryId); // ID를 배열에서 제거
        }
    },

    withdraw_mechuli: function (event) {
        event.preventDefault();
        if (confirm("정말로 회원 탈퇴를 하시겠습니까?\n이 작업은 되돌릴 수 없습니다!")) {
            $.ajax({
                url: '/auth/deactivate', // 탈퇴 처리 URL
                type: 'POST', // 요청 방식
                success: function (response) {
                    alert("회원 탈퇴가 완료되었습니다.");
                    // 필요에 따라 페이지 리다이렉트
                    window.location.href = '/logout';
                },
                error: function () {
                    alert("탈퇴 처리 중 오류가 발생했습니다.");
                }
            });
        } else {
            alert("회원 탈퇴가 취소되었습니다.");
        }
    },

    checkValidPwd() {
        const password = this.$userPw.val();
        const passwordConfirm = this.$userPw2.val();
        return password === passwordConfirm && this.validatePassword(password);
    },

    checkUserPwd() {
        // ajax post 요청으로 비밀번호 입력받은 거 띄우기
    },

    submit_update: function () {
        // 업데이트 전 비밀번호 재확인 함수
        // -> return true 시 아래 진행 아니면 비밀번호가 일치하지 않습니다 다시 시도하세요 alert와 함께 종료

        // FormData 객체 생성
        let formData = new FormData();

        // 수정할 사용자 정보 (예: 이름, 이메일 등)를 추가
        let userData = {
            categoryIds: this.$selectedCategoryIds
        };

        if(this.checkValidPwd()) {
            userData.userPw = this.$userPw.val();
        }

        if(this.$selectedCategoryIds.length > 5 || this.$selectedCategoryIds.length < 3) {
            alert("선호 취향은 3~5개 선택해야 합니다.");
            return;
        }


        console.log("userData: ", userData);

        // UserDTO 객체를 FormData에 추가
        formData.append("updateRequest", new Blob([JSON.stringify(userData)], { type: "application/json" }));

        // 파일 추가 (선택적)
        let fileInput = $("#update_img_file")[0]; // <input type="file" id="fileInput">
        if (fileInput.files.length > 0) {
            formData.append("file", fileInput.files[0]);
        }

        if (confirm("회원 정보를 수정하시겠습니까?")) {

            $.ajax({
                url: '/updateUpdate', // 탈퇴 처리 URL
                type: 'PUT', // 요청 방식
                data: formData,
                contentType: false, // 기본 Content-Type을 false로 설정
                processData: false, // jQuery가 데이터 처리를 하지 않도록 설정

                success: function (response) {
                    alert("회원 정보 수정이 완료되었습니다.");
                    // 필요에 따라 페이지 리다이렉트
                    window.location.href = '/';
                },
                error: function () {
                    alert("회원 정보 수정 실행 중 오류가 발생했습니다.");
                }
            });
        } else {
            alert("회원 정보 수정이 취소되었습니다.");
        }
    }
};
$(document).ready(function () {
    MyPage.init();

});
