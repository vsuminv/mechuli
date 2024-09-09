    // var testBtn = document.getElementById('testBtn');
    // var joinForm = document.getElementById('joinForm');
    // var joinForm2 = document.getElementById('joinForm2');
    // const form = document.getElementById('joinForm');
    // const inputs = form.querySelectorAll('input[type="text"], input[type="password"]');
    //
    // const validationRules = {
    //     username: (value) => value.length >= 4,
    //     userPw: (value) => value.length >= 8,
    //     userPw2: (value) => value === document.getElementById('userPw').value,
    //     nick: (value) => value.length >= 2,
    //     address: (value) => value.length > 0
    // };
    //
    // inputs.forEach(input => {
    //     input.addEventListener('input', validateInput);
    // });
    //
    // function validateInput(e) {
    //     const input = e.target;
    //     const inputGroup = input.parentElement;
    //     const validationIcon = inputGroup.querySelector('.validation-icon');
    //
    //     if (validationRules[input.id] && validationRules[input.id](input.value)) {
    //         setValid(inputGroup);
    //     } else {
    //         setInvalid(inputGroup);
    //     }
    //
    //     // 비밀번호 확인 필드 특별 처리
    //     if (input.id === 'userPw') {
    //         const userPw2 = document.getElementById('userPw2');
    //         if (userPw2.value) {
    //             validateInput({target: userPw2});
    //         }
    //     }
    // }
    //
    // function setValid(inputGroup, validationIcon) {
    //     inputGroup.classList.remove('invalid');
    //     inputGroup.classList.add('valid');
    //     validationIcon.innerHTML = '✓';
    //     validationIcon.classList.remove('text-red-500');
    //     validationIcon.classList.add('text-green-500');
    // }
    //
    // function setInvalid(inputGroup, validationIcon) {
    //     inputGroup.classList.remove('valid');
    //     inputGroup.classList.add('invalid');
    //     validationIcon.innerHTML = '✗';
    //     validationIcon.classList.remove('text-green-500');
    //     validationIcon.classList.add('text-red-500');
    // }
    // form.addEventListener('submit', function(e) {
    //     e.preventDefault();
    //     if (form.querySelectorAll('.valid').length === inputs.length) {
    //         console.log('Form is valid, submitting...');
    //         form.submit();
    //     } else {
    //         console.log('Form is not valid');
    //         alert('모든 필드를 올바르게 입력해주세요.');
    //     }
    // });
    //
    //
