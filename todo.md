# MAIN TODO
- right now the app works with only one path '/admin', this was a smart start but the following paths need to be implemented in order to clean this up a bit:
 1. /admin/home
 2. /admin/projects
 3. /admin/social
 4. /admin/account
 5. /admin/settings
 6. /admin/skills

# OTHER TODO
1. Create API and all of its aspects. (See notes)
 1.1 - The API calls the different schemas in the database and builds the different pages, since I'm only really going to implement 1 layout with 3 different pages in the front-end part of the app:
    - Home
    - Projects
    - Project pages, which will all have the same layout
2. After creating the API the backend should be complete, to create an mvp that is, I'm going to first develop a quick and hacky front-end using the same logic as the backoffice front-end, and use axios to query the API and build the front-end with EJS and the custom css I designed for the previous version of this site, at this point, I'll deploy this on my servers and test it out in production for a while, without containerizing.
 2.1 - Clean up both projects(front-end and back-end) while doing it, lot's of files have been placed in here for quick reference.
3. If all works properly, I'll try to reproduce the same front-end with React instead of EJS and Express. Hopefully by this time I'll already have learnt it.
4. After finishing and testing the react version of the front-end, it's time to separate the API from the backoffice I built. Basically I'm trying to create 3 different process that can be put in 3 different containers, one for the API, one for the backoffice and one for the front-end app.
5. After building the 3 separate apps, convert them into containers, and hopefully try to build a docker-compose file that spins up all the containers, database included, this means, that in theory one could rent a vps with 2 vCPU, 4GB of RAM and whatever storage the provider gives for these, install docker on it and run the entire stack from a single server, or maybe even multiple API containers and multiple front-end containers for higher flow websites, but this is still far away so lets not speculate for now. Don't forget that storage is the limiting factor for this solution saves the images in the database, meaning the more pictures you save the more storage is required.

# NOTES
I need to query the db in order to present data, and I can't query everything at once, it beats the point of a light and effective backoffice, because of that a
couple of things are going to be changed, the social links will be put into its own page, since its already handled differently from the intro and about sections
might as well move a couple things arround, while at it.
Right now I'm trying to build the backoffice in a way that we have small forms to fill each with an different aspect, this means that the data is not stored in a single schema of the database 

# CURRENT TASKS
1. Move the social links form to its own page
2. Remove the favicon from the home form to the settings form, this will be a new page that will handle:
    - the favicon part of the frontend, as well as languages, website title and maybe other things in the future.
3. Redesign the home forms, so that the saved text will be loaded on login as well as the saved main image.
4. Create the projects page. And corresponding utilities to have multi-language support, don't forget, you just need to build the article layout and save it to the db!
5. Try to port the old skill page into bootstrap and make it a global setting, meaning the schema needs to have a skill test that houses all different translations, and the object that contains the skill icon and category (for programing languages and programs, etc).
6. The old account forms should be easy to port into bootstrap as only the email and password is changed in this page, and maybe the session settings in the future, for persisting logins for longer time, instead of the default 1h.
