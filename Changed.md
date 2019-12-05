# GGCMaps - TEAM VEGAN'T
We're about to implement some new dank features.
GGCMaps aims to better, as well as ease, the experience of students at GGC when trying to find various locations across campus. It allows users to search rooms and have them be highlighted on an interactive map for easier meetups, less time wasted finding that one classroom for the first time, and easier navigation across campus for guests.
... and we're about to implement some dank new features!

# Vegan't Group Members and Roles:
* [Marcelo Mariduena](https://github.com/MarceloMariduena): Team Manager / UI/UX Designer  :stuck_out_tongue_closed_eyes: :stuck_out_tongue_closed_eyes: :stuck_out_tongue_closed_eyes:
* [Jonathan Mwizerwa](https://github.com/JonathanMwizerwa): Lead Programmer / UI/UX Designer :100:
* [Philip Wall](https://github.com/Nhorr): Data Modeler / Documentation Lead  :file_cabinet: :speech_balloon:
* [Graham Giles](https://github.com/gra-am): Q&A / Backend :japanese_goblin:

# Repository:
* https://github.com/GGC-SD/ggcmaps3

# Progress Tracking Tool:
* Jira

# Communication Tool:
* Discord

# Features

## Fire Escape Routes
We added a toggle button next to the other toggle buttons on the side menu. When flipped "on", fire escape routes will be display ontop of the selected building floor.
* a fireRoute layer containing the fire escape routes was added onto the adobe illustrator files.
* html code for the toggle button was added onto index.html line 256
* showHideFireRoutes.js containing the code for hiding and displaying the fire routes was added under lib/scripts-js
* svg code containing the fire routes was added at the very end of the svg elements found in the html under the following buildings: A, B, C, D, E, F, H, I, L, W

## Routes From Building to Building and Estimated Travel Times
We added a toggle button next to the other toggle buttons on the side menu. When selected it shows two drop down menus with corresponding buildings which represent travel routes.
* a layer representing the routes between buildings
* information about how long those routes take
* showHideTravelTimes.js containing the code for hiding and displaying the travel routes was added under lib/scripts-js

## Dining Services Pane for Dining Menus and Hours
We added a toggle button next to the other toggle buttons on the side menu. When selected it displays a pane with information from the Dining Services site.
* added an iframes element to the index.html file
* displays information from https://ggc.campusdish.com/en/LocationsAndMenus

## Emoji Depictions of Services
* On the left side-menu, there are emoji depictions of services. 
* The index.html file was changed. 

# Final Report
https://docs.google.com/presentation/d/1__IvOHw8mgGDwvCxQTn7QWchXIBWzEOoPX0s3YpFqM8/edit?usp=sharing
