let boardPage = {
    buttons: document.querySelectorAll('button[data-show-table]'),
    tables: document.querySelectorAll('main table'),
    modal: document.getElementById('modal'),
    addReviewButton: document.querySelector('#addReviewButton'),
    cancelButton: null,
    activeButton: document.querySelector('button[data-show-table="menuTable"]'),
    stars: document.querySelectorAll('input[name="rating"]'), // 별점
    ratingDisplay: document.getElementById('selectedRating'),
    review: document.getElementById('review'),
    charCountElement: document.getElementById('char-count'),
    maxLength: 2000,
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
        this.fetchRestaurantDetail(); // 레스토랑 정보도 함께 가져오기

        // 초기화 시 문자 수 업데이트
        this.updateCharacterCount();

        // 이벤트 리스너 설정
        this.setEventListeners();
    },

    fetchRestaurantDetail: function () {
        // 서버로부터 레스토랑 정보를 가져오는 AJAX 요청
        $.ajax({
            url: '/api/ajaxRestaurantDetail',
            method: 'POST',
            dataType: 'json', // 서버에서 반환되는 데이터를 JSON 형식으로 받아옴
            data: JSON.stringify({ restaurantId: this.restaurantId }), // 요청 데이터로 restaurantId를 전송
            contentType: 'application/json',
            success: (data) => {
                console.log('Restaurant Detail:', data); // 가져온 데이터를 콘솔에 출력
                this.renderRestaurantDetail(data); // 레스토랑 정보를 렌더링
            },
            error: (xhr, status, error) => {
                console.error('Error fetching restaurant detail:', error);
            }
        });
    },

    renderRestaurantDetail: function (data) {
        // boardStore 요소 가져오기
        const infoTable = document.getElementById('infoTable');

        if (!infoTable) {
            console.warn('Info Table container is missing.');
            return;
        }

        // 레스토랑 정보를 사용하여 동적으로 업데이트
        const infoContent = `
            <tr>
                <td>
                    <br />
                    <h1 class="text-4xl">영업시간</h1>
                    <p class="text-2xl">${data.open_time || '영업시간 정보 없음'} ~ ${data.close_time || '영업시간 정보 없음'}</p>
                    <h1 class="text-4xl">주소</h1>
                    <p class="text-2xl">${data.address || '주소 정보 없음'}</p>
                </td>
            </tr>
        `;

        // 기존 내용을 지우고 새로 추가
        infoTable.innerHTML = infoContent;
        infoTable.classList.remove('hidden'); // 테이블을 표시하도록 클래스 제거
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
                console.log(data);
                this.renderRestaurantMeta(data); // 레스토랑 정보를 렌더링
                this.fetchMenuList(); // 메뉴 리스트를 별도로 가져옴
            },
            error: (xhr, status, error) => {
                console.error('Error fetching board page data:', error);
                if (xhr.status === 500) {
                    console.error('Internal Server Error: Make sure the API endpoint returns JSON data properly.');
                }
            }
        });
    },

    fetchMenuList: function () {
        // 메뉴 리스트를 가져오는 별도의 AJAX 요청
        console.log('Sending AJAX request to fetch menu list...');
        $.ajax({
            url: '/api/ajaxRestaurantMenu', // 서버의 엔드포인트 확인
            method: 'POST',
            dataType: 'json', // 데이터를 JSON 형식으로 받아옴
            data: JSON.stringify({ restaurant_id: this.restaurantId }), // 요청에 포함할 데이터
            contentType: 'application/json',
            success: (menuList) => {
                console.log('Menu List received:', menuList); // 가져온 데이터를 콘솔에 출력
                this.renderMenuList(menuList); // 메뉴 리스트를 렌더링
            },
            error: (xhr, status, error) => {
                console.error('Error fetching menu list:', error);
                console.error('Response status:', status);
                console.error('Response text:', xhr.responseText); // 서버 응답 텍스트를 출력
            }
        });
    },

    renderRestaurantMeta: function (data) {
        // 각각의 요소를 ID로 가져오기
        const imageElement = document.getElementById('metaImage');
        const nameElement = document.getElementById('metaTitle');
        const descriptionElement = document.getElementById('metaDescription');
        const addressElement = document.getElementById('metaAddress');
        const modalElement = document.getElementById('metaModalTitle');
        const subscribeButton = document.getElementById('subscribe'); // ★ 버튼 요소 가져오기

        // 가게 이미지 업데이트
        if (imageElement) {
            imageElement.setAttribute('src', data.img_url || '#'); // 이미지 URL이 없을 경우 기본값 설정
        }

        // 가게 이름 업데이트
        if (nameElement) {
            nameElement.textContent = data.name || '가게 이름'; // 데이터가 없을 경우 기본값 설정
        }

        // 가게 설명 업데이트
        if (descriptionElement) {
            descriptionElement.textContent = `${data.open_time || '오픈 시간'} - ${data.close_time || '닫는 시간'}`; // 영업시간 표시
        }

        // 가게 주소 업데이트
        if (addressElement) {
            addressElement.innerHTML = `${data.address || '주소 정보'} <button id="copyButton"><i>복사</i></button>`; // 주소 표시
        }

        // 모달 업데이트
        if (modalElement) {
            modalElement.textContent = data.name || '가게 이름';
        }

        // 복사 버튼에 클릭 이벤트 리스너 추가
        const copyButton = document.getElementById('copyButton');
        if (copyButton) {
            copyButton.addEventListener('click', () => this.copyToClipboard(data.address));
        }

        // ★ 버튼 클릭 시 색상을 변경하는 이벤트 리스너 추가
        if (subscribeButton) {
            subscribeButton.addEventListener('click', () => this.toggleStarColor());
        }
    },

    toggleStarColor: function () {
        const subscribeButton = document.getElementById('subscribe'); // ★ 버튼 요소 가져오기
        if (subscribeButton) {
            // 버튼의 색상이 이미 채워져 있는지 확인
            if (subscribeButton.classList.contains('text-[#ffdd33]')) {
                // 색상이 채워져 있다면, 원래 색상으로 변경
                subscribeButton.classList.remove('text-[#ffdd33]');
                subscribeButton.classList.add('text-[#e5e5e5]');
            } else {
                // 색상이 채워져 있지 않다면, 색상을 채움
                subscribeButton.classList.remove('text-[#e5e5e5]');
                subscribeButton.classList.add('text-[#ffdd33]');
            }
        }
    },

    copyToClipboard: function (text) {
        // 클립보드에 텍스트를 복사하는 기능
        navigator.clipboard.writeText(text).then(() => {
            console.log('주소가 클립보드에 복사되었습니다:', text);
            alert('주소가 복사되었습니다!');
        }).catch(err => {
            console.error('주소 복사에 실패했습니다:', err);
        });
    },

    renderMenuList: function (menuList) {
        const menuTableBody = document.getElementById('menuTableBody'); // 메뉴를 렌더링할 테이블 바디
        menuTableBody.innerHTML = ''; // 기존 메뉴 내용을 초기화

        if (!menuList || menuList.length === 0) {
            // 메뉴가 없는 경우
            menuTableBody.innerHTML = '<tr><td colspan="2" class="text-center">메뉴가 없습니다.</td></tr>';
            return;
        }

        // 메뉴가 있는 경우
        menuList.forEach(menu => {
            const rowElement = document.createElement('tr'); // 새 테이블 행 생성
            rowElement.innerHTML = `
                <td class="rounded-3xl w-40 h-40 bg-[#e6e6e6]">
                    <img class="rounded-3xl w-40 h-40" src="${menu.imageUrl}" alt="">
                </td>
                <td>
                    <h1 class="text-2xl">${menu.menuName}</h1>
                    <h1 class="text-2xl">${menu.price}원</h1>
                </td>
            `;
            menuTableBody.appendChild(rowElement); // 테이블 바디에 행 추가
        });
    },

//    별점 매기기
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

//    별점 매기기
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
