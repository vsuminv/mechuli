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
        // 버튼 클릭 이벤트 리스너 추가
        this.buttons.forEach(button => {
            button.addEventListener('click', (event) => this.handleButtonClick(event));
        });

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
    },

    handleButtonClick: function (event) {
        const button = event.currentTarget;
        const tableId = button.getAttribute('data-show-table');

        // 이전 활성화된 버튼을 기본 상태로 되돌림
        if (this.activeButton) {
            this.activeButton.classList.remove('bg-[#fef445]');
            this.activeButton.classList.add('bg-[#e6e6e6]');
        }

        // 현재 클릭된 버튼을 노란색으로 설정
        button.classList.remove('bg-[#e6e6e6]');
        button.classList.add('bg-[#fef445]');

        // 현재 버튼을 활성화된 버튼으로 저장
        this.activeButton = button;

        // 해당하는 테이블을 표시하고 나머지는 숨기기
        this.showTable(tableId);
    },

    showTable: function (tableId) {
        // 모든 테이블 숨기기
        this.tables.forEach(table => {
            table.style.display = 'none';
            table.classList.add('hidden');
        });

        // 선택된 테이블만 표시
        const selectedTable = document.getElementById(tableId);
        if (selectedTable) {
            selectedTable.style.display = 'table';
            selectedTable.classList.remove('hidden');
        }
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
