function openTab(element) {
  closeMenu();
  var tab = document.getElementById(element);

  if (!tab.classList.contains('tab-active')) {
    tab.classList.toggle('tab-active');
    var height = tabContentHeight(element);
    var tabcontent = tab.childNodes[0].childNodes[7];
    tabcontent.style.height = height + 'px';
  }
}

function closeTab(element) {
  var tab = document.getElementById(element);

  if (tab.classList.contains('tab-active')) {
    tab.classList.toggle('tab-active');
  }
}

function tabContentHeight(element) {
  var clientHeight = (window.innerHeight || document.body.clientHeight);
  var title = document.getElementById(element).childNodes[0].childNodes[1].clientHeight;
  return clientHeight - title;
}
