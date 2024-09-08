var testBtn = document.getElementById('testBtn');
var joinForm = document.getElementById('joinForm');
var joinForm2 = document.getElementById('joinForm2');

function joinBtn() {




    // joinForm hide
    if (joinForm) {
        joinForm.classList.add('hidden');
    }
    // joinFrom2 appear
    if (joinForm2) {
        joinForm2.classList.remove('hidden');
    }
}
