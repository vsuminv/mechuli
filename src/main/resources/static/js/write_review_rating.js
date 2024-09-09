const stars = document.querySelectorAll('input[name="rating"]');
const ratingDisplay = document.getElementById('selectedRating');

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