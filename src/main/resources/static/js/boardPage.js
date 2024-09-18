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
            console.warn('URL에서 레스토랑 ID를 찾을 수 없습니다.');
            return;
        }

        // 모든 테이블 숨김
        this.tables.forEach(table => {
            table.style.display = 'none';
            table.classList.add('hidden');
        });

        const menuTable = document.getElementById('menuTable');
        if(menuTable) {
            menuTable.style.display = 'table';
            menuTable.classList.remove('hidden');
        }

        // 페이지 데이터 가져오기
        this.fetchBoardPageData();
        this.fetchRestaurantDetail(); // 레스토랑 정보도 함께 가져오기
        this.fetchReviews();
        // 이벤트 리스너 설정
        this.setEventListeners();

        // 페이지 로드 시와 윈도우 크기 변경 시 버튼 위치 조정
        this.bindEvents();
        this.adjustButtonPosition(); // 초기화 시 버튼 위치 조정
    },

    bindEvents: function () {
        window.addEventListener('load', this.adjustButtonPosition.bind(this));
        window.addEventListener('resize', this.adjustButtonPosition.bind(this));
    },

    adjustButtonPosition: function () {
        // 'page' 요소를 찾아서 그 위치와 크기를 계산
        var pageElement = document.querySelector('.page');
        var footerElement = document.querySelector('footer');
        var reviewButtonContainer = document.getElementById('addReviewButton');

        if (pageElement && footerElement && reviewButtonContainer) {
            // basicPage.html 중앙에 위치한 'page' 요소의 위치 및 크기를 가져옴
            var pageRect = pageElement.getBoundingClientRect();
            var pageRight = pageRect.right;
            var pageBottom = pageRect.bottom;

            // footer 높이 계산
            var footerHeight = footerElement.getBoundingClientRect().height || 0;

            // 버튼의 오른쪽 여백 설정
            var buttonRightOffset = 0; // 오른쪽 16px 여백
            var buttonBottomOffset = 60; // 하단 16px 여백

            // 버튼 컨테이너의 위치를 조정
            reviewButtonContainer.style.right = `${window.innerWidth - pageRight + buttonRightOffset}px`;
            reviewButtonContainer.style.bottom = `${window.innerHeight - pageBottom + buttonBottomOffset}px`;
        }
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
        const imageElement = document.getElementById('metaImage');

        if (imageElement) {
            imageElement.setAttribute('src', data.img_url || '#'); // 이미지 URL이 없을 경우 기본값 설정
        }

        const nameElement = document.getElementById('metaTitle');
        if (nameElement) {
            nameElement.textContent = data.name || '가게 이름';
        }
        boardPage.restaurantName = data.name;

        const descriptionElement = document.getElementById('metaDescription');
        if (descriptionElement) {
            descriptionElement.textContent = `${data.open_time || '오픈 시간'} - ${data.close_time || '닫는 시간'}`;
        }

        const addressElement = document.getElementById('metaAddress');
        // 가게 주소 업데이트
        if (addressElement) {
            addressElement.innerHTML = `${data.address || '주소 정보'} <button id="copyButton"><i>복사</i></button>`; // 주소 표시
        }
        // 복사 버튼에 클릭 이벤트 리스너 추가
        const copyButton = document.getElementById('copyButton');
        if (copyButton) {
            copyButton.addEventListener('click', () => this.copyToClipboard(data.address));
        }

        const subscribeButton = document.getElementById('subscribe'); // ★ 버튼 요소 가져오기
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

    // 새로운 fetchReviews 함수 추가
    fetchReviews: function(restaurantId) {
        $.ajax({
            url: `/api/r_reviews?restaurantId=${this.restaurantId}`,  // 리뷰 데이터를 가져오는 API 경로
            method: 'GET',
            dataType: 'json',
            success: (reviews) => {
                this.renderReviews(reviews);  // 데이터를 가져오면 렌더링 함수 호출
            },
            error: (xhr, status, error) => {
                console.error('리뷰 데이터를 불러오는 중 오류 발생:', error);
            }
        });
    },

    // 리뷰 데이터를 렌더링하는 함수
    renderReviews: function(reviews) {
        const reviewTable = document.getElementById('reviewTable');

        // 기존 리뷰 목록 초기화
        reviewTable.innerHTML = '';

        if (!reviews || reviews.length === 0) {
            reviewTable.innerHTML = '<tr id="review-${review.reviewId}"><td colspan="5" class="text-center">리뷰가 없습니다.</td></tr>';
            return;
        }

        reviews.forEach(review => {
            // 리뷰 객체의 모든 정보를 콘솔에 출력
            console.log('Review Data:', review);

            // reviewImg를 JSON 파싱하여 배열로 변환
            let reviewImages = [];
            if (review.reviewImg) {
                try {
                    reviewImages = JSON.parse(review.reviewImg); // JSON 문자열을 배열로 변환
                } catch (e) {
                    console.error('Error parsing review images:', e);
                }
            }

            // reviewImages 배열을 콘솔에 출력
            console.log('Parsed reviewImages:', reviewImages);

            // reviewImages의 첫 번째 원소를 콘솔에 출력
            const firstImage = reviewImages.length > 0 ? reviewImages[0] : '';
            console.log('First image:', firstImage);

            const rowElement = document.createElement('tr');
            rowElement.setAttribute('id',`review-${review.reviewId}`);
            rowElement.classList.add('relative', 'flex');

            let reviewImageUrl = review.reviewImg;

            // 만약 reviewImg가 JSON 배열 형태로 넘어온다면 이를 파싱
            if (typeof reviewImageUrl === "string" && reviewImageUrl.startsWith('[')) {
                try {
                    const parsedImages = JSON.parse(reviewImageUrl);
                    reviewImageUrl = Array.isArray(parsedImages) && parsedImages.length > 0 ? parsedImages[0] : '/images/default-profile.png';
                } catch (e) {
                    console.error('Error parsing image URL:', e);
                    reviewImageUrl = '/images/default-profile.png';  // 기본 이미지 설정
                }
            }

            rowElement.innerHTML = `

                <td class="w-32 h-32 border border-gray-400 ${firstImage ? '' : 'bg-gray-300'}">
                    ${firstImage ? `<img class="w-32 h-32" id="user_photo" src="${firstImage}" alt="">` : ''}
                </td>

                <td class="relative w-32 h-8 border border-gray-400">
                    <h1 id="user_nickname">${review.nickname || '익명'}</h1>
                </td>
                <td class="w-32 h-8 bg-blue-200 border border-blue-400">
                    <h1 id="upload_date">${new Date(review.createDate).toLocaleDateString()}</h1>
                </td>
                <td class="w-32 h-8 bg-blue-200 border border-blue-400">
                    <div id="mod_del_button" class="flex justify-end">
                        <button class="edit-button" data-review-id="${review.reviewId}">수정</button>
                        &nbsp;&nbsp;
                        <button class="delete-button" data-review-id="${review.reviewId}">삭제</button>
                    </div>
                </td>
                <td class="absolute w-96 h-24 top-8 left-32 bg-red-200">
                    <p id="comment">${review.content || '내용 없음'}</p>
                </td>
            `;

            reviewTable.appendChild(rowElement); // 테이블에 행을 추가
        });

        reviewTable.classList.remove('hidden'); // 테이블을 보이게 설정
    },

    setEventListeners: function () {
        this.buttons.forEach(button => {
            button.addEventListener('click', (event) => this.handleButtonClick(event));
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