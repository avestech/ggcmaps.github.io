// Open the tab element
function openTab(element) {
    debug.group("Open Tab");
    // Close the menu
    closeMenu();
    // Find the tab
    var tab = document.getElementById(element);

    if (!tab.classList.contains('tab-active')) {
        tab.classList.toggle('tab-active');
        var height = tabContentHeight(element);
        // Get the tabcontent element
        var tabcontent = tab.childNodes[0].childNodes[7];
        // Set its height to tabContentHeight
        tabcontent.style.height = height + 'px';
    }
    debug.end();
}

// Close the tab element
function closeTab(element) {
    debug.group("Close Tab");
    var tab = document.getElementById(element);

    if (tab.classList.contains('tab-active')) {
        tab.classList.toggle('tab-active');
    }
    debug.end();
}

// Get the height of the tab - the title of the tab
function tabContentHeight(element) {
    debug.group("Tab Content Height");
    // Get the clientHeight
    var clientHeight = (window.innerHeight || document.body.clientHeight);
    // Get the title height
    var title = document.getElementById(element).childNodes[0].childNodes[1].clientHeight;
    // Return the difference
    debug.end();
    return clientHeight - title;
}
