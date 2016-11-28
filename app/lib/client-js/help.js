function openHelp() {
  closeMenu();
  var helpbar = document.getElementsByClassName('help')[0];

  if (!helpbar.classList.contains('help-active')) {
    helpbar.classList.toggle('help-active');
  }
}

function closeHelp() {
  var helpbar = document.getElementsByClassName('help')[0];

  if (helpbar.classList.contains('help-active')) {
    helpbar.classList.toggle('help-active');
  }
}
