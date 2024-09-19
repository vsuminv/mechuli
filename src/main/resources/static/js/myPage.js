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
    },

    my_events() {
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

    },

    // myState 컨텐츠 요청.. 이거 가져오는거 맞나
    async response_my_state() {
        try {
            const response = await $.ajax({
                url: url_randomCategory,
                type: 'GET',
                dataType: json,
                xhrFields: {withCredentials: true}
            });
            console.info("랜덤으로 뽑은 내 취향의 restaurant :", response);
            this.render_my_state(response);
        } catch (error) {
            console.error("my state tq:", error);
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
                url: url_subscriptions_subscriberList,
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
        this.$user_nickname.text(data.nickname);
        if (data.userImg) {
            this.$user_profile_img.attr('src', data.userImg);
        } else {
            this.$user_profile_img.attr('src', '/img/face.png');
        }

        this.$selected_categories_container.empty();
        data.forEach(category => {
            const $category_txt = $('<dic>')
                .addClass('category-txt selected text-gray-500 font-bold m-1')
                .text('#'+category.name+',')
                .attr('category_id', category.id);
            this.$selected_categories_container.append($category_txt);
        });
    },
    render_my_store_list(data) {
        console.log("my store List에  넣을 데이터. 전부 가져온거", data);
        console.log('myRestaurantListDTOList 통쨰로', data.myRestaurantListDTOList);
        console.log('myReviewDTOList 가져옴?', data.myReviewDTOList.length);
        this.$store_list_container.empty();
        data.myRestaurantListDTOList.forEach(store => {
            const $store_item = $("<div>").addClass("flex-none  w-32 h-32 mr-4 bg-white rounded-lg shadow-md overflow-hidden");
            const $star_btn = $("<button>").text("★").addClass("z-10 absolute m-2 text-yellow-500");
            const $store_img = $("<img>").attr("src", store.imagePath || "/img/된찌.png").attr("alt", store.name).addClass("w-full h-full object-cover");
            $store_item.append($star_btn, $store_img);
            this.$store_list_container.append($store_item);
        });
        this.$review_container.empty();
        data.myReviewDTOList.forEach(review => {
            const $review_item = $("<div>").addClass("flex-none w-64 h-48 mr-4 bg-white rounded-lg shadow-lg p-4");
            const $restaurant_name = $("<h2>").text(review.restaurantName || "가게 이름 없음").addClass("text-lg font-bold");
            $review_item.append($restaurant_name);
            const $review_text = $("<p>").text(review.content).addClass("text-sm");
            $review_item.append($review_text);
            $review_item.on("click", () => this.open_review_modal(review.restaurantId, review.restaurantName, review.content));
            this.$review_container.append($review_item);
        });
        console.log("review_item 타입 확인용", data.myReviewDTOList); //<p>로 때려박으면 될 듯

        this.init_carousel();
    },

    render_my_sub(data) {
        const $friendList = $("#friendList");
        const $noFriends = $("#noFriends");

        // 기존 친구 목록 비우기
        this.$friend_list.empty();
        $noFriends.addClass('hidden');

        // 친구 아이템 템플릿을 생성
        const $template = $('<li class="friend-item flex items-center justify-between bg-white p-4 rounded-lg shadow mb-2 hidden">' +
            '<div class="flex items-center space-x-3">' +
            '<div class="profile w-8 h-8 bg-yellow-200 rounded-full flex items-center justify-center overflow-hidden">' +
            '<img class="w-full h-full object-cover" src="" alt="">' +
            '<span class="initial text-xl font-bold text-yellow-800"></span>' +
            '</div>' +
            '<span class="nickname text-sm font-semibold"></span>' +
            '</div>' +
            '<button class="friend_info_btn bg-red-50 hover:bg-yellow-100 font-bold py-1 px-1 rounded text-xs">정보보기</button>' +
            '</li>');

        // 친구 목록이 비어 있음을 확인
        if (Array.isArray(data) && data.length > 0) {
            data.forEach(subscriber => {
                const $item = $template.clone().removeClass('hidden');

                const formattedNickname = subscriber.nickname.charAt(0).toUpperCase() + subscriber.nickname.slice(1);
                $item.find('.nickname').text(formattedNickname);

                if (subscriber.userImg) {
                    $item.find('img').attr('src', subscriber.userImg).attr('alt', formattedNickname).show();
                    $item.find('.initial').hide();
                } else {
                    $item.find('img').hide();
                    $item.find('.initial').text(formattedNickname.charAt(0)).show();
                }

                $item.find('.friend_info_btn').on('click', () => this.go_to_friend_page(subscriber.subscriberIndex));
                this.$friend_list.append($item);
                $friendList.append($item); // 목록에 추가
            });
        } else {
            $noFriends.removeClass('hidden'); // 친구가 없으면 메시지 표시
        }
    }

    ,
    init_carousel() {
        this.$store_list_container.css("transform", "translateX(0)");
        this.$review_container.css("transform", "translateX(0)");
        this.update_carousel_buttons(this.$store_list_container);
        this.update_carousel_buttons(this.$review_container);
    },
    move_carousel($container, direction) {
        const item_width = $container.is(this.$store_list_container) ? 144 : 272;
        const current_position = parseInt($container.css("transform").split(",")[4] || 0);
        const container_width = $container.width();
        const scroll_width = $container[0].scrollWidth;
        const max_position = -(scroll_width - container_width);

        let new_position;
        if (direction === "prev") {
            new_position = Math.min(current_position + item_width, 0);
        } else {
            new_position = Math.max(current_position - item_width, max_position);
        }

        $container.css("transform", `translateX(${new_position}px)`);

        this.update_carousel_buttons($container);
    },
    update_carousel_buttons($container) {
        const current_position = parseInt($container.css("transform").split(",")[4] || 0);
        const container_width = $container.width();
        const scroll_width = $container[0].scrollWidth;
        const max_position = -(scroll_width - container_width);

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
        } else if(search_term === undefined) {
            console.log("search_term이 undefined입니다.");
            return; // 함수를 종료
        }

        try {
            const response = await $.ajax({
                url: `${url_subscriptions_search}?nickname=${search_term}`,
                type: 'GET',
                dataType: 'json',
                xhrFields: { withCredentials: true }
            });

            // 응답이 undefined인지 확인
            if (response === undefined) {
                // throw new Error("서버에서 응답을 받지 못했습니다."); // 강제로 에러 발생
                console.log("서버에서 응답 받지 못했습니다.")
                return;
            }
            // console.log(response);
            // this.render_my_sub(response);
            ajaxResponse = response;
        } catch (error) {
            console.error("친구 검색 실패:", error);
            // 사용자에게 에러 메시지 표시
            alert("친구 검색 중 문제가 발생했습니다.");
            return;
        }
        if(ajaxResponse!=null) {
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
        $("#review_modal_link").attr("href",review_modal_link);
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
};
$(document).ready(function () {
    MyPage.init();
});
