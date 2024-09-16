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

        // 클릭 이벤트로 리뷰 데이터를 요청
        document.getElementById('reviewButton').addEventListener('click', () => {
            if (this.restaurantId) {
                this.fetchReviews(this.restaurantId);  // 버튼 클릭 시 리뷰 데이터를 가져옴
            } else {
                console.warn('식당 ID가 없습니다.');
            }
        });
    },

    // 식당 이름을 가져오는 함수
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

    // 식당 리뷰 데이터를 가져오는 함수
    fetchReviews: function (restaurantId) {
        $.ajax({
            url: `/api/r_reviews?restaurantId=${restaurantId}`,  // 리뷰 데이터를 가져오는 경로
            method: 'GET',
            dataType: 'json',
            success: (reviews) => {
                this.renderReviews(reviews);  // 성공적으로 데이터를 가져오면 렌더링 함수 호출
            },
            error: (xhr, status, error) => {
                console.error('리뷰 데이터를 불러오는 중 오류 발생:', error);
            }
        });
    },

    // 리뷰 데이터를 테이블에 렌더링
    renderReviews: function (reviews) {
        const reviewTable = document.getElementById('reviewTable');
        reviewTable.innerHTML = ''; // 기존 테이블 내용을 초기화

        if (!reviews || reviews.length === 0) {
            reviewTable.innerHTML = '<tr><td colspan="5" class="text-center">리뷰가 없습니다.</td></tr>';
            return;
        }

        reviews.forEach(review => {
            const rowElement = document.createElement('tr');
            rowElement.classList.add('relative', 'flex');

            rowElement.innerHTML = `
                <!-- 프로필 사진 -->
                <td class="bg-gray-300 w-32 h-32 border border-gray-400">
                    <img id="user_photo" src="${review.userPhoto || '/images/default-profile.png'}" alt="프로필 사진">
                </td>
                <!-- 닉네임 -->
                <td class="relative w-32 h-8 border border-gray-400">
                    <h1 id="user_nickname">${review.userNickname || '익명'}</h1>
                </td>
                <!-- 날짜 -->
                <td class="w-32 h-8 bg-blue-200 border border-blue-400">
                    <h1 id="upload_date">${new Date(review.createDate).toLocaleDateString()}</h1>
                </td>
                <!-- 수정/삭제 버튼 -->
                <td class="w-32 h-8 bg-blue-200 border border-blue-400">
                    <div id="mod_del_button" class="flex justify-end">
                        <button>수정</button>
                        &nbsp;&nbsp;
                        <button>삭제</button>
                    </div>
                </td>
                <!-- 리뷰 내용 -->
                <td class="absolute w-96 h-24 top-8 left-32 bg-red-200">
                    <p id="comment">${review.content || '내용 없음'}</p>
                </td>
            `;

            reviewTable.appendChild(rowElement); // 테이블에 행을 추가
        });

        reviewTable.classList.remove('hidden'); // 테이블을 보이게 설정
    },

    // 모달에 식당 이름 반영
    updateModalWithRestaurantName: function () {
        const modalTitle = document.getElementById('modalRestaurantName');  // 모달 내 식당 이름을 표시할 요소
        if (modalTitle && this.restaurantName) {
            modalTitle.textContent = this.restaurantName;
        }
    },

    setEventListeners: function () {
        this.addReviewButton.addEventListener('click', () => this.showModal());
        this.cancelButton.addEventListener('click', () => this.hideModal());

        this.stars.forEach((star, index) => {
            star.addEventListener('change', () => this.updateStarRating(index));
        });

        this.review.addEventListener('input', () => this.updateCharacterCount());

        $('#submit-button').click((event) => {
            event.preventDefault();

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
        });
    },

    showModal: function () {
        this.updateModalWithRestaurantName();  // 모달을 열 때 식당 이름을 업데이트
        this.modal.classList.remove('hidden');
    },

    hideModal: function () {
        this.modal.classList.add('hidden');
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