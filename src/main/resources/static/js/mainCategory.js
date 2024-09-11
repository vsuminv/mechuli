document.addEventListener("DOMContentLoaded", function () {
    fetch('/api/category')
        .then(response => response.json())
        .then(data => {
            console.log("카테고리 데이터:", data); // 데이터 구조 확인
            const container = document.getElementById('list-container');

            let currentSelectedCategory = null;

            // "전체" 버튼 생성 및 추가
            const allButton = document.createElement('button');
            allButton.textContent = "전체";
            allButton.classList.add('bg-[#e5e5e5]', 'h-8', 'w-full', 'rounded-xl');
            container.appendChild(allButton);

            // 전체 버튼 클릭 시 /api/all 데이터를 가져와서 표시
            allButton.addEventListener('click', function () {
                const event = new CustomEvent('allSelected');
                document.dispatchEvent(event);

                // 선택된 버튼의 색상 변경
                if (currentSelectedCategory) {
                    currentSelectedCategory.style.backgroundColor = '#e5e5e5';
                }

                allButton.style.backgroundColor = '#ffdd33';
                currentSelectedCategory = allButton;
            });

            if (typeof data === 'object' && !Array.isArray(data)) {
                Object.keys(data).forEach(categoryName => {
                    const chooseSection = document.createElement('div');
                    chooseSection.classList.add('bg-[#e5e5e5]', 'h-8', 'w-full', 'rounded-xl', 'flex', 'flex-col', 'items-center', 'space-y-2');
                    chooseSection.dataset.category = categoryName;

                    const chooseCategoryList = document.createElement('h1');
                    chooseCategoryList.textContent = categoryName;

                    chooseSection.appendChild(chooseCategoryList);
                    container.appendChild(chooseSection);

                    chooseSection.addEventListener('click', function () {
                        if (currentSelectedCategory) {
                            currentSelectedCategory.style.backgroundColor = '#e5e5e5';
                        }

                        chooseSection.style.backgroundColor = '#ffdd33';
                        currentSelectedCategory = chooseSection;

                        // 선택한 카테고리를 커스텀 이벤트로 전달
                        const event = new CustomEvent('categorySelected', { detail: { category: categoryName } });
                        console.log("이벤트 발생: 선택된 카테고리", categoryName);
                        document.dispatchEvent(event);
                    });
                });
            } else {
                console.error('서버로부터 받은 데이터 형식이 올바르지 않습니다.', data);
            }
        })
        .catch(error => console.error('Error fetching main category data:', error));
});
