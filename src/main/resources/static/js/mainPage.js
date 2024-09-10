document.addEventListener("DOMContentLoaded", function () {
    let allRestaurants = [];

    // 처음에 <h1> 요소 생성
    const container = document.getElementById('restaurant-container');
    const categoryTitle = document.createElement('h1');
    categoryTitle.classList.add('text-2xl', 'text-center', 'my-4');
    container.parentNode.insertBefore(categoryTitle, container);

    // 전체 버튼 클릭 시 /api/all 데이터를 가져와서 표시하는 이벤트 리스너 추가
    document.addEventListener('allSelected', function () {
        fetch('/api/all')
            .then(response => response.json())
            .then(data => {
                categoryTitle.textContent = "전체 레스토랑 목록"; // 제목 업데이트
                displayAllRestaurants(data);
            })
            .catch(error => console.error('Error fetching restaurant data:', error));
    });

    // 모든 레스토랑 목록을 표시하는 함수
    function displayAllRestaurants(data) {
        container.innerHTML = ''; // 기존 모든 레스토랑 목록을 지움
        container.classList.add('grid', 'grid-cols-3', 'gap-4', 'p-8'); // Grid 설정 유지

        data.forEach(restaurant => {
            const restaurantDiv = document.createElement('div');
            restaurantDiv.classList.add('bg-[#e5e5e5]', 'h-32', 'w-32', 'rounded-3xl', 'flex', 'flex-col', 'items-center', 'space-y-2');

            const img = document.createElement('img');
            img.src = restaurant.img_url;
            img.alt = "Restaurant Image";
            img.classList.add('h-20', 'w-20');

            const name = document.createElement('h3');
            name.textContent = restaurant.name;

            restaurantDiv.appendChild(img);
            restaurantDiv.appendChild(name);

            container.appendChild(restaurantDiv);
        });
    }

    // 초기 /api/all 데이터 가져오기
    fetch('/api/all')
        .then(response => response.json())
        .then(data => {
            allRestaurants = data;
            console.log("레스토랑 데이터:", allRestaurants);
            displayAllRestaurants(allRestaurants);
        })
        .catch(error => console.error('Error fetching restaurant data:', error));

    // 카테고리 버튼 클릭 시 /api/category 데이터 렌더링
    document.addEventListener('categorySelected', function (event) {
        const selectedCategory = event.detail.category;
        console.log("선택된 카테고리:", selectedCategory);

        fetch('/api/category')
            .then(response => response.json())
            .then(data => {
                categoryTitle.textContent = "#" + selectedCategory + " 추천"; // 제목 업데이트
                filterAndDisplayRestaurants(selectedCategory, data);
            })
            .catch(error => console.error('Error fetching category data:', error));
    });

    // 선택한 카테고리에 해당하는 레스토랑 목록을 필터링하고 표시하는 함수
    function filterAndDisplayRestaurants(selectedCategory, data) {
        container.innerHTML = ''; // 기존 모든 레스토랑 목록을 지움
        container.classList.add('grid', 'grid-cols-3', 'gap-4', 'p-8'); // Grid 설정으로 유지

        const restaurants = data[selectedCategory];
        console.log("선택된 카테고리의 레스토랑 목록:", restaurants);

        if (restaurants && Array.isArray(restaurants)) {
            restaurants.forEach(restaurant => {
                const restaurantDiv = document.createElement('div');
                restaurantDiv.classList.add('bg-[#e5e5e5]', 'h-32', 'w-32', 'rounded-3xl', 'flex', 'flex-col', 'items-center', 'space-y-2');

                const img = document.createElement('img');
                img.src = restaurant.img_url;
                img.alt = "Restaurant Image";
                img.classList.add('h-20', 'w-20', 'object-cover');

                const name = document.createElement('h3');
                name.textContent = restaurant.name;
                name.classList.add('text-center');

                restaurantDiv.appendChild(img);
                restaurantDiv.appendChild(name);
                container.appendChild(restaurantDiv);
            });
        } else {
            console.log("선택된 카테고리에 대한 레스토랑 데이터가 없습니다.");
        }
    }
});
