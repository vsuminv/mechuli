/*
document.addEventListener("DOMContentLoaded", function () {
    const buttons = document.querySelectorAll('#sec2 button[data-show-table]');
    const tables = document.querySelectorAll('#sec3 table');
    const modal = document.getElementById('modal');
    const addReviewButton = document.querySelector('#addReviewButton'); // ID를 사용하여 버튼을 정확히 찾습니다.
    const cancelButton = modal.querySelector('button:first-of-type'); // 모달 내 첫 번째 버튼이 "취소" 버튼이라고 가정

    // 초기 상태에서 첫 번째 버튼을 노란색으로 유지
    let activeButton = document.querySelector('#sec2 button[data-show-table="menuTable"]');

    buttons.forEach(button => {
        button.addEventListener('click', function () {
            const tableId = this.getAttribute('data-show-table');

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

            showTable(tableId);
        });
    });

    function showTable(tableId) {
        tables.forEach(table => {
            table.style.display = 'none';
        });

        const selectedTable = document.querySelector(`#sec3 #${tableId}`);
        if (selectedTable) {
            selectedTable.style.display = 'table';
        }
    }

    // 모달 열기 이벤트
    addReviewButton.addEventListener('click', function () {
        modal.classList.remove('hidden');
    });

    // 모달 닫기 이벤트
    cancelButton.addEventListener('click', function () {
        modal.classList.add('hidden');
    });
});
*/
// 버튼, 테이블, 모달 등의 요소를 찾습니다.
const buttons = document.querySelectorAll('button[data-show-table]');
const tables = document.querySelectorAll('main table');
const modal = document.getElementById('modal');
const addReviewButton = document.querySelector('#addReviewButton');
const cancelButton = modal.querySelector('button:first-of-type');

// 초기 상태에서 첫 번째 버튼을 노란색으로 유지
let activeButton = document.querySelector('button[data-show-table="menuTable"]');

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