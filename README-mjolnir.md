Installation and operation instructions. To run this app, please fork and clone both the frontend and backend repos to your pc. npm install dependencies for both repos. A docker container will also need to be created and run and have a DB added to it. Configuration data follows. (include how to customize).

//spin up a postgres container, as def in knexfile.js
docker run --rm --name pg-docker -e POSTGRES_PASSWORD=docker -d -p 5432:5432 \
-v $HOME/docker/volumes/postgres:/var/lib/postgresql/data postgres

//enter docker bash
docker exec -it pg-docker bash

//from docker bash, create a database named mjolnir, as req in knexfile.js
createdb -U postgres mjolnir

//configure db from bash
npx knex migrate:latest
npx knex seed:run

![alt text](http://url/to/img.png)
![alt text](https://github.com/[username]/[reponame]/blob/[branch]/image.jpg?raw=true)

//*********************below are the API's paths**************************

//select user name
GET /users

//create new user
POST /users

//login/load user
GET /users/:user_name

//get history of created documents
GET /users/:user_name/history

//post history
POST /users/:user_name/history

//patch history
//:history is the history_id retrieved from get history
PATCH /users/:user_name/history/:history

//delete a doc from history
DELETE /users/:user_name/history

//get users favorites
GET /users/:user_name/favorites

//add to favorites
POST /users/:user_name/:template_id

//delete a favorite
DELETE /users/:user_name/:template_id

//get a list of all templates (id, title, body, options)
GET /templates

//get a templates body and options by id
GET /templates/:template_id

//


--------------------------------------STRETCH GOALS--------------------------------------------------------

//implement ability to create new templates on front end and push them to backend
implement login credentials and security