// Open the menu
function openMenu() {
    debug.group("Open Menu");
    // The menu itself
    var menu = document.getElementsByClassName('nav')[0];
    // The content overlay
    var content = document.getElementsByClassName('content-disable')[0];

    if (menu.className === 'nav') {
        menu.classList.add('nav-active');
        // Disables the content of the page until the menu is closed
        content.classList.add('active');
    }
    debug.end();
}

// Close the menu
function closeMenu() {
    debug.group("Close Menu");
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
    debug.end();
}

// Open/Close the dining submenu
function subMenu(id) {
    debug.group("Sub Menu");
    var menu = document.getElementsByClassName(id)[0];

    if (menu.className === id) {
        menu.classList.add('subMenu-active');
    } else if (menu.className === id + ' subMenu-active') {
        menu.classList.remove('subMenu-active');
    }
    debug.end();
}
