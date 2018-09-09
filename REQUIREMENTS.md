# Reqirements for GGC Maps

1. The service worker does not update properly according to the standards of Progressive Web Apps (PWAs). To ensure the GGC Maps PWA functions properly, the service worker needs to be refactored/debugged.
1. On iOS, the app icon for the PWA is simply a screenshot of the app's main screen. The web application metadata needs to be updated so iOS knows where to find an app icon.
1. As a user, I should be able to enable a mode to see where safety related locations are on campus. This mode should be toggleable and remembered between sessions. It should reveal tornado safe areas, fire extinguishers, and defibrilators.
1. The CSS/Sass for the website needs to be refactored and cleaned up. There are various artifacts from previous changes that adversely affect user experience.
1. Since the application was last worked on, the university has added a new building and renamed another building. The app needs to be updated to reflect these changes.