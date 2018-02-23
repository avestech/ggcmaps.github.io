# Contributing to GGCMaps

We would like to start off by thanking you for taking the time to contribute. We have outlined below what tools are required to be able to contribute to the project. Grunt is used to compile Sass(.scss files) into the styles.css file, and minify all of the JavaScript files into the script.min.js file. Script.min.js and styles.css are created automatically and should not be edited manually. Manually editing will cause your work to be over written next time grunt is ran. We use this tool to improve your workflow, and want to create the best product possible. Also note that when committing the files created by grunt, please commit both files, as needed, in the same commit labeled with the message grunt. Please do not include other files with the grunt files. This makes it easier for use when you submit a pull request.

#### Table of Contents

[What should I know before I get started?](#what-should-i-know-before-i-get-started)
  * [Developer Dependencies](#developer-dependencies)
  * [Getting Started Grunt](#setting-up-grunt)
  * [Setting Up Sass](#setting-up-sass)
  * [Setting Up Compass](#setting-up-compass)
  * [Helpful Lynda Tutorials](#helpful-lynda-tutorials)

[Getting Started](#getting-started)
[How do I update the maps?](#how-do-i-update-the-maps)
[I want to submit a Pull Request](#i-want-to-submit-a-pull-request)

## What should I know before I get started?

### Developer Dependencies

  * HTTP-Server
  * Ruby
  * Sass
  * Grunt
  * Grunt-Contrib-Compass
  * Grunt-Contrib-JSHint
  * Grunt-Contrib-Uglify
  * Grunt-Contrib-Watch
  * PhantomJS

### Setting Up Grunt

  1. Before setting up Grunt ensure that your npm is up to date by running `npm update -g npm` (this might require `sudo` depending on your system)
  2. To get started you need Grunt's command line interface (CLI) globally. Again you my need `sudo` to run `npm install -g grunt-cli`
  3. Now after you install the project dependencies you will be able to run `grunt`

### Setting Up Sass

#### Linux

If you're using a distribution of Linux, you'll need to install Ruby first. You can install Ruby through the apt package manager, rbenv, or rvm.
`sudo gem install sass --no-user-install`

#### Windows

Before you start using Sass you will need to install Ruby. The fastest way to get Ruby on your Windows computer is to use [Ruby Installer](http://rubyinstaller.org/). It's a single-click installer that will get everything set up for you super fast.
The installer will also install a Ruby command line powershell application that will let you use the Ruby libraries.

#### Mac

If you prefer the command line over an application then getting Sass set up is a fairly quick process. Sass has a Ruby dependency but if you're using a Mac, congratulations, Ruby comes pre-installed.
In your terminal run `gem install sass`. If you get and error message then you will likely need to use `sudo` which will look like this `sudo gem install sass`

### Setting Up Compass

Compass will run on any computer with ruby installed. After ruby is installed run the following commands.

  1. `gem update --system`
  2. `gem install compass`

### Helpful Lynda Tutorials

* [Responsive CSS with Sass and Compass](https://www.lynda.com/CSS-tutorials/Responsive-CSS-Sass-Compass/140777-2.html)
* [Coding Faster with Emmet](https://www.lynda.com/Emmet-tutorials/Coding-Faster-Emmet/133353-2.html)

## Getting Started

  1. Fork the repository
  2. Clone your fork to your computer
  3. Install `http-server` with `npm install http-server -g`
  4. Install the developer dependencies with `npm install --only=dev`
  5. In your terminal run `npm start`
  6. In another terminal tab/window run `grunt`
  7. In your internet browser, navigate to localhost:3000
  8. Now your instance of the project running
  9. Finally, create a new file named (Class Number)-(Section Number)(Semester)(Year).md (This is where your team can keep your required class documentation.)

## How do I update the maps?

To update any of the maps, we have our Illustrator files available to download from [dropbox](https://www.dropbox.com/sh/vg22hm3euf1c1a8/AACf3K7j7Q4_mJ7MEhcVDET6a?dl=0).

## I want to submit a Pull Request

After you have finished your new feature for the project, and you have thoroughly tested for bugs. You may submit a pull request for review. Make sure you follow the checklist below.

  * The feature/bug fix improves the user experience
  * Your code and feature/bug fix is well documented
  * If you update any of the maps, include the updated Illustrator files in your request. *Please note that the Illustrator file is not to be in the repository.* Attach the files to the pull request or link to the files. We want to allow future contributors the ability to use the most updated maps.
  * Title the request something that appropriately describes your feature.
  * Keep the repo organized. We do not want clutter in the repository, so before submitting a request remove any unnecessary files.
  * Commits labeled 'grunt' will be rejected, do not worry about this. We will run grunt after processing the pull request to prevent merge conflicts.
