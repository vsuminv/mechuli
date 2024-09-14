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
    restaurantId: null,

    init: function () {
        this.cancelButton = this.modal.querySelector('button:first-of-type');
        this.maxLength = this.review.getAttribute('maxlength');

        // URL에서 restaurantId를 추출하여 변수에 저장
        const urlParams = new URLSearchParams(window.location.search);
        this.restaurantId = urlParams.get('restaurantId');
        console.log(this.restaurantId);

        // restaurantId가 없을 경우 경고 메시지를 출력하고 종료
        if (!this.restaurantId) {
            console.warn('Restaurant ID is missing in the URL.');
            return;
        }

        // 페이지 데이터 가져오기
        this.fetchBoardPageData();

        // 초기화 시 문자 수 업데이트
        this.updateCharacterCount();

        // 이벤트 리스너 설정
        this.setEventListeners();
    },

    fetchBoardPageData: function () {
        if (!this.restaurantId) {
            console.warn('Restaurant ID is missing in the URL.');
            return;
        }

        // API 호출하여 데이터를 가져옴
        $.ajax({
            url: `/api/boardPage?restaurantId=${this.restaurantId}`,
            method: 'GET',
            dataType: 'json',
            success: (data) => {
                this.renderPageData(data);
            },
            error: (xhr, status, error) => {
                console.error('Error fetching board page data:', error);
                if (xhr.status === 500) {
                    console.error('Internal Server Error: Make sure the API endpoint returns JSON data properly.');
                }
            }
        });
    },

    renderPageData: function (data) {
        // 가져온 데이터를 기반으로 페이지를 동적으로 렌더링
        if (data.authedUser) {
            console.log('Authenticated User:', data.authedUser);
        }

        if (data.menuList) {
            console.log('Menu List:', data.menuList);
            this.renderMenuList(data.menuList);
        }
    },

    renderMenuList: function (menuList) {
        const menuContainer = document.getElementById('menuContainer'); // 메뉴를 렌더링할 컨테이너
        menuContainer.innerHTML = ''; // 기존 메뉴 내용을 초기화

        menuList.forEach(menu => {
            const menuElement = document.createElement('div');
            menuElement.className = 'menu-item';
            menuElement.innerHTML = `<h3>${menu.menu_name}</h3><p>${menu.price}원</p>`;
            menuContainer.appendChild(menuElement);
        });
    },

    setEventListeners: function () {
        this.buttons.forEach(button => {
            button.addEventListener('click', (event) => this.handleButtonClick(event));
        });

        this.addReviewButton.addEventListener('click', () => this.showModal());
        this.cancelButton.addEventListener('click', () => this.hideModal());
        this.stars.forEach((star, index) => {
            star.addEventListener('change', () => this.updateStarRating(index));
        });
        this.review.addEventListener('input', () => this.updateCharacterCount());
    },

    handleButtonClick: function (event) {
        const button = event.currentTarget;
        const tableId = button.getAttribute('data-show-table');
        if (this.activeButton) {
            this.activeButton.classList.remove('bg-[#fef445]');
            this.activeButton.classList.add('bg-[#e6e6e6]');
        }
        button.classList.remove('bg-[#e6e6e6]');
        button.classList.add('bg-[#fef445]');
        this.activeButton = button;
        this.showTable(tableId);
    },

    showTable: function (tableId) {
        this.tables.forEach(table => {
            table.style.display = 'none';
            table.classList.add('hidden');
        });
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
