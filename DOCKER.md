# Developing using Docker

For GGC Maps we have created a container that already has the dependencies required for the project. Everyone will be developing on top of a Linux environment, while continuing to develop out of your preferred IDE/Text Editor.

#### Table of Contents

[What should I know before I get started](#what-should-i-know-before-i-get-started)
  * [What is Docker](#what-is-docker)
  * [Why Docker](#why-docker)
[Installing Docker](#installing-docker)
[Developing with Docker](#developing-with-docker)
  * [Docker Commands](#docker-commands)
  * [NPM scripts for Docker](#npm=scripts-for-docker)

## What should I know before I get started

### What is Docker

Docker is a containerization platform that allows you serve and develop projects with a unified environment. Simply create a container that contains everything your project needs. Share the container through a service like [Docker Hub](https://hub.docker.com), then get building.

### Why Docker

Docker is one of the leading containerization platforms used my many organizations to develop and deploy software. We built this container so that future contributors will not have to worry about installing ruby, sass, compass, etc. all dependencies are packaged inside the container.

## Installing Docker

Which version of Docker is right for you? Docker recommends you install their [native solutions](https://www.docker.com/community-edition#/download) for running docker containers directly on your development machine. However Docker does require your machine to support Hyper-V, so if your machine does not support Hyper-V or you are unable to enable Hyper-V, then you will need to install [Docker Toolbox](https://docs.docker.com/toolbox/overview/).

## Developing with Docker

To get started working with Docker run `npm run docker`. This command will pull down the docker container if you do not already have it locally. Then it will start a container, mount your current working directory, and port forward to your local system on port 3000. Alternatively you can pull and run the container manually.

### Docker Commands

  * Pull container: `docker pull mdeiters/minimalistweb:latest`
  * Run container: `docker run -it -p 3000:3000 -v $PWD:/mnt/dev/project mdeiters/minimalistweb:latest`
  * Clean up stopped containers: `docker prune containers`

### NPM scripts for Docker

  * Run container: `npm run docker`
  * Clean up stopped containers: `npm run purge`
