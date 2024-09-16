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
    restaurantName: null, // 식당 이름을 저장할 변수

    init: function () {
        // 'modal' 요소와 'addReviewButton'이 제대로 선택되었는지 확인
        if (!this.modal) {
            console.warn('Modal element is missing.');
            return;
        }
        if (!this.addReviewButton) {
            console.warn('Add review button is missing.');
            return;
        }

        // 취소 버튼 선택
        this.cancelButton = this.modal.querySelector('button:first-of-type');
        if (!this.cancelButton) {
            console.warn('Cancel button in modal is missing.');
            return;
        }

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

    setEventListeners: function () {
        // 리뷰 추가 버튼 이벤트 리스너 설정
        if (this.addReviewButton) {
            this.addReviewButton.addEventListener('click', () => this.showModal());
        }

        // 취소 버튼 이벤트 리스너 설정
        if (this.cancelButton) {
            this.cancelButton.addEventListener('click', () => this.hideModal());
        }

        // 별점 선택 이벤트 리스너 설정
        this.stars.forEach((star, index) => {
            star.addEventListener('change', () => this.updateStarRating(index));
        });

        // 리뷰 입력 이벤트 리스너 설정
        if (this.review) {
            this.review.addEventListener('input', () => this.updateCharacterCount());
        }

        // 리뷰 제출 버튼 클릭 이벤트
        $('#submit-button').click((event) => {
            event.preventDefault();
            this.submitReview();
        });
    },

    showModal: function () {
        this.updateModalWithRestaurantName();  // 모달을 열 때 식당 이름을 업데이트
        this.modal.classList.remove('hidden'); // 모달 표시
    },

    hideModal: function () {
        this.modal.classList.add('hidden'); // 모달 숨기기
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

    updateModalWithRestaurantName: function () {
        const modalRestaurantName = document.getElementById('modalRestaurantName'); // 식당 이름을 업데이트하기 위한 요소

        // 모달의 식당 이름 업데이트
        if (modalRestaurantName && this.restaurantName) {
            modalRestaurantName.textContent = this.restaurantName; // 식당 이름 반영
        }
    },

    submitReview: function () {
        let reviewData = new FormData();
        let reviewDto = {
            content: $('#review').val(),
            rating: $('input[name="rating"]:checked').val()
        };

        reviewData.append('reviewDto', new Blob([JSON.stringify(reviewDto)], { type: 'application/json' }));

        const files = [];
        if ($('#file-upload1')[0].files.length > 0) {
            files.push($('#file-upload1')[0].files[0]);
        }
        if ($('#file-upload2')[0].files.length > 0) {
            files.push($('#file-upload2')[0].files[0]);
        }

        files.forEach(file => {
            reviewData.append('files', file);
        });

        reviewData.append('restaurantId', this.restaurantId);

        $.ajax({
            url: '/reviews',
            method: 'POST',
            processData: false,
            contentType: false,
            data: reviewData,
            success: function(response) {
                alert('리뷰가 성공적으로 등록되었습니다.');
                reviewPage.hideModal();
            },
            error: function(xhr) {
                alert('리뷰 등록 중 오류가 발생했습니다.');
                console.log(xhr.responseText);
            }
        });
    },

    updateStarRating: function (index) {
        const rating = this.stars[index].value;
        this.ratingDisplay.textContent = rating;

        this.stars.forEach((s, i) => {
            if (i <= index) {
                s.nextElementSibling.classList.add('text-yellow-500');
                s.nextElementSibling.classList.remove('text-gray-400');
            } else {
                s.nextElementSibling.classList.remove('text-yellow-500');
                s.nextElementSibling.classList.add('text-gray-400');
            }
        });
    },

    updateCharacterCount: function () {
        const charCount = this.review.value.length;
        this.charCountElement.innerText = `${charCount} / ${this.maxLength} 글자`;
    }
};

// 페이지 초기화
reviewPage.init();
