function openMenu() {
  var menu = document.getElementsByClassName('nav')[0];
  var content = document.getElementsByClassName('content-disable')[0];

  if (menu.className === 'nav') {
    menu.classList.add('nav-active');
    content.classList.add('active');
  }
} // openMenu

function closeMenu() {
  var menu = document.getElementsByClassName('nav')[0];
  var content = document.getElementsByClassName('content-disable')[0];

  if (menu.className === 'nav nav-active') {
    menu.classList.remove('nav-active');
    content.classList.remove('active');
  }
} //closeMenu

function diningSubMenu() {
  var menu = document.getElementsByClassName('dining')[0];

  if (menu.className === 'dining') {
    menu.classList.add('dining-active');
  }
  else if (menu.className === 'dining dining-active') {
    menu.classList.remove('dining-active');
  }
} // diningSubMenu
