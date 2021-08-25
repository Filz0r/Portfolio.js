# Portfolio.js


 This project is a CMS built with Node.js that is focused on building online portfolios easily

## README FIRST

This project started out as a simple web portfolio built by myself for myself as a way to learn more about full-stack development. As I reached the completion of the first version of this project I came to realize 2 things:
- I was basically building a CMS that works with Markdown.
- While the objective, of building a web portfolio for myself was met, I did not thought it was good enough to be shared as an alternative for other people, mostly because of a couple of security issues I created on the repository I used to host said version.

As it stands right now I'm currently rewritting the entire project into 2 separate web-apps, the frontend website that is designed to be open to the Internet, and a backoffice/API that is designed to be isolated from the internet, I'm not going to lie, **right now this project is a complete mess**, it still needs to be restructured, and many other things that can be read in the `todo.md` file that I started to use as a way for me to not forget the things I want to do in this massive project I put on my own shoulders.

## About

This project had its roots in September 2020, after a long quarentine of teaching myself Node.js and how to use and interact Linux systems for the greater part of that same year I decided to create a simple website where I would talk about my projects and dumb ideas and share them with the world.

There was only one problem with that idea, most of the CMS I could found were written in PHP and were not ideal to loadbalance across multiple servers or processes, with Docker. But the Internet said that Node.js apps were really easy to containerize and deploy, and after a time looking for a easy solution that would do the job, I found nothing, and decided to start to build what eventually became `Portfolio.js`.

The reasons that led me to rewritting the entire project were actually quite simple:

1. My finished product could not be deployed and loadbalanced across multiple Docker containers
2. At the time I used Github to track my own progress and to have some kind of way to store my coding projects, outside of my computer, and understood nothing about how git repos worked at the time, this ended up in me making my enviroment variables public.
3. As someone that speaks fluently 2 languages, I wanted to have my website with both languages, and created what I thought was a solution for that, it wasn't. It's basically a data duplication nightmare, and I trully mean a nightmare.
4. After 3 months of building what ended in a nightmare, I was still proud of the result, just not proud enough to go on the Internet and say "Look at this cool project I built, just lock out the `/admin` path on your webserver and everything will be fine", because of that a change had to be made.

The main goal of this project is to build an standardized back-end for people that want an online portfolio, programmers have the edge here because the back-end is going to be designed to work with whatever front-end the developer wants to use, since the backend saves not only the raw Markdown but it also converts it into sanitized HTML, meaning you would only need to query the API in order to build your front-end and then add a little of CSS on top of it and you will have your own unique webportfolio, without the hassle of designing and building an backend. Until the final stages of the roadmap bellow are achieved this project will only be recommended to people that actually know what they are doing, as there are still a lot of little things that need to be fixed/ converted into production ready code, specially the fact that you require SSL certs in order to start the backoffice, as it only runs with HTTPS, since we have passwords being sent arround, I made the executive decision of forcing all data/queries that make changes on the database to only run when there is an HTTPS connection.

I'm not sure if I've made this clear so far but this project is designed to make use of network isolations, for example:
- You run your portfolio in a Docker host having both webapps public exposed in an internal network.
- Instead of just exposing the container ports to the internet, you reverse proxy (with NGINX for example), and only expose the front-end part of your website to the public Internet.
- This means that unless your internal network is exposed, or you really want to have your backoffice/API exposed to the outside, you won't have to worry about botnets bruteforcing your portfolio and trying to break it, since it's hidden.

If you want to check out what the final result of this project after the development will look like you can check the current instance I'm running as my own portfolio in this (link)[https://filipefigueiredo.xyz]

## Roadmap

1. Finish building the backoffice/api
2. Build an front-end with Express and EJS
3. Testing the reworked project in production
4. Rebuild the front-end with React, as an excuse to learn React.
5. Containerizing the project and creating a easy to deploy structure for containerazation solutions.
6. Separating both parts of the project into 2 separate repositories, as a way of learning how automated builds and such wizardries work.
7. Writting proper documentation and guides on how to self-host this project.