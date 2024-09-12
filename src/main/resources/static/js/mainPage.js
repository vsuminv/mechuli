let mainPage = {
    allRestaurants: [],

    init: function () {
        // 초기화 코드
        this.$container = $('#restaurant-container');
        this.$categoryTitle = $('<h1>').addClass('text-2xl text-center my-4').hide();
        this.$container.before(this.$categoryTitle);

        // 이벤트 리스너 설정
        $(document).on('allSelected', () => {
            this.fetchAllRestaurants();
        });

        $(document).on('categorySelected', (event) => {
            const selectedCategory = event.detail.category; // 이벤트에서 detail 객체를 사용
            this.fetchCategoryRestaurants(selectedCategory);
        });

        // 초기 데이터 가져오기
        this.fetchAllRestaurants();
    },

    fetchAllRestaurants: function () {
        $.ajax({
            url: '/api/all',
            method: 'GET',
            dataType: 'json',
            success: (data) => {
                this.$categoryTitle.hide();
                this.displayAllRestaurants(data);
            },
            error: (xhr, status, error) => {
                console.error('Error fetching restaurant data:', error);
            }
        });
    },

    displayAllRestaurants: function (data) {
        this.$container.empty();
        this.$container.addClass('grid grid-cols-3 gap-4 p-8');

        data.forEach((restaurant) => {
            const $restaurantDiv = $('<div>').addClass('bg-[#e5e5e5] h-32 w-32 rounded-3xl flex flex-col items-center space-y-2');
            const $img = $('<img>').attr('src', restaurant.img_url).attr('alt', 'Restaurant Image').addClass('h-20 w-20');
            const $name = $('<h3>').text(restaurant.name);

            $restaurantDiv.append($img).append($name);

            // 레스토랑 클릭 시 /detailPage로 이동하는 이벤트 리스너 추가
            $restaurantDiv.on('click', () => {
                this.goToDetailPage(restaurant.restaurant_id); // 레스토랑의 ID를 전달
            });

            this.$container.append($restaurantDiv);
        });
    },

    fetchCategoryRestaurants: function (selectedCategory) {
        $.ajax({
            url: '/api/category',
            method: 'GET',
            dataType: 'json',
            success: (data) => {
                this.$categoryTitle.show();
                this.$categoryTitle.text("#" + selectedCategory + " 추천");
                this.filterAndDisplayRestaurants(selectedCategory, data);
            },
            error: (xhr, status, error) => {
                console.error('Error fetching category data:', error);
            }
        });
    },

    filterAndDisplayRestaurants: function (selectedCategory, data) {
        this.$container.empty();
        this.$container.addClass('grid grid-cols-3 gap-4 p-8');

        const restaurants = data[selectedCategory];
        console.log("선택된 카테고리의 레스토랑 목록:", restaurants);

        if (restaurants && Array.isArray(restaurants)) {
            restaurants.forEach((restaurant) => {
                const $restaurantDiv = $('<div>').addClass('bg-[#e5e5e5] h-32 w-32 rounded-3xl flex flex-col items-center space-y-2');
                const $img = $('<img>').attr('src', restaurant.img_url).attr('alt', 'Restaurant Image').addClass('h-20 w-20 object-cover');
                const $name = $('<h3>').text(restaurant.name).addClass('text-center');

                $restaurantDiv.append($img).append($name);

                // 레스토랑 클릭 시 /detailPage로 이동하는 이벤트 리스너 추가
                $restaurantDiv.on('click', () => {
                    this.goToDetailPage(restaurant.restaurant_id); // 레스토랑의 ID를 전달
                });

                this.$container.append($restaurantDiv);
            });
        } else {
            console.log("선택된 카테고리에 대한 레스토랑 데이터가 없습니다.");
        }
    },

    // 상세 페이지로 넘어감(임시코드)
    goToDetailPage: function (restaurantId) {
        // /detailPage로 이동하면서 query parameter로 restaurantId를 전달
        window.location.href = `/detailPage?restaurantId=${restaurantId}`;
    }
};

// 초기화
mainPage.init();

// 이벤트 트리거 예시 (카테고리를 선택할 때)
function selectCategory(category) {
    // `categorySelected` 이벤트를 트리거할 때 데이터를 전달
    const event = new CustomEvent('categorySelected', { detail: { category: category } });
    document.dispatchEvent(event);
}