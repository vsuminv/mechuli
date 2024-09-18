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

        $('#submit-button').click((event) => {
            event.preventDefault();

            let reviewData = new FormData();
            let reviewDto = {
                content: $('#review').val(),
                rating: $('input[name="rating"]:checked').val()
            };

            // UI에 실시간 반영할 사용자가 입력한 데이터를 준비
            const userReview = {
                reviewId: `temp-${Date.now()}`, // 임시 ID를 사용해 고유하게 설정
                userPhoto: '/images/default-profile.png', // 사용자가 로그인 상태라면 실제 사진을 사용할 수 있음
                nickname: '익명', // 사용자의 닉네임 (필요시 실제 닉네임 사용)
                createDate: new Date().toISOString(),
                content: reviewDto.content,
                rating: reviewDto.rating
            };

            // 사용자가 작성한 리뷰를 먼저 화면에 표시
            this.addReviewToPage(userReview);

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
                success: (response) => {
                    alert('리뷰가 성공적으로 등록되었습니다.');
                    // 서버로부터 응답받은 리뷰 정보를 콘솔에 출력
//                    console.log(response);
//                    this.addReviewToPage(response);  // 새 리뷰만 추가
                    // 서버로부터 받은 응답을 바탕으로 UI 업데이트 (필요 시)
                    this.updateReviewWithServerData(userReview.reviewId, response);
                    this.hideModal();  // 모달 닫기
                },
                error: (xhr) => {
                    alert('리뷰 등록 중 오류가 발생했습니다.');
                    console.log(xhr.responseText);
                }
            });
        });
    
        // 리뷰 삭제 처리 (이벤트 위임 방식으로 처리)
        document.getElementById('reviewTable').addEventListener('click', function (event) {
            if (event.target.classList.contains('delete-button')) {
                const reviewId = event.target.id;  // 클릭된 버튼의 ID를 사용하여 리뷰 ID 가져오기
                reviewPage.deleteReview(reviewId);  // 리뷰 삭제 함수 호출
            }
        });
    },

    // 서버 응답에 따라 UI를 업데이트하는 함수
    updateReviewWithServerData: function (tempReviewId, response) {
        const existingRow = document.getElementById(`review-${tempReviewId}`);
        if (existingRow) {
            existingRow.setAttribute('id', `review-${response.reviewId}`); // 임시 ID를 실제 리뷰 ID로 변경
            existingRow.querySelector('#user_nickname').textContent = response.nickname || '익명';
            existingRow.querySelector('#upload_date').textContent = new Date(response.createDate).toLocaleDateString();
            existingRow.querySelector('#comment').textContent = response.content || '내용 없음';
            // 서버에서 받은 다른 정보들도 필요시 업데이트
        }
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

    // 개별 리뷰만 추가하는 함수
    addReviewToPage: function (review) {
        const existingRow = document.getElementById(`#reviewTable tr#review-${review.reviewId}`); // 기존 tr 태그 찾기

        // 만약 기존 태그가 없다면 새로 추가
        const rowElement = document.createElement('tr');
        rowElement.setAttribute('id', `review-${Array.isArray(review.reviewImg) ? review.reviewImg[0] :review.reviewId}`);  // 리뷰 ID를 사용해 행 ID 설정
        rowElement.classList.add('relative', 'flex');

        const reviewImage = review.reviewImg ? JSON.parse(review.reviewImg)[0] : '/images/default-profile.png';

        rowElement.innerHTML = `
            <td class="bg-gray-300 w-32 h-32 border border-gray-400">
                <img id="user_photo" src="${reviewImage}}" alt="프로필 사진">
            </td>
            <td class="relative w-32 h-8 border border-gray-400">
                <h1 id="user_nickname">${review.nickname || '익명'}</h1>
            </td>
            <td class="w-32 h-8 bg-blue-200 border border-blue-400">
                <h1 id="upload_date">${new Date(review.createDate).toLocaleDateString()}</h1>
            </td>
            <td class="w-32 h-8 bg-blue-200 border border-blue-400">
                <div id="mod_del_button" class="flex justify-end">
                    <button>수정</button>
                    &nbsp;&nbsp;
                    <button class="delete-button" id="${review.reviewId}">삭제</button>
                </div>
            </td>
            <td class="absolute w-96 h-24 top-8 left-32 bg-red-200">
                <p id="comment">${review.content || '내용 없음'}</p>
            </td>
        `;

        const reviewTable = document.getElementById('reviewTable');
        reviewTable.appendChild(rowElement); // 테이블에 새 리뷰 추가
        

        // 새로 추가된 삭제 버튼에 이벤트 리스너 추가
        document.getElementById(review.reviewId).addEventListener('click', (event) => {
            const reviewId = event.target.id;
            reviewPage.deleteReview(reviewId); // 리뷰 삭제 함수 호출
        });
    },
        
    showModal: function () {
        this.updateModalWithRestaurantName();  // 모달을 열 때 식당 이름을 업데이트
        this.modal.classList.remove('hidden');
    },

    hideModal: function () {
        this.modal.classList.add('hidden');
    },

    updateModalWithRestaurantName: function () {
        const modalRestaurantName = document.getElementById('modalRestaurantName'); // 식당 이름을 업데이트하기 위한 요소

        // 모달의 식당 이름 업데이트
        if (modalRestaurantName && this.restaurantName) {
            modalRestaurantName.textContent = this.restaurantName; // 식당 이름 반영
        }
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

function parseReviewImage(imageString) {
    if (imageString.startsWith("[") && imageString.endsWith("]")) {
        return imageString.substring(2, imageString.length - 2);  // 앞뒤 [""] 제거
    }
    return imageString;
}

const cleanedImageUrl = parseReviewImage(review.reviewImg);
console.log('Cleaned Image URL:', cleanedImageUrl);

// 페이지 초기화
reviewPage.init();