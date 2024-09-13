//
//
//
//
// function showErrorMessage(inputId, errorMessage) {
//     const input = $(`#${inputId}`);
//     if (input.val() === "") {
//         alert(errorMessage);
//         input.focus();
//         return false;
//     }
//     return true;
// }
//
//
// // AJAX Functions
// function ajaxRequest(url, data, successCallback) {
//     $.ajax({
//         url: url,
//         type: "POST",
//         data: data,
//         contentType: "application/x-www-form-urlencoded",
//         success: successCallback,
//         error: function (request, status, error) {
//             alert(`요청: ${request}\n상태: ${request.status}\n에러: ${error}`);
//         }
//     });
// }
//
// function allCheck(inputId, checkButtonId, resetButtonId, CheckVar) {
//     return function(result) {
//         if (result === 0) {
//             if (confirm("사용 가능합니다. 사용하시겠습니까?")) {
//                 window[CheckVar] = 1;
//                 $(`#${inputId}`).attr("readonly", true);
//                 $(`#${checkButtonId}`).attr("disabled", true).hide();
//                 $(`#${resetButtonId}`).attr("disabled", false).show();
//             }
//         } else if (result === 1) {
//             alert(ERROR_MESSAGES[`${inputId.toUpperCase()}_IN_USE`]);
//             $(`#${inputId}`).focus();
//         } else {
//             alert(ERROR_MESSAGES.UNKNOWN_RESULT);
//         }
//     };
// }
//
// // Check Functions
//
//
// // Join Function
// function join() {
//     if (!checkAll()) {
//         return false;
//     }
//
//     const userPw = $('#userPw').val();
//     const userPw2 = $('#userPw2').val();
//
//     if (userPw !== userPw2) {
//         alert(ERROR_MESSAGES.PASSWORD_MISMATCH);
//         $('#userPw2').focus();
//         return false;
//     }
//
//     const formData = new FormData($('#joinForm')[0]);
//
//     $.ajax({
//         url: API_ENDPOINTS.GET_CSRF_TOKEN,
//         type: "GET",
//         success: function(csrfToken) {
//             $.ajax({
//                 url: API_ENDPOINTS.JOIN,
//                 type: "POST",
//                 data: formData,
//                 processData: false,
//                 contentType: false,
//                 headers: {
//                     'X-CSRF-TOKEN': csrfToken.token
//                 },
//                 success: function(response) {
//                     alert("회원가입이 완료되었습니다.");
//                     window.location.href = "/login";
//                 },
//                 error: function(xhr, status, error) {
//                     console.error("Error: " + status + " " + error);
//                     alert("회원가입 처리 중 오류가 발생했습니다: " + xhr.responseText);
//                 }
//             });
//         },
//         error: function(xhr, status, error) {
//             console.error("CSRF 토큰을 가져오는 데 실패했습니다.");
//             alert("회원가입을 처리할 수 없습니다. 나중에 다시 시도해주세요.");
//         }
//     });
//     return false; // 폼 기본 제출 방지
// }