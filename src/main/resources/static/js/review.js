const reviewPage = {
    modal: document.getElementById('modal'),
    addReviewButton: document.querySelector('#addReviewButton'),
    cancelButton: null,
    stars: document.querySelectorAll('input[name="rating"]'),
    ratingDisplay: document.getElementById('selectedRating'),
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

        // 식당 이름을 가져오는 함수 호출
        this.fetchRestaurantName();

        // 이벤트 리스너 설정
        this.setEventListeners();
    },

    fetchRestaurantName: function () {
        $.ajax({
            url: '/api/ajaxRestaurantDetail',
            method: 'POST',
            dataType: 'json',
            data: JSON.stringify({ restaurantId: this.restaurantId }),
            contentType: 'application/json',
            success: (data) => {
                console.log('Restaurant Detail:', data);
                this.restaurantName = data.name || '식당 이름 없음';  // 식당 이름 저장
                this.updateModalWithRestaurantName();  // 모달에 식당 이름 반영
            },
            error: (xhr, status, error) => {
                console.error('Error fetching restaurant name:', error);
            }
        });
    },

    setEventListeners: function () {
        this.addReviewButton.addEventListener('click', () => this.showModal());
        this.cancelButton.addEventListener('click', () => this.hideModal());

        this.stars.forEach((star, index) => {
            star.addEventListener('change', () => this.updateStarRating(index));
        });

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

            if (event.target.classList.contains('delete-button')) {
                const reviewId = event.target.getAttribute('data-review-id');  // 삭제할 리뷰 ID
                // reviewId = parseInt(reviewId, 10);
                this.deleteReview(reviewId);  // 리뷰 삭제 함수 호출
            }
        });
    },

    // 리뷰 삭제 함수
    deleteReview: function(reviewId) {
        if (!confirm('정말 이 리뷰를 삭제하시겠습니까?')) {
            return;  // 사용자가 취소한 경우 삭제 중단
        }

        $.ajax({
            url: `/reviews/${reviewId}`,  // DELETE 요청 보낼 API 경로
            method: 'DELETE',
            success: function(response) {
                alert('리뷰가 삭제되었습니다.');

                // DOM에서 삭제된 리뷰 제거 (애니메이션 효과 추가)
                const reviewRow = $(`#review-${reviewId}`);
                if (reviewRow.length) {
                    reviewRow.fadeOut(500, function() {
                        reviewRow.remove();  // 페이드아웃 후 DOM에서 제거
                    });
                } else {
                    console.error('삭제할 리뷰 요소를 찾을 수 없습니다.');
                }
            },
            error: function(xhr) {
                alert('리뷰 삭제 중 오류가 발생했습니다.');
                console.log(xhr.responseText);
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

        // 여러 개의 파일 입력 필드에서 파일 추가
        const fileUpload1 = $('#file-upload1')[0]?.files[0];
        const fileUpload2 = $('#file-upload2')[0]?.files[0];

        if (fileUpload1) {
            reviewData.append('files', fileUpload1);  // 첫 번째 파일 추가
        }

        if (fileUpload2) {
            reviewData.append('files', fileUpload2);  // 두 번째 파일 추가
        } 

        $.ajax({
            url: '/reviews',
            method: 'POST',
            processData: false,
            contentType: false,
            data: reviewData,
            success: function(response) {
                alert('리뷰가 성공적으로 등록되었습니다.');
                this.addReviewToPage(response);  // 새 리뷰 UI에 추가
                this.hideModal();
            }.bind(this),  // bind를 통해 콜백 내부의 `this`를 reviewPage로 고정
            error: function(xhr) {
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

    updateModalWithRestaurantName: function () {
        const modalRestaurantName = document.getElementById('modalRestaurantName'); // 모달 내 식당 이름 요소
        if (modalRestaurantName && this.restaurantName) {
            modalRestaurantName.textContent = this.restaurantName; // 식당 이름 업데이트
        }
    },

    showModal: function () {
        this.updateModalWithRestaurantName();
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