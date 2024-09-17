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
    },
    my_StoreList_Review() {
        $.ajax({
            url: "/api/myPage/myLists",
            type: "POST",
            success: function(response) {
                MyPage.renderStoreList(response.myRestaurantListDTOList);
                MyPage.renderReviews(response.myReviewDTOList);
            },
            error: function(xhr, status, error) {
                console.error("내 맛집 리스트와 리뷰를 가져오는데 실패했습니다:", error);
            }
        });
    },

    renderStoreList(storeList) {
        this.$storeListContainer.empty();
        storeList.forEach(store => {
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
    },

    onMySubBtnClick() {
        this.my_Contents("#mySubFragment");
        this.my_btn_style(this.$mySubBtn);
    },

    my_Contents(selector) {
        this.$myStateFragment.hide();
        this.$myStoreListFragment.hide();
        this.$mySubFragment.hide();
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
            url: "/verifyPassword",
            type: "POST",
            data: JSON.stringify({ currentPassword: currentPassword }),
            contentType: "application/json",
            success: function(response) {
                if (response) {
                    MyPage.$confirmPasswordModal.addClass("hidden");
                    MyPage.showUpdateUserForm();
                } else {
                    alert("비밀번호가 일치하지 않습니다.");
                }
            },
            error: function(xhr, status, error) {
                alert("비밀번호 확인 중 오류가 발생했습니다.");
                console.error(error);
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
        formData.append("file", $("#userImg")[0].files[0]);
        formData.append("userPw", $("#newPassword").val());
        formData.append("categoryIds", selectedCategories.map(category => category.id));

        $.ajax({
            url: "/updateUpdate",
            type: "PUT",
            data: formData,
            processData: false,
            contentType: false,
            success: function(response) {
                alert("회원 정보가 성공적으로 수정되었습니다.");
                console.log("업데이트 성공" + response);
                location.reload();
            },
            error: function(xhr, status, error) {
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
    }
};

$(function() {
    MyPage.init();
});