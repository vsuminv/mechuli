let mainPage = {
    allRestaurants: [],
    allCategories: new Set(), // 중복 없이 모든 카테고리를 저장하기 위한 Set
    selectedCategories: [], // 중복된 카테고리 출력을 방지하기 위한 배열
    randomCategories: [], // 무작위로 선택된 3개의 카테고리를 저장할 배열
    commonContainerClass: 'grid grid-cols-3 gap-4 p-8 place-items-center', // 공통으로 사용할 Tailwind CSS 클래스 값

    init: function () {
        // 초기화 코드
        this.$container = $('#restaurant-container');
        this.$categoryTitle = $('<h1>').addClass('text-2xl relative left-8').hide();
        this.$container.before(this.$categoryTitle);

        // 이벤트 리스너 설정
        $(document).on('allSelected', () => {
            this.fetchAllRestaurants();
        });

        $(document).on('categorySelected', (event) => {
            const selectedCategory = event.detail.category; // 이벤트에서 detail 객체를 사용
            this.logCategoryName(selectedCategory); // 카테고리 이름 출력 함수 호출
            this.fetchCategoryRestaurants(selectedCategory);
        });

        // 초기 데이터 가져오기
//        this.fetchInitRestaurants();
          this.fetchRandomRestaurants();

        ////////////////////////////
        // 페이지 로드 시 로그인 상태 확인 후 식당리스트 뿌리기
        this.checkLoginStatus()
            .then(isLoggedIn => {
                if (isLoggedIn) {
                    $(document).ready(() => {
                        $(document).trigger('categorySelected');
                    });
                } else {
                    $(document).ready(() => {
                        $(document).trigger('allSelected');
                    });
                }
            })
            .catch(error => {
                console.error("Error checking login status:", error);
            });
        /////////////////////////////
    },

    fetchRandomRestaurants: function() {
        $.ajax({
            url: '/randomCategory',
            method: 'GET',
            contentType: 'application/x-www-form-urlencoded',
            success: (data) => {
                console.log('Received Data:', data);
                this.displayCategoryRestaurants(data);
            },
            error: (xhr, status, error) => {
                console.error('Error fetching random restaurant data:', error);
                console.log('Response Text:', xhr.responseText); // 서버 응답 내용 확인
            }
        });
    },

    displayCategoryRestaurants: function (data) {
        this.$container.empty(); // 기존 내용을 지우기

        const categoryMap = {};

        // 데이터가 배열 형태라고 가정하고 처리
        data.forEach((restaurant) => {
            const category = restaurant.category_name;

            // 카테고리가 존재하지 않는 경우 초기화
            if (!categoryMap[category]) {
                categoryMap[category] = [];
            }

            // 해당 카테고리에 레스토랑 추가
            categoryMap[category].push(restaurant);
        });

        // 그룹화된 카테고리별로 무작위로 3개씩 선택하여 출력
        Object.keys(categoryMap).forEach((category) => {
            const restaurants = categoryMap[category];

            // 레스토랑을 무작위로 섞음
            const shuffledRestaurants = restaurants.sort(() => 0.5 - Math.random());

            // 무작위로 섞인 레스토랑 중 최대 3개 선택
            const selectedRestaurants = shuffledRestaurants.slice(0, 3);

            // 카테고리 컨테이너 생성
            const $categoryContainer = $('<div>').addClass('flex flex-col w-full');
            const $categoryTitle = $('<h1>').addClass('text-2xl relative left-8').text(`#${category} 추천`);
            $categoryContainer.append($categoryTitle); // 제목을 카테고리 컨테이너에 추가

            // 레스토랑 목록을 담을 섹션 컨테이너 생성
            const $categorySection = $('<div>').addClass(this.commonContainerClass);

            selectedRestaurants.forEach((restaurant) => {
                const $restaurantDiv = $('<div>').addClass('bg-[#e5e5e5] h-32 w-32 rounded-3xl flex flex-col items-center');
                const $img = $('<img>').attr('src', restaurant.img_url).attr('alt', 'Restaurant Image').addClass('h-20 w-20 object-cover');
                const $name = $('<h3>').text(restaurant.name).addClass('text-center');

                $restaurantDiv.append($img).append($name);

                // 레스토랑 클릭 시 /detailPage로 이동하는 이벤트 리스너 추가
                $restaurantDiv.on('click', () => {
                    this.goToDetailPage(restaurant.restaurant_id);
                });

                $categorySection.append($restaurantDiv);
            });

            // 카테고리 섹션을 카테고리 컨테이너에 추가
            $categoryContainer.append($categorySection);

            // 최종적으로 메인 컨테이너에 추가
            this.$container.append($categoryContainer);
        });
    },

//    fetchInitRestaurants: function() {
//        $.ajax({
//            url: '/api/all',
//            method: 'GET',
//            dataType: 'json',
//            success: (data) => {
//                this.extractAndLogCategories(data); // 카테고리 목록 추출 및 로그 출력 함수 호출
//                this.selectRandomCategories(); // 무작위로 3개의 카테고리 선택
//                this.displayRandomCategoryRestaurants(data); // 선택된 카테고리의 레스토랑을 3개씩 표시
//            },
//            error: (xhr, status, error) => {
//                console.error('Error fetching random restaurant data:', error);
//            }
//        });
//
//    },

    //  로그인 전 메인화면
    fetchAllRestaurants: function () {
        $.ajax({
            url: '/api/all',
            method: 'GET',
            dataType: 'json',
            success: (data) => {
                console.log("내 카테고리 데이터:", data);
                this.$categoryTitle.hide();
                this.displayAllRestaurants(data);
            },
            error: (xhr, status, error) => {
                console.error('Error fetching restaurant data:', error);
            }
        });
    },

    extractAndLogCategories: function (data) {
        // 모든 레스토랑 데이터를 통해 카테고리를 추출하여 Set에 추가
        data.forEach((restaurant) => {
            if (restaurant.category_name) {
                this.allCategories.add(restaurant.category_name); // Set에 카테고리 추가
            }
        });

        // 모든 카테고리를 배열로 변환하여 콘솔에 출력
        const categoriesArray = Array.from(this.allCategories);
        console.log("모든 카테고리 목록:", categoriesArray);
    },

    selectRandomCategories: function () {
        // allCategories를 배열로 변환
        const categoriesArray = Array.from(this.allCategories);

        // 무작위로 3개의 카테고리를 선택
        this.randomCategories = [];
        while (this.randomCategories.length < 3 && categoriesArray.length > 0) {
            const randomIndex = Math.floor(Math.random() * categoriesArray.length);
            const randomCategory = categoriesArray.splice(randomIndex, 1)[0];
            this.randomCategories.push(randomCategory);
        }

        console.log("무작위로 선택된 3개의 카테고리:", this.randomCategories);
    },

    displayRandomCategoryRestaurants: function (data) {
        this.$container.empty();

        // 무작위로 선택된 3개의 카테고리에 따라 레스토랑 3개씩 표시
        this.randomCategories.forEach((category_name) => {
            // 최상위 컨테이너 생성
            const $categoryContainer = $('<div>').addClass('flex flex-col w-full');

            // 카테고리별로 텍스트 추가
            const $categoryTitle = $('<h1>').addClass('text-2xl relative left-8').text(`#${category_name} 추천`);
            $categoryContainer.append($categoryTitle); // 제목을 최상위 컨테이너에 추가

            // 레스토랑 목록을 담을 섹션 컨테이너 생성
            const $categorySection = $('<div>').addClass(this.commonContainerClass); // 공통 클래스 사용

            const categoryRestaurants = data.filter(restaurant => restaurant.category_name === category_name);
            const selectedRestaurants = categoryRestaurants.slice(0, 3); // 각 카테고리에서 최대 3개의 레스토랑 선택

            selectedRestaurants.forEach((restaurant) => {
                const $restaurantDiv = $('<div>').addClass('bg-[#e5e5e5] h-32 w-32 rounded-3xl flex flex-col items-center'); // 줄바꿈을 위해 mb-4 추가
                const $img = $('<img>').attr('src', restaurant.img_url).attr('alt', 'Restaurant Image').addClass('h-20 w-20 object-cover');
                const $name = $('<h3>').text(restaurant.name).addClass('text-center');

                $restaurantDiv.append($img).append($name);

                // 레스토랑 클릭 시 /detailPage로 이동하는 이벤트 리스너 추가
                $restaurantDiv.on('click', () => {
                    this.goToDetailPage(restaurant.restaurant_id); // 레스토랑의 ID를 전달
                });

                $categorySection.append($restaurantDiv);
            });

            // 카테고리 섹션을 최상위 컨테이너에 추가
            $categoryContainer.append($categorySection);

            // 최상위 컨테이너를 메인 컨테이너에 추가
            this.$container.append($categoryContainer);
        });
    },

    displayAllRestaurants: function (data) {
        this.$container.empty(); // 기존 내용을 지우기

        // 공통 그리드 클래스 사용하여 그리드 레이아웃 설정
        this.$container.addClass(this.commonContainerClass); // 공통 클래스 사용

        data.forEach((restaurant) => {
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

        // 스타일을 추가하여 그리드 컨테이너를 설정
        this.$container.css('display', 'grid'); // 그리드 레이아웃 설정
        this.$container.css('grid-template-columns', 'repeat(3, 1fr)'); // 한 줄에 3개의 칸 설정
        this.$container.css('gap', '16px'); // 칸 간의 간격 설정
    },

    fetchCategoryRestaurants: function (selectedCategory) {
        $.ajax({
            url: '/api/category',
            method: 'GET',
            dataType: 'json',
            success: (data) => {
                this.filterAndDisplayRestaurants(selectedCategory, data);
            },
            error: (xhr, status, error) => {
                console.error('Error fetching category data:', error);
            }
        });
    },

    filterAndDisplayRestaurants: function (selectedCategory, data) {
        this.$container.empty(); // 기존 내용을 지우기

        // 최상위 컨테이너 생성 (displayRandomCategoryRestaurants와 동일한 구조)
        const $categoryContainer = $('<div>').addClass('flex flex-col w-full'); // Flex 설정

        // 카테고리 제목 추가 (displayRandomCategoryRestaurants와 동일한 스타일)
        const $categoryTitle = $('<h1>').addClass('text-2xl relative left-8').text(`#${selectedCategory} 추천`);
        $categoryContainer.append($categoryTitle); // 제목을 최상위 컨테이너에 추가

        // 레스토랑 목록을 담을 섹션 컨테이너 생성 (공통 클래스 사용)
        const $categorySection = $('<div>').addClass(this.commonContainerClass); // 공통 그리드 클래스 사용

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

                $categorySection.append($restaurantDiv);
            });

            // 카테고리 섹션을 최상위 컨테이너에 추가
            $categoryContainer.append($categorySection);
        } else {
            console.log("선택된 카테고리에 대한 레스토랑 데이터가 없습니다.");
        }

        // 최상위 컨테이너를 메인 컨테이너에 추가
        this.$container.append($categoryContainer);

        // 스타일을 추가하여 왼쪽으로 치우치는 문제를 해결
        this.$container.css('display', 'flex'); // 전체 컨테이너를 Flex로 설정
        this.$container.css('align-items', 'center'); // 가운데 정렬
        this.$container.css('justify-content', 'center'); // 수평 가운데 정렬
    },

    // 중복 없이 카테고리 이름을 콘솔에 출력하는 함수
    logCategoryName: function (categoryName) {
        if (!this.selectedCategories.includes(categoryName)) {
            this.selectedCategories.push(categoryName);
            console.log("선택된 카테고리:", categoryName);
        }
    },

    goToDetailPage: function (restaurantId) {
        // 현재 호스트의 기본 URL을 가져옴 (예: http://localhost:8081)
//        const baseUrl = window.location.origin;

        // 엔드포인트 URL을 설정하고 restaurantId를 쿼리 파라미터로 추가
        const detailPageUrl = '/boardPage?restaurantId=' + restaurantId;

        // 상세 페이지로 이동
        window.location.href = detailPageUrl;
    }

    //////////////////////////////////////////////
    ,
    checkLoginStatus: function() {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: '/api/check-session',
                method: 'GET',
                xhrFields: {
                    withCredentials: true // 쿠키를 포함하여 요청
                },
                success: function(isLoggedIn) {
                    if (isLoggedIn) {
                        console.log("User is logged in.");
                        resolve(true); // Promise를 해결
                    } else {
                        console.log("User is not logged in.");
                        resolve(false); // Promise를 해결
                    }
                },
                error: function(xhr, status, error) {
                    console.error("Error checking login status:", error);
                    alert("메인페이지에서 login 체크 도중 문제가 발생했습니다.");
                    window.location.href = '/loginPage'; // 에러 페이지로 보내기
                    reject(error); // Promise를 거부
                }
            });
        });
    }
    //////////////////////////////////////////////
};

// 초기화
mainPage.init();

// 이벤트 트리거 예시 (카테고리를 선택할 때)
function selectCategory(category) {
    // `categorySelected` 이벤트를 트리거할 때 데이터를 전달
    const event = new CustomEvent('categorySelected', { detail: { category: category } });
    document.dispatchEvent(event);
}