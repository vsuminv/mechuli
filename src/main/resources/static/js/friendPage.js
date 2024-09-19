const FriendPage = {
    init() {
        this.cache_dom();
        this.get_friend_info();
        this.bind_events();
        this.render_friend_info();
    },

    cache_dom() {
        this.$friend_nickname = $("#friend_nickname");
        this.$friend_image = $("#friend_image");
        this.$friend_categories = $("#friend_categories");
        this.$friend_store_container = $("#friend_store_container");
        this.$friend_review_container = $("#friend_review_container");
        this.$prev_store_btn = $("#prev_store_btn");
        this.$next_store_btn = $("#next_store_btn");
        this.$prev_review_btn = $("#prev_review_btn");
        this.$next_review_btn = $("#next_review_btn");
    },

    bind_events() {
        this.$prev_store_btn.on("click", () => this.move_carousel(this.$friend_store_container, "prev"));
        this.$next_store_btn.on("click", () => this.move_carousel(this.$friend_store_container, "next"));
        this.$prev_review_btn.on("click", () => this.move_carousel(this.$friend_review_container, "prev"));
        this.$next_review_btn.on("click", () => this.move_carousel(this.$friend_review_container, "next"));
    },

    async get_friend_info() {
        const urlParams = new URLSearchParams(window.location.search);
        const subscriberId = urlParams.get('subscriberId');
        if (subscriberId) {
            await this.response_my_friend_info(subscriberId);
        } else {
            console.error("구독자 ID가 제공되지 않았습니다.");
        }
    },

    async response_my_friend_info(subscriberId) {
        try {
            const response = await $.ajax({
                url: `${url_subscriptions_subscriber}${subscriberId}`,
                type: 'GET',
                dataType: 'json',
                xhrFields: { withCredentials: true }
            });
            console.log("친구 정보:", response);
            this.render_my_friend_info(response);
        } catch (error) {
            console.error("친구 정보 조회 실패:", error);
        }
    },

    render_my_friend_info(data) {


        this.$friend_nickname.text(data.nickname);
        this.$friend_image.attr("src", data.userImg || "/img/face.png");

        // 카테고리 렌더링
        this.$friend_categories.empty();
        data.categories.forEach(category => {
            const $category = $('<span>').addClass('category-txt selected text-gray-500 font-bold m-1').text('#' + category.name);
            this.$friend_categories.append($category);
        });

        // 맛집 리스트 렌더링
        this.$friend_store_container.empty();
        data.myRestaurantLists.forEach(restaurant => {
            const $store_item = $("<div>").addClass("flex-none w-32 h-32 mr-4 bg-white rounded-lg shadow-md overflow-hidden");
            const $store_img = $("<img>").attr("src", restaurant.imagePath || "/img/된찌.png").attr("alt", restaurant.name).addClass("w-full h-full object-cover");
            $store_item.append($store_img);
            this.$friend_store_container.append($store_item);
        });

        // 리뷰 렌더링
        this.$friend_review_container.empty();
        data.reviewList.forEach(review => {
            const $review_item = $("<div>").addClass("flex-none w-64 h-48 mr-4 bg-white rounded-lg shadow-md p-4");
            const $review_text = $("<p>").text(review.content).addClass("text-sm");
            $review_item.append($review_text);
            this.$friend_review_container.append($review_item);
        });

        this.init_carousel();
    },

    init_carousel() {
        this.$friend_store_container.css("transform", "translateX(0)");
        this.$friend_review_container.css("transform", "translateX(0)");
        this.update_carousel_buttons(this.$friend_store_container);
        this.update_carousel_buttons(this.$friend_review_container);
    },

    move_carousel($container, direction) {
        const item_width = $container.is(this.$friend_store_container) ? 144 : 272;
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

        if ($container.is(this.$friend_store_container)) {
            this.$prev_store_btn.toggle(current_position < 0);
            this.$next_store_btn.toggle(current_position > max_position);
        } else {
            this.$prev_review_btn.toggle(current_position < 0);
            this.$next_review_btn.toggle(current_position > max_position);
        }
    }
};

$(document).ready(function () {
    FriendPage.init();
});