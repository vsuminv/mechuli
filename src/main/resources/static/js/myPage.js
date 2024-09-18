// back에 authedUser 설정 임시방편
let authed_test = {
    userIndex: 1,
    userId: "c",
    userPw: "c",
    userName: "han"
};
const MyPage = {
    init() {
        this.my_page();
        this.my_events();

        this.my_StoreList_Review();

        this.my_Contents("#myStateFragment");
        this.my_btn_style("#myState_btn");

    },

    my_page() {

        this.$myStateFragment = $("#myStateFragment");
        this.$myStoreListFragment = $("#myStoreListFragment");
        this.$mySubFragment = $("#mySubFragment");

        this.$myStateBtn = $("#myState_btn");
        this.$myStoreListBtn = $("#myStoreList_btn");
        this.$mySubBtn = $("#mySub_btn");

        this.$updateUserBtn = $("#updateUserBtn");
        this.$confirmPasswordModal = $("#confirmPasswordModal");
        this.$confirmPasswordForm = $("#confirmPasswordForm");
        this.$cancelConfirmBtn = $("#cancelConfirmBtn");
        this.$saveUserInfoBtn = $("#saveUserInfoBtn");
        this.$cancelUpdateBtn = $("#cancelUpdateBtn");

        this.$storeListContainer = $("#storeListContainer");
        this.$reviewContainer = $("#reviewContainer");

        this.$prevBtn = $("#prevBtn");
        this.$nextBtn = $("#nextBtn");
        this.$prevReviewBtn = $("#prevReviewBtn");
        this.$nextReviewBtn = $("#nextReviewBtn");

        this.$my_search = $("#onMySearch");
        this.$my_friend_list = $("#my_friend_list");

    },

    my_events() {
        this.$myStateBtn.on("click", this.onMyStateBtnClick.bind(this));
        this.$myStoreListBtn.on("click", this.onMyStoreListBtnClick.bind(this));
        this.$mySubBtn.on("click", this.onMySubBtnClick.bind(this));
        this.$updateUserBtn.on("click", this.onUpdateUserBtnClick.bind(this));
        this.$confirmPasswordForm.on("submit", this.onConfirmPasswordFormSubmit.bind(this));
        this.$cancelConfirmBtn.on("click", this.onCancelConfirmBtnClick.bind(this));
        this.$saveUserInfoBtn.on("click", this.onSaveUserInfoBtnClick.bind(this));
        this.$cancelUpdateBtn.on("click", this.onCancelUpdateBtnClick.bind(this));
        this.$prevBtn.on("click", this.onPrevBtnClick.bind(this));
        this.$nextBtn.on("click", this.onNextBtnClick.bind(this));
        this.$prevReviewBtn.on("click", this.onPrevReviewBtnClick.bind(this));
        this.$nextReviewBtn.on("click", this.onNextReviewBtnClick.bind(this));
        this.$my_search.on("input", this.onMySearch.bind(this));
    },

    my_StoreList_Review() {
        $.ajax({
            url: url_api_myPage_myLists,
            type: "POST",
            contentType: "application/json",
            success: (data) => {
                MyPage.renderStoreList(data.myRestaurantListDTOList);
                MyPage.renderReviews(data.myReviewDTOList);
                console.log('서버 응답:', data);
                console.log('서버 응답 :', data.myRestaurantListDTOList.length);
            },
            error: (xhr, status, error) => {
                console.error('error:', error);
                console.log('서버 응답:', xhr.responseText);
            }
        });
    },

    renderStoreList(storeList) {
        this.$storeListContainer.empty();
        storeList.forEach(store => {
            console.log("storeList 가져는 왔는지 확인" + store);
            const $storeItem = $("<div>").addClass("flex-none w-32 h-32 mr-4 bg-white rounded-lg shadow-md overflow-hidden");
            const $starBtn = $("<button>").text("star").addClass("z-99 absolute mx-20");
            const $storeImg = $("<img>").attr("src", store.imagePath).attr("alt", store.name).addClass("w-full h-full object-cover");

            $storeItem.append($starBtn, $storeImg);
            this.$storeListContainer.append($storeItem);
        });
    },

    renderReviews(reviews) {
        this.$reviewContainer.empty();
        reviews.forEach(review => {
            const $reviewItem = $("<div>").addClass("flex-none w-64 h-48 mr-4 bg-white rounded-lg shadow-md p-4");
            const $reviewText = $("<p>").text(review).addClass("text-sm");

            $reviewItem.append($reviewText);
            this.$reviewContainer.append($reviewItem);
        });
    },

    onMyStateBtnClick() {
        this.my_Contents("#myStateFragment");
        this.my_btn_style(this.$myStateBtn);
    },

    onMyStoreListBtnClick() {
        this.my_Contents("#myStoreListFragment");
        this.my_btn_style(this.$myStoreListBtn);
        this.my_StoreList_Review();
        $.ajax({
            url: url_api_myPage_myLists,
            type: "POST",
            contentType: content_type,
            success: function (data) {
                // 받은 데이터를 사용하여 맛집 리스트와 리뷰를 렌더링
                MyPage.renderStoreList(data.myRestaurantListDTOList);
                MyPage.renderReviews(data.myReviewDTOList);
                console.log("/api/myPage/myLists, 요청 결과" + data)
            },
            error: function (xhr, status, error) {
                console.error("내 맛집 리스트와 리뷰를 가져오는데 실패했습니다:", error);
                console.log("/api/myPage/myLists, 요청 결과" + data.myRestaurantListDTOList)
            }
        });
    },

    // onMyStoreListBtnClick() {
    //     this.my_Contents("#myStoreListFragment");
    //     this.my_btn_style(this.$myStoreListBtn);
    //     this.my_StoreList_Review();
    // },
    onMySubBtnClick() {
        this.my_Contents("#mySubFragment");
        this.my_btn_style(this.$mySubBtn);
        this.my_friends_fetch();
    },
    my_friends_fetch() {
        $.ajax({
            url: url_subscriptions_subscriberList,
            type: "GET",
            contentType: content_type,
            success: function (response) {
                MyPage.renderFriends(response);
                console.log(" 친구 리스트 패치 들옴? length = "+ response.length)
                console.log(" 친구 들온거  " )
            },
            error: function (xhr, status, error) {
                console.error("구독자 목록을 가져오는데 실패했습니다:", error);
            }
        });
    },
    renderFriends(response) {
        this.$my_friend_list.empty();
        response.forEach(friend => {
            const $friendItem = $("<li>").addClass("flex items-center space-x-3 bg-white p-1 rounded-lg shadow");
            const $friendInitial = $("<div>").addClass("w-12 h-12 bg-yellow-200 rounded-full flex items-center justify-center")
                .append($("<span>").addClass("text-xl font-bold text-yellow-800").text(friend.name.charAt(0)));
            const $friendName = $("<span>").addClass("text-lg text-gray-800").text(friend.name);

            $friendItem.append($friendInitial, $friendName);
            this.$my_friend_list.append($friendItem);
        });
    },
    onMySearch() {
        const nickname = this.$my_search.val();
        $.ajax({
            url: url_subscriptions_search,
            type: "GET",
            data: { nickname: nickname },
            contentType: content_type,
            success: function (response) {
                MyPage.renderFriends(response);
                console.log("들온거 "+ response)
                console.log("검색 성공 확인" + MyPage.renderFriends(response))
            },
            error: function (xhr, status, error) {
                console.error("onFriendSearch error :", error);
            }
        });
    },
    my_Contents(selector) {
        this.$myStateFragment.fadeOut(100);
        this.$myStoreListFragment.fadeOut(100);
        this.$mySubFragment.fadeOut(100);
        $(selector).fadeIn();
    },

    my_btn_style($clickedButton) {
        this.$myStateBtn.removeClass("bg-yellow-500").addClass("bg-yellow-200");
        this.$myStoreListBtn.removeClass("bg-yellow-500").addClass("bg-yellow-200");
        this.$mySubBtn.removeClass("bg-yellow-500").addClass("bg-yellow-200");
        $clickedButton.removeClass("bg-yellow-200").addClass("bg-yellow-500");
    },

    onUpdateUserBtnClick() {
        this.$confirmPasswordModal.removeClass("hidden");
    },

    onConfirmPasswordFormSubmit(e) {
        e.preventDefault();

        const currentPassword = $("#currentPassword").val();

        $.ajax({
            url: url_ajax_checkPwd,
            type: "POST",
            // data: JSON.stringify({ currentPassword: currentPassword }),
            data: JSON.stringify({
                authedUser: authed_test,
                userPwd: currentPassword
            }),
            contentType: content_type,
            success: function (result) {
                if (result) {
                    MyPage.$confirmPasswordModal.addClass("hidden");
                    MyPage.showUpdateUserForm();
                } else {
                    alert("비밀번호가 일치하지 않습니다.");
                }
            },
            error: function (xhr, status, error) {
                alert("비밀번호 확인 중 오류가 발생했습니다.");
                console.error(error.responseText);
            }
        });
    },

    showUpdateUserForm() {
        this.$myStateFragment.find("input, select").prop("readonly", false);
        this.$updateUserBtn.hide();
        this.$saveUserInfoBtn.show();
        this.$cancelUpdateBtn.show();
    },

    hideUpdateUserForm() {
        this.$myStateFragment.find("input, select").prop("readonly", true);
        this.$updateUserBtn.show();
        this.$saveUserInfoBtn.hide();
        this.$cancelUpdateBtn.hide();
    },

    onSaveUserInfoBtnClick() {
        const formData = new FormData();
        // formData.append("file", $("#userImg")[0].files[0]);
        formData.append("userPw", $("#newPassword").val());
        // formData.append("categoryIds", selectedCategories.map(category => category.id));

        $.ajax({
            url: url_updateUpdate,
            type: "PUT",
            data: formData,
            processData: false,
            contentType: false,
            success: function (response) {
                alert("회원 정보가 성공적으로 수정되었습니다.");
                console.log("업데이트 성공" + response);
                location.reload();
            },
            error: function (xhr, status, error) {
                alert("회원 정보 수정 중 오류가 발생했습니다.");
                console.error(error);
                console.log("업데이트 실패" + response);
            }
        });
    },

    onCancelConfirmBtnClick() {
        this.$confirmPasswordModal.addClass("hidden");
    },

    onCancelUpdateBtnClick() {
        this.hideUpdateUserForm();
    },

    onPrevBtnClick() {
        const itemWidth = 144; // 32 + 4(mr-4) for store list
        const currentPosition = parseInt(this.$storeListContainer.css("transform").split(",")[4]);
        const newPosition = currentPosition + itemWidth;

        if (newPosition <= 0) {
            this.$storeListContainer.css("transform", `translateX(${newPosition}px)`);
        }
    },

    onNextBtnClick() {
        const itemWidth = 144; // 32 + 4(mr-4) for store list
        const currentPosition = parseInt(this.$storeListContainer.css("transform").split(",")[4]);
        const maxPosition = -(this.$storeListContainer[0].scrollWidth - this.$storeListContainer.width());
        const newPosition = currentPosition - itemWidth;

        if (newPosition >= maxPosition) {
            this.$storeListContainer.css("transform", `translateX(${newPosition}px)`);
        }
    },

    onPrevReviewBtnClick() {
        const itemWidth = 272; // 64 + 4(mr-4) for reviews
        const currentPosition = parseInt(this.$reviewContainer.css("transform").split(",")[4]);
        const newPosition = currentPosition + itemWidth;

        if (newPosition <= 0) {
            this.$reviewContainer.css("transform", `translateX(${newPosition}px)`);
        }
    },

    onNextReviewBtnClick() {
        const itemWidth = 272; // 64 + 4(mr-4) for reviews
        const currentPosition = parseInt(this.$reviewContainer.css("transform").split(",")[4]);
        const maxPosition = -(this.$reviewContainer[0].scrollWidth - this.$reviewContainer.width());
        const newPosition = currentPosition - itemWidth;

        if (newPosition >= maxPosition) {
            this.$reviewContainer.css("transform", `translateX(${newPosition}px)`);
        }
    },
};

$(document).ready(function () {
    MyPage.init();
});