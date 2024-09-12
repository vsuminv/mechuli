document.addEventListener("DOMContentLoaded", function() {
    const buttons = document.querySelectorAll(".star-button");

    buttons.forEach(button => {
        button.addEventListener("click", function() {
            const slideContainer = button.previousElementSibling; // 슬라이드 내용을 포함한 컨테이너
            const scrollAmount = slideContainer.scrollLeft + 200; // 스크롤할 픽셀 양 (필요에 따라 조정)
            slideContainer.scrollTo({
                left: scrollAmount,
                behavior: 'smooth' // 부드러운 스크롤 애니메이션
            });
        });
    });
});
