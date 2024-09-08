let common ={
    init : function () {
        document.addEventListener("DOMContentLoaded", this.urlCheck);
    },
    // 스무스하게 렌ㄷ더링
    urlCheck: function (){
        let url = window.location.pathname;
        let id = ""+url.replace("/","").split("/")[0];
        let currentNavBtn = document.getElementById(id);
        // currentNavBtn.classList.add("special_nav_btn");
    }
}
common.init();
