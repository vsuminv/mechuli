let join= {
    init : function () {
        $("#joinBtn").on("click", () => {
            this.createUser();
        });
    },
    createUser : function () {
    let joinBtn = document.getElementById('joinBtn');
        let userData ={
            userId: $("#userId").val(),
            userPw: $("#userPw").val(),
            userName: $("#username").val(),
            userAddress: $("#userAddress").val(),
        };
        $.ajax({
            type:"POST",
            url:"/join",
            data:JSON.stringify(data), // javascript object인 data를 json 형식으로 변환해서 java가 인식할 수 있도록 준비함
            contentType:"application/json; charset=utf-8", // http body 데이터 타입 체크(MIME)
            dataType:"json" // 요청에 대한 응답이 왔을 때 기본적으로 문자열(생긴게 json이라면)=> javascript object로 변경해줌
        }).done(function (resp){
            if(resp.status===500){
                alert("가입 실패.");
            } else {
                alert("가입 성공");
            }
            location.href="/join2";
        }).fail(function (error){
            alert(JSON.stringify(error));
        });
    }
}