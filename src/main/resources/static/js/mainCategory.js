let mainCategory = {
    currentSelectedCategory: null,

    init: function () {
        this.fetchCategories();
    },

    fetchCategories: function () {
        $.ajax({
            url: '/api/category',
            method: 'GET',
            dataType: 'json',
            success: (data) => {
                console.log("카테고리 데이터:", data); // 데이터 구조 확인
                this.displayCategories(data);
            },
            error: (xhr, status, error) => {
                console.error('Error fetching main category data:', error);
            }
        });
    },

    displayCategories: function (data) {
        const $container = $('#list-container');

        // "전체" 버튼 생성 및 추가
        const $allButton = $('<button>').text("전체").addClass('bg-[#e5e5e5] h-8 w-full rounded-xl');
        $container.append($allButton);

        // 전체 버튼 클릭 시 /api/all 데이터를 가져와서 표시
        $allButton.on('click', () => {
            const event = new CustomEvent('allSelected');
            document.dispatchEvent(event);

            // 선택된 버튼의 색상 변경
            if (this.currentSelectedCategory) {
                $(this.currentSelectedCategory).css('background-color', '#e5e5e5');
            }

            $allButton.css('background-color', '#ffdd33');
            this.currentSelectedCategory = $allButton;
        });

        if (typeof data === 'object' && !Array.isArray(data)) {
            Object.keys(data).forEach((categoryName) => {
                const $chooseSection = $('<div>').addClass('bg-[#e5e5e5] h-8 w-full rounded-xl flex flex-col items-center space-y-2').attr('data-category', categoryName);
                const $chooseCategoryList = $('<h1>').text(categoryName);

                $chooseSection.append($chooseCategoryList);
                $container.append($chooseSection);

                $chooseSection.on('click', () => {
                    if (this.currentSelectedCategory) {
                        $(this.currentSelectedCategory).css('background-color', '#e5e5e5');
                    }

                    $chooseSection.css('background-color', '#ffdd33');
                    this.currentSelectedCategory = $chooseSection;

                    // 선택한 카테고리를 커스텀 이벤트로 전달
                    const event = new CustomEvent('categorySelected', { detail: { category: categoryName } });
                    console.log("이벤트 발생: 선택된 카테고리", categoryName);
                    document.dispatchEvent(event);
                });
            });
        } else {
            console.error('서버로부터 받은 데이터 형식이 올바르지 않습니다.', data);
        }
    }
};

// 초기화
mainCategory.init();
