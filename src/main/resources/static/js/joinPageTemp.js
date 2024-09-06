var joinBtn = document.getElementById('joinBtn');
var joinPage1 = document.getElementById('joinPage1');
var joinPage2 = document.getElementById('joinPage2');


joinBtn.addEventListener('click', function(e) {
    e.preventDefault(); // 폼 제출 방지

    // joinPage1 form hide
    var form = joinPage1.querySelector('form');
    if (form) {
        form.classList.add('hidden');
    }

    // joinBtn hide
    joinBtn.classList.add('hidden');

    // joinPage2 appear
    joinPage2.classList.remove('hidden');
});
