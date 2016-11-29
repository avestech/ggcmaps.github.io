function openTab(element) {
  closeMenu();
  var tab = document.getElementById(element);

  if (!tab.classList.contains('tab-active')) {
    tab.classList.toggle('tab-active');
  }
}

function closeTab(element) {
  var tab = document.getElementById(element);

  if (tab.classList.contains('tab-active')) {
    tab.classList.toggle('tab-active');
  }
}
