$(document).ready(function() {
    let userIdChecked = false;
    let nicknameChecked = false;
    let selectedCategories = [];

    function updateNextButton() {
        $("#next_btn").prop("disabled", !(userIdChecked && nicknameChecked));
    }

    function checkDuplicate(type) {
        $.post('/joinPage/ajaxCheck', { type: type, value: $(`#${type}`).val() }, function(response) {
            if (response === 0) {
                alert(`사용 가능한 ${type === 'userId' ? '아이디' : '닉네임'}입니다.`);
                $(`#${type}`).prop("readonly", true);
                $(`#${type}_check`).prop("disabled", true);
                type === 'userId' ? userIdChecked = true : nicknameChecked = true;
            } else {
                alert(`이미 사용 중인 ${type === 'userId' ? '아이디' : '닉네임'}입니다.`);
                type === 'userId' ? userIdChecked = false : nicknameChecked = false;
            }
            updateNextButton();
        });
    }

    $('#userid_check').click(() => checkDuplicate('userId'));
    $('#nickname_check').click(() => checkDuplicate('nickname'));

    $("#next_btn").click(function() {
        let errorMessages = [];

        if (!userIdChecked) {
            errorMessages.push("id 중복쳌 미완 .");
        }
        if (!nicknameChecked) {
            errorMessages.push("nickname  중복쳌 미완");
        }
        if (errorMessages.length > 0) {
            alert(errorMessages.join("\n"));
        } else {
            $("#step1").hide();
            $("#step2").show();
        }
    });


    $("#back_btn").click(() => {
        $("#step2").hide();
        $("#step1").show();
    });

    $(".category-btn").click(function() {
        var categoryId = $(this).data("category-id");
        var categoryName = $(this).text();

        if ($(this).hasClass("selected")) {
            $(this).removeClass("selected");
            selectedCategories = selectedCategories.filter(c => c.id !== categoryId);
        } else {
            if (selectedCategories.length >= 3) {
                alert("최대 3개의 카테고리만 선택할 수 있습니다.");
                return;
            }
            $(this).addClass("selected");
            selectedCategories.push({id: categoryId, name: categoryName});
        }
        updateSelectedCategories();
    });

    function updateSelectedCategories() {
        var $selectedCategory = $("#selected_category");
        var $hiddenInputs = $("#hidden_category_inputs");
        $selectedCategory.empty();
        $hiddenInputs.empty();
        selectedCategories.forEach(function (category, index) {
            $selectedCategory.append('<div>' + category.name + '</div>');
            $hiddenInputs.append('<input type="hidden" name="categoryIds" value="' + category.id + '">');
        });
    }
    $("#joinForm").submit(function(e) {
        e.preventDefault();
        var formData = new FormData(this);
        selectedCategories.forEach(function(categoryId, index) {
            formData.append('categoryIds[]', categoryId);
        });
        $.ajax({
            url: $(this).attr('action'),
            type: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            success: function(response) {
                if (response.success) {
                    alert(response.message);
                    window.location.href = "/";
                } else {
                    alert(response.message);
                }
            },
            error: function(xhr, status, error) {
                var response = JSON.parse(xhr.responseText);
                alert(response.message || "회원가입 중 오류가 발생했습니다.");
            }
        });
    });
});
