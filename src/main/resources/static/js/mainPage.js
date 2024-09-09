document.addEventListener("DOMContentLoaded", function() {
    fetch('/api/all')
        .then(response => response.json())
        .then(data => {
            const container = document.getElementById('restaurant-container');

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
        })
        .catch(error => console.error('Error fetching restaurant data:', error));

       // /api/category 엔드포인트로 요청을 보냄
    fetch('/api/category')
      .then(response => response.json())
      .then(data => {
        const categoryContainer = document.getElementById('category-container');

        // Object.entries를 사용하여 객체 순회
        Object.entries(data).forEach(([categoryName, restaurants]) => {
          const categorySection = document.createElement('div');
          const categoryTitle = document.createElement('h1');
          categoryTitle.textContent = "#" + categoryName + " 추천";
          categoryTitle.classList.add('text-2xl');

          const restaurantListDiv = document.createElement('div');
          restaurantListDiv.classList.add('flex', 'p-8', 'space-x-4');

          // 각 카테고리별 레스토랑 추가
          if (restaurants && Array.isArray(restaurants)) {
            restaurants.slice(0, 3).forEach(restaurant => {
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
              restaurantListDiv.appendChild(restaurantDiv);
            });
          }

          categorySection.appendChild(categoryTitle);
          categorySection.appendChild(restaurantListDiv);
          categoryContainer.appendChild(categorySection);
        });
      })
      .catch(error => console.error('Error fetching category data:', error));
});