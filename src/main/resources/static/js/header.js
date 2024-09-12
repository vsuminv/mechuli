document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.getElementById("searchInput");
    const categoryList = document.getElementById('categoryList');
    const otherCategoryButton = document.getElementById('otherCategoryButton');
    const bubbleInput = document.getElementById('bubbleInput');
    const otherCategoryInput = document.getElementById('otherCategoryInput');
    const otherCategorySearchButton = document.getElementById('otherCategorySearchButton');

    let selectedCategoryButton = null;

    searchInput.addEventListener("focus", function () {
        showCategoryList();
        hideTitle();
    });

    searchInput.addEventListener("input", function () {
        showCategoryList();
    });

    searchInput.addEventListener("blur", function () {
        if (!bubbleInput.contains(event.relatedTarget)) {
            showTitle();
        }
    });

    const categoryButtons = document.querySelectorAll(".category-button");
    categoryButtons.forEach(button => {
        button.addEventListener("click", function () {
            const category = button.getAttribute("data-category");

            if (category === '기타') {
                resetCategorySelection();
                showSearchInput();
            } else {
                handleCategorySelection(button, category);
            }
        });
    });

    otherCategoryButton.addEventListener("click", function (e) {
        e.preventDefault();
        showSearchInput();
    });

    otherCategorySearchButton.addEventListener('click', function () {
        const inputValue = otherCategoryInput.value.trim();
        if (inputValue !== '') {
            searchInput.value = `#${inputValue}`;
            hideSearchInput();
            hideCategoryList();
            showTitle();
        }
    });

    document.addEventListener("click", function (event) {
        if (!searchInput.contains(event.target) && !categoryList.contains(event.target) && !bubbleInput.contains(event.target)) {
            hideCategoryList();
            hideSearchInput();
            showTitle();
        }
    });

    function handleCategorySelection(button, category) {
        if (selectedCategoryButton === button) {
            button.classList.remove('bg-yellow-300', 'text-white');
            button.classList.add('bg-gray-200', 'text-gray-900');
            searchInput.value = '';
            selectedCategoryButton = null;
        } else {
            if (selectedCategoryButton) {
                selectedCategoryButton.classList.remove('bg-yellow-300', 'text-white');
                selectedCategoryButton.classList.add('bg-gray-200', 'text-gray-900');
            }

            hideSearchInput();
            button.classList.remove('bg-gray-200', 'text-gray-900');
            button.classList.add('bg-yellow-300', 'text-white');
            searchInput.value = `#${category}`;
            selectedCategoryButton = button;
        }
    }

    function showCategoryList() {
        categoryList.classList.remove('hidden'); // 'categoryList'를 보이게 설정
        categoryList.style.top = `${searchInput.offsetTop + searchInput.offsetHeight}px`;
        categoryList.style.left = `${searchInput.offsetLeft}px`;
        categoryList.style.width = `${searchInput.offsetWidth}px`;
    }

    function hideCategoryList() {
        categoryList.classList.add('hidden'); // 'categoryList'를 숨김
    }

    function showSearchInput() {
        bubbleInput.classList.remove('hidden'); // 'bubbleInput'을 보이게 설정

        const categoryListRect = categoryList.getBoundingClientRect();
        const parentRect = categoryList.offsetParent.getBoundingClientRect();

        bubbleInput.style.top = `${categoryListRect.bottom - parentRect.top}px`;
        bubbleInput.style.left = `${categoryListRect.right - parentRect.left - bubbleInput.offsetWidth}px`;

        bubbleInput.style.width = `auto`;
    }

    function hideSearchInput() {
        bubbleInput.classList.add('hidden'); // 'bubbleInput'을 숨김
    }

    function resetCategorySelection() {
        if (selectedCategoryButton) {
            selectedCategoryButton.classList.remove('bg-yellow-300', 'text-white');
            selectedCategoryButton.classList.add('bg-gray-200', 'text-gray-900');
        }
        selectedCategoryButton = null;
        searchInput.value = '';
    }
});

function hideTitle() {
    const mainTitle = document.getElementById('mainTitle');
    if (mainTitle) {
        mainTitle.style.display = 'none';
    }
}

function showTitle() {
    const mainTitle = document.getElementById('mainTitle');
    if (mainTitle) {
        mainTitle.style.display = 'block';
    }
}
