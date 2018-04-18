var prints = document.querySelectorAll('.print')
for (var i = 0; i < prints.length; i++) {
  prints[i].addEventListener('click', function() {
    window.print()
  })
}
