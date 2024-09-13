let get ={
    getInit : function () {
        const buttons = document.querySelectorAll('button[data-show-table]');
        document.addEventListener("DOMContentLoaded", this.urlCheck);

    }
}

let post ={
    postInit: function () {

        $("#my_account").on("click", function () {
            this.myAccount();
        });
        $("#my_restaurant").on("click", function () {
            this.myRestaurant();
        });
        $("#my_friend").on("click", function () {
            this.myFriend();
        });
    },


    myAccount: function () {

    },
    myRestaurant: function () {

    },
    myFriend: function () {

    },
    urlCheck: function (){
        let url = window.location.pathname;
        let id = "buttons"+url.replace("/","").split("/")[0];
        let currentNavBtn = document.getElementById(id);
        currentNavBtn.classList.add("special_nav_btn");
    }
};

get.getInit();
post.postInit();



const buttons = document.querySelectorAll('button[data-show-table]');
const tables = document.querySelectorAll('main table');
// const modal = document.getElementById('modal');
const addReviewButton = document.querySelector('#addReviewButton');
const cancelButton = modal.querySelector('button:first-of-type');

// 초기 상태에서 첫 번째 버튼을 노란색으로 유지
let activeButton = document.querySelector('button[data-show-table="menuTable"]');




document.addEventListener('DOMContentLoaded', function() {
    const myAccountBtn = document.getElementById('myAccountBtn');
    const myStoreListBtn = document.getElementById('myStoreListBtn');
    const myPartyBtn = document.getElementById('myPartyBtn');
    const contentDiv = document.getElementById('content');

    const buttons = [myAccountBtn, myStoreListBtn, myPartyBtn];

    function setActiveButton(activeButton) {
        buttons.forEach(button => {
            button.classList.remove('bg-yellow-500');
            button.classList.add('bg-yellow-200');
        });
        activeButton.classList.remove('bg-yellow-200');
        activeButton.classList.add('bg-yellow-500');
    }

    function loadContent(url) {
        fetch(url)
            .then(response => response.text())
            .then(html => {
                contentDiv.innerHTML = html;
            })
            .catch(error => {
                console.error('Error:', error);
                contentDiv.innerHTML = '<p>콘텐츠를 불러오는 데 실패했습니다.</p>';
            })
            .finally(() => {
                // 데이터 로드 성공 여부와 관계없이 캐러셀 설정
                setupCarousel('carousel');
                setupCarousel('review-carousel');
            });
    }

    myAccountBtn.addEventListener('click', function() {
        loadContent('/contents/my/myTaste', '내 취향');
        setActiveButton(myAccountBtn);
    });

    myStoreListBtn.addEventListener('click', function() {
        loadContent('/contents/my/myStoreList', '내 맛집 리스트');
        setActiveButton(myStoreListBtn);
    });

    myPartyBtn.addEventListener('click', function() {
        loadContent('/contents/my/myParty', '내 친구');
        setActiveButton(myPartyBtn);
    });

    // 초기 로드
    // myAccountBtn.click();
    // myStoreListBtn.click();
    // myPartyBtn.click();
});

function setupCarousel(carouselId) {
    const carousel = document.getElementById(carouselId);
    if (!carousel) return; // 캐러셀이 없으면 함수 종료

    const content = carousel.querySelector('.flex');
    const prevBtn = carousel.querySelector('button:first-of-type');
    const nextBtn = carousel.querySelector('button:last-of-type');
    let position = 0;
    const itemWidth = carouselId === 'carousel' ? 144 : 272; // 32 + 4(mr-4) for store list, 64 + 4(mr-4) for reviews

    nextBtn.addEventListener('click', () => {
        const maxPosition = content.scrollWidth - carousel.clientWidth;
        if (position > -maxPosition) {
            position -= itemWidth;
            position = Math.max(position, -maxPosition);
            content.style.transform = `translateX(${position}px)`;
        }
    });

    prevBtn.addEventListener('click', () => {
        if (position < 0) {
            position += itemWidth;
            position = Math.min(position, 0);
            content.style.transform = `translateX(${position}px)`;
        }
    });

    // 터치 스와이프 지원
    let startX;
    let isDragging = false;

    content.addEventListener('touchstart', (e) => {
        startX = e.touches[0].pageX - position;
    });

    content.addEventListener('touchmove', (e) => {
        if (isDragging) {
            e.preventDefault();
            const x = e.touches[0].pageX - startX;
            const maxPosition = -(content.scrollWidth - carousel.clientWidth);
            position = Math.max(Math.min(x, 0), maxPosition);
            content.style.transform = `translateX(${position}px)`;
        }
    });

    content.addEventListener('touchend', () => {
        isDragging = false;
        const itemPosition = Math.round(position / itemWidth) * itemWidth;
        position = Math.max(Math.min(itemPosition, 0), -(content.scrollWidth - carousel.clientWidth));
        content.style.transform = `translateX(${position}px)`;
    });
}
