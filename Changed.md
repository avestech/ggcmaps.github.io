# GGCMaps

## Vegan't Group Members and Roles:
* [Marcelo Mariduena](https://github.com/MarceloMariduena): Team Manager / UI/UX Designer  :stuck_out_tongue_closed_eyes: :stuck_out_tongue_closed_eyes: :stuck_out_tongue_closed_eyes:
* [Jonathan Mwizerwa](https://github.com/JonathanMwizerwa): Lead Programmer / UI/UX Designer :100:
* [Philip Wall](https://github.com/Nhorr): Data Modeler / Documentation Lead  :file_cabinet: :speech_balloon: 
* [Graham Giles](https://github.com/gra-am): Q&A / Backend :japanese_goblin:

## Repository:
* https://github.com/GGC-SD/ggcmaps3

## Progress Tracking Tool:
* Jira

### Other Communication Tool:
* Discord

### Description
GGCMaps aims to better, as well as ease, the experience of students at GGC when trying to find various locations across campus. It allows users to search rooms and have them be highlighted on an interactive map for easier meetups, less time wasted finding that one classroom for the first time, and easier navigation across campus for guests.


# Features added:

## Fire Escape Routes
We added a toggle button next to the other toggle buttons on the side menu. When flipped "on", fire escape routes will be display ontop of the selected building floor.
* a fireRoute layer containing the fire escape routes was added onto the adobe illustrator files. 
* html code for the toggle button was added onto index.html line 256
* showHideFireRoutes.js containing the code for hiding and displaying the fire routes was added under lib/scrips-js
* svg code containing the fire routes was added at the very end of the svg elements found in the html under the following buildings: A, B, C, D, E, F, H, I, L, W

# Features being worked on:

## Routes From Building to Building and Estimated Travel Times
We will be adding routes between buildings and the estimated time it takes to walk them.
