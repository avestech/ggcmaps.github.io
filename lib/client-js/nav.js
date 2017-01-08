// Open the menu
function openMenu() {
  // The menu itself
  var menu = document.getElementsByClassName('nav')[0];
  // The content overlay
  var content = document.getElementsByClassName('content-disable')[0];

  if (menu.className === 'nav') {
    menu.classList.add('nav-active');
    // Disables the content of the page until the menu is closed
    content.classList.add('active');
  }
}

// Close the menu
function closeMenu() {
  // The menu itself
  var menu = document.getElementsByClassName('nav')[0];
  // The content overlay
  var content = document.getElementsByClassName('content-disable')[0];

  if (menu.className === 'nav nav-active') {
    menu.classList.remove('nav-active');
    // Enables the content of the page again
    content.classList.remove('active');
  }

  // When you close the menu also close the floors dropdown
  var dd = document.getElementsByClassName('floors')[0];
  if (dd.className === 'floors floors-active') {
    dd.classList.remove('floors-active');
  }
}

// Open/Close the dining submenu
function diningSubMenu() {
  var menu = document.getElementsByClassName('dining')[0];

  if (menu.className === 'dining') {
    menu.classList.add('dining-active');
  }
  else if (menu.className === 'dining dining-active') {
    menu.classList.remove('dining-active');
  }
}
