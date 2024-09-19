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

    },
    friend_events: function () {
        // addEventListener
        // this.$prev_store_btn.on("click", () => this.move_carousel(this.$store_list_container, "prev"));
        // this.$("#my_sub_btn").on("click", this.change_subscribe_status());
        $("#my_sub_btn").on("click", () => this.change_subscribe_status(this.$subscriberId));
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
    }

// nav 안의 #my_state_btn을 없애기
// 뒤로가기 버튼 만들기
};
$(document).ready(function () {
    friendPage.init();
});
