const friendPage = {
    init() {
        // this.my_page();
        // this.my_events();
        // this.my_contents("#my_state_fragment");
        // this.response_my_state();
        // this.response_my_store_list();
        // this.response_my_sub();
        //
        // this.my_btn_style(this.$my_state_btn);
        this.friend_page();
        this.friend_events();

        this.check_subscribe_status(this.$subscriberId).then(isSubscribed => {
            if (isSubscribed) {
                $('#my_sub_btn').text('구독 해지'); // 구독 중일 때 텍스트 설정
            } else {
                $('#my_sub_btn').text('구독하기'); // 구독 중이 아닐 때 텍스트 설정
            }
        });

        this.friend_list(this.$subscriberId);
    },

    getSubscriberId: function () {
        // 현재 URL에서 쿼리 문자열 가져오기
        const queryString = window.location.search;

        // 쿼리 문자열을 객체로 변환
        const params = {};

        // 쿼리 문자열을 파싱
        $.each(queryString.slice(1).split('&'), function (index, param) {
            const pair = param.split('=');
            params[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '');
        });

        // subscriberId 값 가져오기
        const subscriberId = params['subscriberId'];

        console.log(subscriberId); // subscriberId 값을 출력
        return subscriberId;
    },

    friend_page: function () {
        // 요소 지정
        this.$friend_profile_img = $("#friend_profile_img");
        // this.$friend_nickname = $("");
        this.$subscriberId = this.getSubscriberId();
        this.$friend_nickname = $(".friend_nickname");

        this.$store_list_container = $("#store_list_container");
        this.$review_container = $("#review_container");

        // 캐러셀 버튼
        this.$prev_store_btn = $("#prev_btn");
        this.$next_store_btn = $("#next_btn");
        this.$prev_review_btn = $("#prev_review_btn");
        this.$next_review_btn = $("#next_review_btn");
    },
    friend_events: function () {
        // addEventListener
        // this.$prev_store_btn.on("click", () => this.move_carousel(this.$store_list_container, "prev"));
        // this.$("#my_sub_btn").on("click", this.change_subscribe_status());
        $("#my_sub_btn").on("click", () => this.change_subscribe_status(this.$subscriberId));

        this.$prev_store_btn.on("click", () => this.move_carousel(this.$store_list_container, "prev"));
        this.$next_store_btn.on("click", () => this.move_carousel(this.$store_list_container, "next"));
        this.$prev_review_btn.on("click", () => this.move_carousel(this.$review_container, "prev"));
        this.$next_review_btn.on("click", () => this.move_carousel(this.$review_container, "next"));
    },
    change_subscribe_status: function (subscriberId) {
        this.check_subscribe_status(subscriberId).then(isSubscribed => {
            if (isSubscribed) {
                this.delete_subscribe(subscriberId);
            } else {
                this.create_subscribe(subscriberId);
            }
        }).catch(error => {
            console.error("구독 상태 확인 중 오류 발생:", error);
            alert("구독 상태 확인 중 오류가 발생했습니다.");
        });
    },
    check_subscribe_status: function (subscriberId) {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: '/subscriptions/checkSubscribing',
                method: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({subscriberId}), // subscriberId를 데이터로 전송
                success: (data) => {
                    console.log('Received Data:', data);
                    resolve(data);
                },
                error: (xhr, status, error) => {
                    console.error('Error fetching subscription status:', error);
                    console.log('Response Text:', xhr.responseText);
                    reject(error);
                }
            });
        });
    },
    create_subscribe: function (subscriberId) {
        $.ajax({
            url: `/subscriptions/subscribe/${subscriberId}`, // URL에 subscriberId 포함
            method: 'POST',
            contentType: 'application/json',
            success: (data) => {
                console.log('Received Data:', data);
                $('#my_sub_btn').text('구독 해지');
            },
            error: (xhr, status, error) => {
                console.error('Error subscribing:', error);
                console.log('Response Text:', xhr.responseText);
            }
        });
    },
    delete_subscribe: function (subscriberId) {
        $.ajax({
            url: `/subscriptions/unsubscribe/${subscriberId}`,
            method: 'POST',
            contentType: 'application/json',
            success: (data) => {
                console.log('Received Data:', data);
                $('#my_sub_btn').text('구독하기');
            },
            error: (xhr, status, error) => {
                console.error('Error subscribing:', error);
                console.log('Response Text:', xhr.responseText);
            }
        });
    },
    friend_list: function(subscriberId) {
        $.ajax({
            url: `/subscriptions/subscriber/${subscriberId}`,
            type: 'GET',
            dataType: 'json',
            contentType: 'application/json',
            xhrFields: { withCredentials: true }
        })
            .done((response) => {
                // console.info("맛집 리스트 다 가져온거:", response);
                this.render_friend_store_list(response);
            })
            .fail((xhr, status, error) => {
                console.error("맛집 리스트 못가져옴:", error);
            });
    },

    render_friend_store_list(data) {
        console.log("friend store List 데이터: ", data);
        this.friendRestaurantList = data.myRestaurantLists;
        this.reviewList = data.reviewList;

        // 친구 프사 수정
        if(data.userImg != null) {
            this.$friend_profile_img.attr("src", data.userImg);
        }

        // 친구 닉네임 넣기
        this.$friend_nickname.text(data.nickname);

        // 맛집 리스트 렌더링
        this.render_store_list();

        // 리뷰 리스트 렌더링
        this.render_review_list();

        ///////////
        // this.init_carousel();
    },

    render_store_list() {
        // 가게 리스트 컨테이너 비우기
        this.$store_list_container.empty();

        this.friendRestaurantList.forEach(store => {
            const $store_wrapper = $("<div>").addClass("flex-none w-32 h-32 mr-4 bg-white rounded-lg shadow-md overflow-hidden");
            const $store_item = $("<div>").addClass("relative w-full h-full bg-gray-200");
            // const $star_btn = $("<button>").text("★").addClass("absolute top-0 right-0 m-2 text-yellow-500")
            //     .attr("id", "myPageStar-" + store.restaurant_id)
            //     .on("click", () => this.handleStarClick(store.restaurant_id));  // 클릭 이벤트 등록
            const $store_img = $("<img>").attr("src", store.imageUrl || "/img/된찌.png").attr("alt", store.name).addClass("w-full h-full object-cover");
            const $store_title = $("<h2>").text(store.name || "가게 이름 없음")
                .addClass("absolute bottom-0 left-0 w-full text-center text-white bg-black bg-opacity-50 text-lg font-bold p-1");

            // $store_item.append($star_btn, $store_img, $store_title);
            $store_item.append($store_img, $store_title);
            $store_wrapper.append($store_item);
            this.$store_list_container.append($store_wrapper);
        });
    },

    render_review_list() {
        this.$review_container.empty();
        this.reviewList.forEach(review => {
            const $review_item = $("<div>").addClass("flex-none w-64 h-48 mr-4 bg-white rounded-lg shadow-lg p-4");
            const $restaurant_name = $("<h2>").text(review.restaurantName || "가게 이름 없음").addClass("text-lg font-bold");
            $review_item.append($restaurant_name);
            const $review_text = $("<p>").text(review.reviewText).addClass("text-sm");
            $review_item.append($review_text);
            // $review_item.on("click", () => this.open_review_modal(review.restaurantId, review.restaurantName, review.reviewText));
            $review_item.on("click", () => this.open_review_modal(review.restaurantName, review.reviewText));
            this.$review_container.append($review_item);
        });


        //////

        // // 리뷰 리스트
        // data.reviewList.forEach(review => {
        //     const $review_item = $("<div>").addClass("flex-none w-64 h-48 mr-4 bg-white rounded-lg shadow-lg p-4");
        //     const $restaurant_name = $("<h2>").text(review.restaurantName || "가게 이름 없음").addClass("text-lg font-bold");
        //     $review_item.append($restaurant_name);
        //     const $review_text = $("<p>").text(review.reviewText).addClass("text-sm");
        //     $review_item.append($review_text);
        //     $review_item.on("click", () => this.open_review_modal(review.restaurantId, review.restaurantName, review.content));
        //     this.$review_container.append($review_item);
        // });
        // console.log("review_item 타입 확인용", data.myReviewDTOList); //<p>로 때려박으면 될 듯

    },

    // init_carousel() {
    //     this.$store_list_container.css("transform", "translateX(0)");
    //     this.$review_container.css("transform", "translateX(0)");
    //     this.update_carousel_buttons(this.$store_list_container);
    //     this.update_carousel_buttons(this.$review_container);
    // },
    move_carousel($container, direction) {
        const item_width = $container.is(this.$store_list_container) ? 144 : 272;
        const current_position = parseInt($container.css("transform").split(",")[4] || 0);
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
        this.update_carousel_buttons($container);
    },

    update_carousel_buttons($container) {
        const current_position = parseInt($container.css("transform").split(",")[4] || 0);
        const container_width = $container.width();
        const scroll_width = $container[0].scrollWidth;
        const max_position = container_width - scroll_width;

        if ($container.is(this.$store_list_container)) {
            this.$prev_store_btn.toggle(current_position < 0);
            this.$next_store_btn.toggle(current_position > max_position);
        } else {
            this.$prev_review_btn.toggle(current_position < 0);
            this.$next_review_btn.toggle(current_position > max_position);
        }
    }


// nav 안의 #my_state_btn을 없애기
// 뒤로가기 버튼 만들기
};
$(document).ready(function () {
    friendPage.init();
});
