function getQueryParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

let boardPage = {
    buttons: document.querySelectorAll('button[data-show-table]'),
    tables: document.querySelectorAll('main table'),
    restaurantId: null,

    init: function () {
        // URL에서 restaurantId를 추출
        this.restaurantId = getQueryParameter('restaurantId');
        console.log(this.restaurantId);

        // restaurantId가 없을 경우 경고 메시지를 출력하고 종료
        if (!this.restaurantId) {
            console.warn('Restaurant ID is missing in the URL.');
            return;
        }

        // 페이지 데이터 가져오기
        this.fetchBoardPageData();
        this.fetchRestaurantDetail(); // 레스토랑 정보도 함께 가져오기

        // 이벤트 리스너 설정
        this.setEventListeners();
    },

    fetchRestaurantDetail: function () {
        $.ajax({
            url: '/api/ajaxRestaurantDetail',
            method: 'POST',
            dataType: 'json',
            data: JSON.stringify({ restaurantId: this.restaurantId }),
            contentType: 'application/json',
            success: (data) => {
                console.log('Restaurant Detail:', data);
                this.renderRestaurantDetail(data);
            },
            error: (xhr, status, error) => {
                console.error('Error fetching restaurant detail:', error);
            }
        });
    },

    renderRestaurantDetail: function (data) {
        const infoTable = document.getElementById('infoTable');
        if (!infoTable) {
            console.warn('Info Table container is missing.');
            return;
        }

        const infoContent = `
            <tr>
                <td>
                    <h1 class="text-4xl">영업시간</h1>
                    <p class="text-2xl">${data.open_time || '영업시간 정보 없음'} ~ ${data.close_time || '영업시간 정보 없음'}</p>
                    <h1 class="text-4xl">주소</h1>
                    <p class="text-2xl">${data.address || '주소 정보 없음'}</p>
                </td>
            </tr>
        `;
        infoTable.innerHTML = infoContent;
        infoTable.classList.remove('hidden');
    },

    fetchBoardPageData: function () {
        $.ajax({
            url: `/api/boardPage?restaurantId=${this.restaurantId}`,
            method: 'GET',
            dataType: 'json',
            success: (data) => {
                this.renderRestaurantMeta(data);
                this.fetchMenuList(); 
            },
            error: (xhr, status, error) => {
                console.error('Error fetching board page data:', error);
            }
        });
    },

    fetchMenuList: function () {
        $.ajax({
            url: '/api/ajaxRestaurantMenu',
            method: 'POST',
            dataType: 'json',
            data: JSON.stringify({ restaurant_id: this.restaurantId }),
            contentType: 'application/json',
            success: (menuList) => {
                this.renderMenuList(menuList);
            },
            error: (xhr, status, error) => {
                console.error('Error fetching menu list:', error);
            }
        });
    },

    renderRestaurantMeta: function (data) {
        const nameElement = document.getElementById('metaTitle');
        if (nameElement) {
            nameElement.textContent = data.name || '가게 이름';
        }

        const descriptionElement = document.getElementById('metaDescription');
        if (descriptionElement) {
            descriptionElement.textContent = `${data.open_time || '오픈 시간'} - ${data.close_time || '닫는 시간'}`;
        }
    },

    renderMenuList: function (menuList) {
        const menuTableBody = document.getElementById('menuTableBody');
        menuTableBody.innerHTML = '';

        if (!menuList || menuList.length === 0) {
            menuTableBody.innerHTML = '<tr><td colspan="2" class="text-center">메뉴가 없습니다.</td></tr>';
            return;
        }

        menuList.forEach(menu => {
            const rowElement = document.createElement('tr');
            rowElement.innerHTML = `
                <td class="rounded-3xl w-40 h-40 bg-[#e6e6e6]">
                    <img class="rounded-3xl w-40 h-40" src="${menu.imageUrl}" alt="">
                </td>
                <td>
                    <h1 class="text-2xl">${menu.menuName}</h1>
                    <h1 class="text-2xl">${menu.price}원</h1>
                </td>
            `;
            menuTableBody.appendChild(rowElement);
        });
    },

    setEventListeners: function () {
        this.buttons.forEach(button => {
            button.addEventListener('click', (event) => this.handleButtonClick(event));
        });
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
    }
};

// 페이지 초기화
boardPage.init();