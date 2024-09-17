const reviewPage = {
    modal: document.getElementById('modal'),
    addReviewButton: document.querySelector('#addReviewButton'),
    cancelButton: null,
    review: document.getElementById('review'),
    charCountElement: document.getElementById('char-count'),
    maxLength: 2000,
    restaurantId: null,
    isEditMode: false, // 리뷰 수정 모드 플래그
    editReviewId: null, // 수정할 리뷰의 ID를 저장

    init: function () {
        this.cancelButton = this.modal.querySelector('button:first-of-type');
        this.maxLength = this.review.getAttribute('maxlength');

        // URL에서 restaurantId 추출
        const urlParams = new URLSearchParams(window.location.search);
        this.restaurantId = urlParams.get('restaurantId');
        console.log(this.restaurantId);

        if (!this.restaurantId) {
            console.warn('Restaurant ID is missing in the URL.');
            return;
        }

        // 이벤트 리스너 설정
        this.setEventListeners();
    },

    setEventListeners: function () {
        this.addReviewButton.addEventListener('click', () => this.showModal());

        this.cancelButton.addEventListener('click', () => this.hideModal());

        this.review.addEventListener('input', () => this.updateCharacterCount());

        // 리뷰 제출 버튼 (등록/수정) 처리
        $('#submit-button').click((event) => {
            event.preventDefault();
            if (this.isEditMode) {
                this.updateReview();  // 수정 모드일 경우 업데이트 처리
            } else {
                this.submitReview();  // 등록 모드일 경우 새 리뷰 작성 처리
            }
        });

        // 수정 버튼 클릭 이벤트 위임
        document.getElementById('reviewTable').addEventListener('click', (event) => {
            if (event.target.classList.contains('edit-button')) {
                const reviewId = event.target.getAttribute('data-review-id');  // 수정할 리뷰 ID
                this.loadReviewForEdit(reviewId);  // 수정할 리뷰 데이터를 불러옴
            }
        });
    },

    loadReviewForEdit: function (reviewId) {
        $.ajax({
            url: `/reviews/${reviewId}`,
            method: 'GET',
            success: (review) => {
                // 리뷰 데이터를 모달에 채워넣음 (내용만 수정 가능)
                this.isEditMode = true;
                this.editReviewId = reviewId;
                $('#review').val(review.content);  // 내용만 수정 가능하게 설정
                this.showModal();
            },
            error: (xhr) => {
                console.error('리뷰 불러오기 오류:', xhr.responseText);
            }
        });
    },

    submitReview: function () {
        let reviewData = new FormData();
        let reviewDto = {
            content: $('#review').val()
        };

        reviewData.append('reviewDto', new Blob([JSON.stringify(reviewDto)], { type: 'application/json' }));
        reviewData.append('restaurantId', this.restaurantId);

        $.ajax({
            url: '/reviews',
            method: 'POST',
            processData: false,
            contentType: false,
            data: reviewData,
            success: (response) => {
                alert('리뷰가 성공적으로 등록되었습니다.');
                this.addReviewToPage(response);  // 새 리뷰 UI에 추가
                this.hideModal();
            },
            error: (xhr) => {
                alert('리뷰 등록 중 오류가 발생했습니다.');
                console.log(xhr.responseText);
            }
        });
    },

    updateReview: function () {
        let reviewData = new FormData();
        let reviewDto = {
            content: $('#review').val()  // 내용만 수정 가능하게 함
        };

        reviewData.append('reviewDto', new Blob([JSON.stringify(reviewDto)], { type: 'application/json' }));

        $.ajax({
            url: `/reviews/${this.editReviewId}`,
            method: 'PUT',
            processData: false,
            contentType: false,
            data: reviewData,
            success: (response) => {
                alert('리뷰가 성공적으로 수정되었습니다.');
                this.updateReviewOnPage(response);  // 수정된 리뷰 UI에 반영
                this.hideModal();
                this.isEditMode = false;
                this.editReviewId = null;
            },
            error: (xhr) => {
                alert('리뷰 수정 중 오류가 발생했습니다.');
                console.log(xhr.responseText);
            }
        });
    },

    updateReviewOnPage: function (review) {
        const rowElement = document.getElementById(`review-${review.reviewId}`);
        if (rowElement) {
            rowElement.querySelector('#comment').textContent = review.content;  // 내용만 수정
        }
    },

    showModal: function () {
        this.modal.classList.remove('hidden');
    },

    hideModal: function () {
        this.modal.classList.add('hidden');
        this.isEditMode = false;
        this.editReviewId = null;  // 모달 닫힐 때 수정 모드 해제
    },

    updateCharacterCount: function () {
        const charCount = this.review.value.length;
        this.charCountElement.innerText = `${charCount} / ${this.maxLength} 글자`;
    }
};

// 페이지 초기화
reviewPage.init();