function getQueryParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

let boardPage = {
    buttons: document.querySelectorAll('button[data-show-table]'),
    tables: document.querySelectorAll('main table'),
    modal: document.getElementById('modal'),
    addReviewButton: document.querySelector('#addReviewButton'),
    cancelButton: null,
    activeButton: document.querySelector('button[data-show-table="menuTable"]'),
    stars: document.querySelectorAll('input[name="rating"]'),
    ratingDisplay: document.getElementById('selectedRating'),
    review: document.getElementById('review'),
    charCountElement: document.getElementById('char-count'),
    maxLength: null,

    init: function () {
        this.cancelButton = this.modal.querySelector('button:first-of-type');
        this.maxLength = this.review.getAttribute('maxlength');

        // 초기화 시 문자 수 업데이트
        this.updateCharacterCount();

        // 이벤트 리스너 설정
        this.setEventListeners();
    },

    setEventListeners: function () {
        // 모달 열기 이벤트
        this.addReviewButton.addEventListener('click', () => this.showModal());

        // 모달 닫기 이벤트
        this.cancelButton.addEventListener('click', () => this.hideModal());

        // 별점 클릭 이벤트 리스너 추가
        this.stars.forEach((star, index) => {
            star.addEventListener('change', () => this.updateStarRating(index));
        });

        // 리뷰 글자 수 업데이트 이벤트 리스너 추가
        this.review.addEventListener('input', () => this.updateCharacterCount());

        // 리뷰 제출 버튼 클릭 이벤트
        $('#submit-button').click((event) => {
            event.preventDefault(); // 기본 제출 동작 방지

            const reviewContent = $('#review').val().trim();  // 리뷰 내용
            const selectedRating = $('input[name="rating"]:checked').val();  // 선택된 별점

            // isnull 변수로 review가 비어있는지 확인
            const isnull = reviewContent === '';

            // 입력값이 없는 경우 경고 메시지 출력
            if (isnull) {
                alert('리뷰 내용을 입력해주세요.');
                return;  // 서버로 전송하지 않음
            }

            if (!selectedRating) {
                alert('별점을 선택해주세요.');
                return;  // 서버로 전송하지 않음
            }

            let reviewData = new FormData();

            // URL에서 restaurantId 가져오기
            const restaurantId = getQueryParameter('restaurantId');

            // JSON 데이터를 객체로 수집
            let reviewDto = {
                content: reviewContent,
                rating: parseInt(selectedRating)
            };

            // reviewDto를 JSON 문자열로 변환하여 FormData에 추가
            reviewData.append('reviewDto', new Blob([JSON.stringify(reviewDto)], { type: 'application/json' }));

            // 파일 추가
            if ($('#file-upload1')[0].files.length > 0) {
                reviewData.append('files', $('#file-upload1')[0].files[0]);  // 첫 번째 이미지 파일
            }
            if ($('#file-upload2')[0].files.length > 0) {
                reviewData.append('files', $('#file-upload2')[0].files[0]);  // 두 번째 이미지 파일
            }

            // 식당 ID 추가
            reviewData.append('restaurantId', restaurantId);  // 식당 ID

            // AJAX로 서버에 데이터 전송
            $.ajax({
                url: '/reviews',  // 리뷰를 전송할 엔드포인트
                method: 'POST',
                processData: false,
                contentType: false,
                data: reviewData,
                success: (response) => {
                    alert('리뷰가 성공적으로 등록되었습니다.');

                    // 리뷰 등록 후 모달 닫기
                    this.hideModal(); // 모달 닫기

                    // 필요시 페이지 새로고침이나 다른 작업
                },
                error: function(xhr) {
                    alert('리뷰 등록 중 오류가 발생했습니다.');
                    console.log(xhr.responseText);  // 서버 응답을 로그로 확인
                }
            });
        });

        // 리뷰 글자 수 제한
        $('#review').on('input', function() {
            let charCount = $(this).val().length;
            $('#char-count').text(`${charCount} / 2000 글자`);
            if (charCount > 2000) {
                alert('리뷰는 최대 2000자까지 작성 가능합니다.');
            }
        });
    },

    showModal: function () {
        this.modal.classList.remove('hidden');
    },

    hideModal: function () {
        this.modal.classList.add('hidden');
    },

    updateStarRating: function (index) {
        const rating = this.stars[index].value;
        this.ratingDisplay.textContent = rating;

        // 모든 별의 상태 초기화
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
        this.charCountElement.innerText = charCount + ' / ' + this.maxLength + ' 글자';
    }
};

