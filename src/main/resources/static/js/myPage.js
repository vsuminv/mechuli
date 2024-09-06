    var myAccountBtn = document.getElementById('myAccountBtn');
    var myStoreListBtn = document.getElementById('myStoreListBtn');
    var myPartyBtn = document.getElementById('myPartyBtn');
    var contentDiv = document.getElementById('content');


    myAccountBtn.addEventListener('click', function() {
    fetchContent('/contents/my/myTaste');
    setActiveButton(myAccountBtn);
});

    myStoreListBtn.addEventListener('click', function() {
    fetchContent('/contents/my/myStoreList');
    setActiveButton(myStoreListBtn);
});

    myPartyBtn.addEventListener('click', function() {
    fetchContent('/contents/my/myParty');
    setActiveButton(myPartyBtn);
});


    // 테스트 동안만 패치 쓰고 백 완료되면 아래 메서드 history.pushState() 로 변경.
    function fetchContent(url) {
    fetch(url)
    .then(function(response) {
    return response.text();
})
    .then(function(data) {
    contentDiv.innerHTML = data;
})
    .catch(function(error) {
    console.log('콘솔:', error);
});
}

    // function updateContent(url) {
    //     fetch(url)
    //         .then(function(response) {
    //             return response.text();
    //         })
    //         .then(function(data) {
    //             contentDiv.innerHTML = data;
    //             history.pushState(null, 'nodata', url);
    //         })
    //         .catch(function(error) {
    //             console.log('Error:', error);
    //             contentDiv.innerHTML = '콘솔';
    //         });
    // }





    function setActiveButton(button) {
        var buttons = document.querySelectorAll('.flex-row-l button');
        buttons.forEach(function(btn) {
            btn.classList.remove('bg-yellow-300','bg-yellow-500');
            btn.classList.add('bg-yellow-200');
        });

        button.classList.remove('bg-yellow-200');
        button.classList.add('bg-yellow-500');
    }