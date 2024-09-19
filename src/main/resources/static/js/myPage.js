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
        this.$friend_search.on("input", this.search_friends.bind(this));

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
            // 새로운 컨테이너 생성
            const $store_wrapper = $("<div>").addClass("flex-none w-32 h-32 mr-4 bg-white rounded-lg shadow-md overflow-hidden");

            // 이미지와 제목을 포함하는 아이템
            const $store_item = $("<div>").addClass("relative w-full h-full bg-gray-200");

            const $star_btn = $("<button>").text("★").addClass("z-10 absolute top-0 right-0 m-2 text-2xl text-yellow-500").attr("id", "myPageStar");
            const $store_img = $("<img>").attr("src", store.restaurantImg || "/img/된찌.png").attr("alt", store.name).addClass("w-full h-full object-cover");

            // 이미지 하단에 오버레이로 나오는 가게 이름
            const $store_title = $("<h2>").text(store.restaurantName || "가게 이름 없음")
                .addClass("absolute bottom-0 left-0 w-full text-center text-white bg-black bg-opacity-50 text-lg font-bold p-1");

            // $store_item에 버튼과 이미지, 제목 추가
            $store_item.append($star_btn, $store_img, $store_title);

            // 최종적으로 $store_wrapper에 $store_item 추가
            $store_wrapper.append($store_item);

            // $store_list_container에 $store_wrapper 추가
            this.$store_list_container.append($store_wrapper);
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
                $item.find('.friend_info_btn').on('click', () => this.go_to_friend_page(subscriber.userIndex));
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
        const search_term = this.$friend_search.val();
        try {
            const response = await $.ajax({
                url: `${url_subscriptions_subscriberList}?nickname=${search_term}`,
                type: 'GET',
                dataType: json,
                xhrFields: { withCredentials: true }
            });
            this.render_my_sub(response);
        } catch (error) {
            console.error("친구 검색 실패:", error);
        }
    },

    go_to_friend_page(userIndex) {
        console.info(userIndex)
        window.location.href = `${url_subscriber}?userIndex=${userIndex}`;
    },
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
    // },

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
