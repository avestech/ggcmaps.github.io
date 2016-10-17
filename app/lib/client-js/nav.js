function diningSubMenu() {
  var menu = document.getElementsByClassName('dining')[0];

  if (menu.className === 'dining') {
    menu.classList.add('nav-active');
  }
  else if (menu.className === 'dining nav-active') {
    menu.classList.remove('nav-active');
  }
} // diningSubMenu