// 페이지 초기화
boardPage.init();

//let boardPage = {
//    buttons: document.querySelectorAll('button[data-show-table]'),
//    tables: document.querySelectorAll('main table'),
//    modal: document.getElementById('modal'),
//    addReviewButton: document.querySelector('#addReviewButton'),
//    cancelButton: null,
//    activeButton: document.querySelector('button[data-show-table="menuTable"]'),
//    stars: document.querySelectorAll('input[name="rating"]'),
//    ratingDisplay: document.getElementById('selectedRating'),
//    review: document.getElementById('review'),
//    charCountElement: document.getElementById('char-count'),
//    maxLength: null,
////    authedUser: null,
////    menuList: [],
//
//    init: function () {
//        this.cancelButton = this.modal.querySelector('button:first-of-type');
//        this.maxLength = this.review.getAttribute('maxlength');
//
//        // 초기화 시 문자 수 업데이트
//        this.updateCharacterCount();
//
//        // API 호출하여 데이터를 가져옴
////        this.fetchBoardPageData();
//
//        // 이벤트 리스너 설정
//        this.setEventListeners();
//    },
//
//    setEventListeners: function () {
//        // 버튼 클릭 이벤트 리스너 추가
//        this.buttons.forEach(button => {
//            button.addEventListener('click', (event) => this.handleButtonClick(event));
//        });
//
//        // 모달 열기 이벤트
//        this.addReviewButton.addEventListener('click', () => this.showModal());
//
//        // 모달 닫기 이벤트
//        this.cancelButton.addEventListener('click', () => this.hideModal());
//
//        // 별점 클릭 이벤트 리스너 추가
//        this.stars.forEach((star, index) => {
//            star.addEventListener('change', () => this.updateStarRating(index));
//        });
//
//        // 리뷰 글자 수 업데이트 이벤트 리스너 추가
//        this.review.addEventListener('input', () => this.updateCharacterCount());
//    },
//
////    fetchBoardPageData: function () {
////        $.ajax({
////            url: '/boardPage',
////            method: 'GET',
////            dataType: 'json',
////            success: (data) => {
////                // authedUser와 menuList 데이터를 가져옴
////                this.authedUser = data.authedUser;
////                this.menuList = data.menuList;
////
////                // 데이터를 콘솔에 출력
////                this.logDataToConsole();
////            },
////            error: (xhr, status, error) => {
////                console.error('Error fetching board page data:', error);
////            }
////        });
////    },
////
////    logDataToConsole: function () {
////        // authedUser와 menuList를 콘솔에 출력
////        console.log('Authenticated User:', this.authedUser);
////        console.log('Menu List:', this.menuList);
////
////        // authedUser와 menuList의 데이터 형식을 더 자세히 확인
////        console.log('Authenticated User (Stringified):', JSON.stringify(this.authedUser, null, 2)); // 문자열로 변환하여 보기
////        console.table(this.menuList); // 표 형식으로 menuList 보기
////
////        // 각각의 key와 value를 확인하여 데이터 구조를 파악
////        if (this.authedUser) {
////            Object.keys(this.authedUser).forEach(key => {
////                console.log(`authedUser Key: ${key}, Value: ${this.authedUser[key]}`);
////            });
////        } else {
////            console.log('authedUser is null or undefined.');
////        }
////
////        if (this.menuList && Array.isArray(this.menuList)) {
////            this.menuList.forEach((menu, index) => {
////                console.log(`Menu Item ${index}:`, menu);
////                Object.keys(menu).forEach(key => {
////                    console.log(`Menu Key: ${key}, Value: ${menu[key]}`);
////                });
////            });
////        } else {
////            console.log('menuList is empty or not an array.');
////        }
////    },
//
//    handleButtonClick: function (event) {
//        const button = event.currentTarget;
//        const tableId = button.getAttribute('data-show-table');
//
//        // 이전 활성화된 버튼을 기본 상태로 되돌림
//        if (this.activeButton) {
//            this.activeButton.classList.remove('bg-[#fef445]');
//            this.activeButton.classList.add('bg-[#e6e6e6]');
//        }
//
//        // 현재 클릭된 버튼을 노란색으로 설정
//        button.classList.remove('bg-[#e6e6e6]');
//        button.classList.add('bg-[#fef445]');
//
//        // 현재 버튼을 활성화된 버튼으로 저장
//        this.activeButton = button;
//
//        // 해당하는 테이블을 표시하고 나머지는 숨기기
//        this.showTable(tableId);
//    },
//
//    showTable: function (tableId) {
//        // 모든 테이블 숨기기
//        this.tables.forEach(table => {
//            table.style.display = 'none';
//            table.classList.add('hidden');
//        });
//
//        // 선택된 테이블만 표시
//        const selectedTable = document.getElementById(tableId);
//        if (selectedTable) {
//            selectedTable.style.display = 'table';
//            selectedTable.classList.remove('hidden');
//        }
//    },
//
//    showModal: function () {
//        this.modal.classList.remove('hidden');
//    },
//
//    hideModal: function () {
//        this.modal.classList.add('hidden');
//    },
//
//    updateStarRating: function (index) {
//        const rating = this.stars[index].value;
//        this.ratingDisplay.textContent = rating;
//
//        // 모든 별의 상태 초기화
//        this.stars.forEach((s, i) => {
//            if (i <= index) {
//                s.nextElementSibling.classList.add('text-yellow-500');
//                s.nextElementSibling.classList.remove('text-gray-400');
//            } else {
//                s.nextElementSibling.classList.remove('text-yellow-500');
//                s.nextElementSibling.classList.add('text-gray-400');
//            }
//        });
//    },
//
//    updateCharacterCount: function () {
//        const charCount = this.review.value.length;
//        this.charCountElement.innerText = charCount + ' / ' + this.maxLength + ' 글자';
//    },
//
////choi code========================================
//    $('#submit-button').click(function() {
//        event.preventDefault();
//        let reviewData = new FormData();
//
//        // JSON 데이터를 객체로 수집
//        let reviewDto = {
//            content: $('#review').val()  // 리뷰 내용
//        };
//
//        // reviewDto를 JSON 문자열로 변환하여 FormData에 추가
//        reviewData.append('reviewDto', new Blob([JSON.stringify(reviewDto)], { type: 'application/json' }));
//
//        // 파일 추가
//        if ($('#file-upload1')[0].files.length > 0) {
//            reviewData.append('files', $('#file-upload1')[0].files[0]);  // 첫 번째 이미지 파일
//        }
//        if ($('#file-upload2')[0].files.length > 0) {
//            reviewData.append('files', $('#file-upload2')[0].files[0]);  // 두 번째 이미지 파일
//        }
//
//        // 식당 ID 추가
//        reviewData.append('restaurantId', restaurantId);  // 식당 ID
//
//        $.ajax({
//            url: '/reviews',  // 리뷰를 전송할 엔드포인트
//            method: 'POST',
//            processData: false,
//            contentType: false,
//            data: reviewData,
//            success: function(response) {
//                alert('리뷰가 성공적으로 등록되었습니다.');
//            },
//            error: function(xhr) {
//                alert('리뷰 등록 중 오류가 발생했습니다.');
//            }
//        });
//    },
//
//    $('#review').on('input', function() {
//        let charCount = $(this).val().length;
//        $('#char-count').text(`${charCount} / 2000 글자`);
//        if (charCount > 2000) {
//            alert('리뷰는 최대 2000자까지 작성 가능합니다.');
//        }
//    }
//};
//
//// 페이지 초기화
//boardPage.init();
