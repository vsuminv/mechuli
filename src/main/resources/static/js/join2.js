function toggleButton(button) {

      // 'bg-gray-200' 클래스를 기준으로 버튼의 상태를 토글합니다.
      if (button.classList.contains('bg-gray-200')) {
          console.log('Button clicked:', button.textContent);
          button.classList.remove('bg-gray-200', 'text-gray-900'); // 기본 상태 클래스 제거
          button.classList.add('bg-yellow-300', 'text-white'); // 선택된 상태 클래스 추가
      } else {
          console.log('Button unclicked:', button.textContent);
          button.classList.remove('bg-yellow-300', 'text-white'); // 선택된 상태 클래스 제거
          button.classList.add('bg-gray-200', 'text-gray-900'); // 기본 상태 클래스 추가
      }
}