function getQueryParameter(name) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(name);
}

let boardPage = {
  buttons: document.querySelectorAll("button[data-show-table]"),
  tables: document.querySelectorAll("main table"),
  modal: document.getElementById("modal"),
  addReviewButton: document.querySelector("#addReviewButton"),
  cancelButton: null,
  activeButton: document.querySelector('button[data-show-table="menuTable"]'),
  stars: document.querySelectorAll('input[name="rating"]'),
  ratingDisplay: document.getElementById("selectedRating"),
  review: document.getElementById("review"),
  charCountElement: document.getElementById("char-count"),
  maxLength: null,

  init: function () {
    this.cancelButton = this.modal.querySelector("button:first-of-type");
    this.maxLength = this.review.getAttribute("maxlength");

    // 초기화 시 문자 수 업데이트
    this.updateCharacterCount();

    // 이벤트 리스너 설정
    this.setEventListeners();
  },

  setEventListeners: function () {
    // 모달 열기 이벤트
    this.addReviewButton.addEventListener("click", () => this.showModal());

    // 모달 닫기 이벤트
    this.cancelButton.addEventListener("click", () => this.hideModal());

    // 별점 클릭 이벤트 리스너 추가
    this.stars.forEach((star, index) => {
      star.addEventListener("change", () => this.updateStarRating(index));
    });

    // 리뷰 글자 수 업데이트 이벤트 리스너 추가
    this.review.addEventListener("input", () => this.updateCharacterCount());

    $('#submit-button').click(function(event) {
        event.preventDefault(); // 기본 제출 동작 방지
    
        // 새로운 FormData 객체 생성
        let reviewData = new FormData();
    
        // 리뷰 내용과 별점 수집
        let reviewDto = {
            content: $('#review').val(),
            rating: $('input[name="rating"]:checked').val()
        };
    
        // reviewDto를 JSON 문자열로 변환하여 FormData에 추가 (reviewDto라는 form-data로 보냄)
        reviewData.append('reviewDto', new Blob([JSON.stringify(reviewDto)], { type: 'application/json' }));
    
        // 파일들을 form-data로 추가 (files라는 form-data로 보냄)
        const files = [];
        if ($('#file-upload1')[0].files.length > 0) {
            files.push($('#file-upload1')[0].files[0]);  // 첫 번째 이미지 파일 추가
        }
        if ($('#file-upload2')[0].files.length > 0) {
            files.push($('#file-upload2')[0].files[0]);  // 두 번째 이미지 파일 추가
        }
    
        // 여러 개의 파일을 files라는 이름으로 FormData에 추가
        files.forEach(file => {
            reviewData.append('files', file);
        });
    
        // 식당 ID 추가
        const restaurantId = getQueryParameter('restaurantId');
        reviewData.append('restaurantId', restaurantId);
    
        // AJAX 요청으로 reviewDto와 files라는 form-data 전송
        $.ajax({
            url: '/reviews',
            method: 'POST',
            processData: false, // form-data 전송을 위한 설정
            contentType: false,
            data: reviewData,
            success: function(response) {
                alert('리뷰가 성공적으로 등록되었습니다.');
                // 성공 시 모달 닫기 또는 페이지 새로고침 등 추가 작업 가능
                boardPage.hideModal();
            },
            error: function(xhr) {
                alert('리뷰 등록 중 오류가 발생했습니다.');
                console.log(xhr.responseText);  // 서버 응답을 로그로 확인
            }
        });
    });

    // 리뷰 글자 수 제한
    $("#review").on("input", function () {
      let charCount = $(this).val().length;
      $("#char-count").text(`${charCount} / 2000 글자`);
      if (charCount > 2000) {
        alert("리뷰는 최대 2000자까지 작성 가능합니다.");
      }
    });
  },

  showModal: function () {
    this.modal.classList.remove("hidden");
  },

  hideModal: function () {
    this.modal.classList.add("hidden");
  },

  updateStarRating: function (index) {
    const rating = this.stars[index].value;
    this.ratingDisplay.textContent = rating;

    // 모든 별의 상태 초기화
    this.stars.forEach((s, i) => {
      if (i <= index) {
        s.nextElementSibling.classList.add("text-yellow-500");
        s.nextElementSibling.classList.remove("text-gray-400");
      } else {
        s.nextElementSibling.classList.remove("text-yellow-500");
        s.nextElementSibling.classList.add("text-gray-400");
      }
    });
  },

  updateCharacterCount: function () {
    const charCount = this.review.value.length;
    this.charCountElement.innerText =
      charCount + " / " + this.maxLength + " 글자";
  },
};

// 페이지 초기화
boardPage.init();