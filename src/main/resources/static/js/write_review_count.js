document.getElementById('review').addEventListener('input', updateCharacterCount);

function updateCharacterCount() {
   var review = document.getElementById('review');
   var charCount = review.value.length;
   var maxLength = review.getAttribute('maxlength');
   document.getElementById('char-count').innerText = charCount + ' / ' + maxLength + ' 글자';
}
