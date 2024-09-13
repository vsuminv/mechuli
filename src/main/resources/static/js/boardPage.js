const buttons = document.querySelectorAll('button[data-show-table]');
const tables = document.querySelectorAll('main table');
const modal = document.getElementById('modal');
const addReviewButton = document.querySelector('#addReviewButton');
const cancelButton = modal.querySelector('button:first-of-type');
let activeButton = document.querySelector('button[data-show-table="menuTable"]');



// write_review_rating.js value
const stars = document.querySelectorAll('input[name="rating"]');
const ratingDisplay = document.getElementById('selectedRating');


// write_review_count.js value
var review = document.getElementById('review');
var charCount = review.value.length;
var maxLength = review.getAttribute('maxlength');
document.getElementById('char-count').innerText = charCount + ' / ' + maxLength + ' 글자';

// write_review_count.js function
function updateCharacterCount() {

}




// write_review_rating.js function
stars.forEach((star, index) => {
    star.addEventListener('change', () => {
        const rating = star.value;
        ratingDisplay.textContent = rating;

        // 모든 별의 상태 초기화
        stars.forEach((s, i) => {
            if (i - 1 < index) {
                s.nextElementSibling.classList.add('text-yellow-500');  // 클릭한 별 이전은 노란색
                s.nextElementSibling.classList.remove('text-gray-400');
            } else {
                s.nextElementSibling.classList.remove('text-yellow-500');  // 클릭한 별 이후는 회색
                s.nextElementSibling.classList.add('text-gray-400');
            }
        });
    });
});







// 각 버튼에 클릭 이벤트 리스너 추가
buttons.forEach(button => {
    button.addEventListener('click', function () {
        const tableId = this.getAttribute('data-show-table'); // 클릭된 버튼의 테이블 ID 가져오기

        // 이전 활성화된 버튼을 기본 상태로 되돌림
        if (activeButton) {
            activeButton.classList.remove('bg-[#fef445]');
            activeButton.classList.add('bg-[#e6e6e6]');
        }

        // 현재 클릭된 버튼을 노란색으로 설정
        this.classList.remove('bg-[#e6e6e6]');
        this.classList.add('bg-[#fef445]');

        // 현재 버튼을 활성화된 버튼으로 저장
        activeButton = this;

        // 해당하는 테이블을 표시하고 나머지는 숨기기
        showTable(tableId);
    });
});

// 특정 테이블을 표시하고 나머지는 숨기는 함수
function showTable(tableId) {
    // 모든 테이블 숨기기
    tables.forEach(table => {
        table.style.display = 'none';  // display 속성을 none으로 설정하여 테이블 숨김
        table.classList.add('hidden'); // 'hidden' 클래스 추가
    });
    // 선택된 테이블만 표시
    const selectedTable = document.getElementById(tableId);
    if (selectedTable) {
        selectedTable.style.display = 'table';  // display 속성을 table로 설정하여 선택된 테이블 표시
        selectedTable.classList.remove('hidden'); // 'hidden' 클래스 제거
    }
}
// 모달 열기 이벤트
addReviewButton.addEventListener('click', function () {
    modal.classList.remove('hidden');  // 모달의 'hidden' 클래스 제거
});
// 모달 닫기 이벤트
cancelButton.addEventListener('click', function () {
    modal.classList.add('hidden');  // 모달의 'hidden' 클래스 추가
});
