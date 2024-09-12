let detailPage = {
    restaurantId: null,

    init: function () {
        // URL에서 restaurantId 쿼리 매개변수 추출
        const urlParams = new URLSearchParams(window.location.search);
        this.restaurantId = urlParams.get('restaurantId');

        if (this.restaurantId) {
            this.fetchRestaurantDetail();
            this.fetchRestaurantMenu();
        } else {
            console.error('Restaurant ID not provided in the URL.');
        }

        // 이벤트 리스너 설정
        this.setupEventListeners();
    },

    fetchRestaurantDetail: function () {
        // restaurantId를 기반으로 식당 정보를 가져옴
        $.ajax({
            url: `/ajaxRestaurantDetail`,
            method: 'POST',
            data: this.restaurantId,
            contentType: 'text/plain', // 문자열로 전송
            success: (response) => {
                console.log("Restaurant Detail Response:", response);
                this.updateRestaurantDetail(response);
            },
            error: (xhr, status, error) => {
                console.error('Error fetching restaurant detail:', error);
            }
        });
    },

    fetchRestaurantMenu: function () {
        // restaurantId를 기반으로 메뉴 정보를 가져옴
        $.ajax({
            url: `/ajaxRestaurantMenu`,
            method: 'POST',
            data: this.restaurantId,
            contentType: 'text/plain', // 문자열로 전송
            success: (response) => {
                console.log("Restaurant Menu Response:", response);
                this.updateRestaurantMenu(response);
            },
            error: (xhr, status, error) => {
                console.error('Error fetching restaurant menu:', error);
            }
        });
    },

    updateRestaurantDetail: function (response) {
        // 응답 HTML을 페이지에 삽입하거나 필요한 데이터 추출
        // 예를 들어 특정 DOM 요소를 찾아 업데이트
        $('#restaurantDetailContainer').html(response);
    },

    updateRestaurantMenu: function (response) {
        // 응답 HTML을 페이지에 삽입하거나 필요한 데이터 추출
        $('#menuTableContainer').html(response);
    },

    setupEventListeners: function () {
        // 기존 이벤트 리스너 설정
        const buttons = document.querySelectorAll('button[data-show-table]');
        const tables = document.querySelectorAll('main table');
        const modal = document.getElementById('modal');
        const addReviewButton = document.querySelector('#addReviewButton');
        const cancelButton = modal.querySelector('button:first-of-type');
        const recommendedButton = document.querySelector('#recommended');
        let activeButton = document.querySelector('button[data-show-table="menuTable"]');

        buttons.forEach(button => {
            button.addEventListener('click', function () {
                const tableId = this.getAttribute('data-show-table');

                if (activeButton) {
                    activeButton.classList.remove('bg-[#ffdd33]');
                    activeButton.classList.add('bg-[#e5e5e5]');
                }

                this.classList.remove('bg-[#e5e5e5]');
                this.classList.add('bg-[#ffdd33]');
                activeButton = this;

                detailPage.showTable(tableId);
            });
        });

        recommendedButton.addEventListener('click', function () {
            this.style.color = this.style.color === 'gold' ? '#e6e6e6' : 'gold';
        });

        addReviewButton.addEventListener('click', function () {
            modal.classList.remove('hidden');
        });

        cancelButton.addEventListener('click', function () {
            modal.classList.add('hidden');
        });
    },

    showTable: function (tableId) {
        const tables = document.querySelectorAll('main table');
        tables.forEach(table => {
            table.style.display = 'none';
            table.classList.add('hidden');
        });

        const selectedTable = document.getElementById(tableId);
        if (selectedTable) {
            selectedTable.style.display = 'table';
            selectedTable.classList.remove('hidden');
        }
    },

    submitForm: function () {
        document.getElementById('modal').classList.add('hidden');
    }
};

// 초기화
detailPage.init();
