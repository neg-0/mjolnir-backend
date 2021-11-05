# README
Installation and operation instructions. To run this app, please fork and clone both the frontend and backend repos to your pc. npm install dependencies for both repos. A docker container will also need to be created and run and have a DB added to it. (location specified)
---
//requires docker
- `npm install -g docker`

//requires a dockerized postgres
- `docker pull postgres`

//Create the directories that will house your database data:
- `mkdir -p $HOME/docker/volumes/postgres`

//spin up a postgres container (/knexfile.js)
- `docker run --rm --name pg-docker -e POSTGRES_PASSWORD=docker -d -p 5432:5432 -v $HOME/docker/volumes/postgres:/var/lib/postgresql/data postgres`

//enter docker CLI
- `docker exec -it pg-docker bash`

//from docker CLI, create a database named mjolnir (/knexfile.js)
- `createdb -U postgres mjolnir`

//configure db from backend directory
- `npx knex migrate:latest`
- `npx knex seed:run`

//start server on port 3001 (/app.js) from backend directory
- `npm start`

//start frontend on port 3000 (/app.js) in a new terminal from frontend directory
- `npm start`

![alt text](http://url/to/img.png)
![alt text](https://github.com/[username]/[reponame]/blob/[branch]/image.jpg?raw=true)

---
# API paths

//select user name
- GET /users

//create new user
- POST /users

//login/load user
- GET /users/:user_name

//get history of created documents
- GET /users/:user_name/history

//post history
- POST /users/:user_name/history

//patch history
- PATCH /users/:user_name/history

//delete a doc from history
- DELETE /users/:user_name/history

//get users favorites
- GET /users/:user_name/favorites

//add to favorites
- POST /users/:user_name/:template_id

//delete a favorite
- DELETE /users/:user_name/:template_id

//get a list of all templates (id, title, body, options)
- GET /templates

//get a templates body and options by id
- GET /templates/:template_id

//


---
# STRETCH GOALS

- implement ability to create new templates on front end and push them to backend
- implement login credentials and security
- refactor to utilize arrays in db  (include options in templates table)