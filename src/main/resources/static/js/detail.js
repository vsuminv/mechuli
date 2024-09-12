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
        $.ajax({
            url: `/api/ajaxRestaurantDetail`,
            method: 'POST',
            contentType: 'application/json', // JSON 형식으로 전송
//            dataType: 'json', // 서버에서 HTML 조각을 받아옴
            data: JSON.stringify({ restaurantId: this.restaurantId }), // 데이터를 JSON 형식으로 전송
            success: (response) => {
                console.log("Restaurant Detail Response:", response);
                // JSON 데이터에서 레스토랑 정보를 가져옴
                const restaurantDetails = response.restaurantDetails;

                // restaurantDetails 배열이 존재하고, 하나 이상의 항목이 있는지 확인
                if (restaurantDetails && restaurantDetails.length > 0) {
                    // 첫 번째 레스토랑 데이터 사용
                    const restaurantDetail = restaurantDetails[0];

                    // HTML을 동적으로 생성
                    const detailHtml = `
                        <div class="flex mx-auto w-5/6">
                            <div class="relative -top-16 left-0 rounded-3xl w-32 h-32 bg-[#ffdd33] mr-4">
                                <img src="${restaurantDetail.img_url}" alt="">
                            </div>
                            <div class="flex space-x-4">
                                <div>
                                    <div class="flex items-center">
                                        <h1 class="text-4xl">${restaurantDetail.name}</h1>
                                        &nbsp;&nbsp;
                                    </div>
                                    <p>집사와 강아지가 오붓하게 저녁먹는 집</p>
                                    <p>${restaurantDetail.address} <button><i>복사</i></button></p>
                            </div>
                            <div>
                                <button id="recommended" class="text-4xl text-[#e6e6e6]">★</button>
                            </div>
                         </div>
                    </div>
                `;

                // 동적으로 생성된 HTML을 DOM에 삽입
                $('#detailStoreMetaContainer').html(detailHtml);
                } else {
                    console.error("No restaurant details found.");
                }
            },
            error: (xhr, status, error) => {
                console.error('Error fetching restaurant detail:', error);
            }
        });
    },

    fetchRestaurantMenu: function () {
        $.ajax({
            url: `/api/ajaxRestaurantMenu`,
            method: 'POST',
            contentType: 'application/json', // JSON 형식으로 전송
            dataType: 'html', // 서버에서 HTML 조각을 받아옴
            data: JSON.stringify({ restaurantId: this.restaurantId }), // 데이터를 JSON 형식으로 전송
            success: (response) => {
                console.log("Restaurant Menu Response:", response);
                $('#menuTableContainer').html(response);
            },
            error: (xhr, status, error) => {
                console.error('Error fetching restaurant menu:', error);
            }
        });
    },

    setupEventListeners: function () {
        const $buttons = $('button[data-show-table]');
        const $tables = $('main table');
        const $modal = $('#modal');
        const $addReviewButton = $('#addReviewButton');
        const $cancelButton = $modal.find('button:first-of-type');
        const $recommendedButton = $('#recommended');
        let $activeButton = $('button[data-show-table="menuTable"]');

        $buttons.on('click', (event) => {
            const $button = $(event.currentTarget);
            const tableId = $button.data('show-table');

            if ($activeButton) {
                $activeButton.removeClass('bg-[#ffdd33]').addClass('bg-[#e5e5e5]');
            }

            $button.removeClass('bg-[#e5e5e5]').addClass('bg-[#ffdd33]');
            $activeButton = $button;

            this.showTable(tableId);
        });

        $recommendedButton.on('click', function () {
            $(this).css('color', $(this).css('color') === 'gold' ? '#e6e6e6' : 'gold');
        });

        $addReviewButton.on('click', function () {
            $modal.removeClass('hidden');
        });

        $cancelButton.on('click', function () {
            $modal.addClass('hidden');
        });
    },

    showTable: function (tableId) {
        const $tables = $('main table');
        $tables.hide().addClass('hidden');

        const $selectedTable = $(`#${tableId}`);
        if ($selectedTable.length) {
            $selectedTable.show().removeClass('hidden');
        }
    },

    submitForm: function () {
        $('#modal').addClass('hidden');
    }
};

// 초기화
$(document).ready(function () {
    detailPage.init();
});
