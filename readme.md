
# Code Challenge

> Welcome to our code challenge! This readme will get you started.


## Setup and run

To run the server, just make sure you have [Docker](https://www.docker.com) installed and in a terminal run:

```bash
docker-compose up
```

It will run the Node.js server as well as a PostgreSQL instance (PG) with some predefined test data. The Node.js server automatically restarts on code changes. You can stop it with Ctrl+C.

When the server is running, you can see it on <http://localhost:9999>.

If you add new dependencies in `backend/package.json`, please stop the server and run `docker-compose up` again.


## Clean up

If you want to clean up after the project, simply run:

```bash
docker-compose down
```

The PG data persists in the `pg-data` folder inside the repository. If you want to start over with the predefined test data, you can delete this folder.


## Tasks

Look for the `tasks*.md` in the root of this repository. Each headline defines a single task. Please perform any task described there as good as you can. If you can't finish everything in time, it's fine, just hand it in before your deadline. The tasks marked as a “bonus” are not mandatory, but they have the opportunity to give you some extra credits.

Please beware of the following general guidelines:

 -  Follow ES6 standards
 -  Use `async`/`await`, whenever appropiate
 -  Commit your changes to the local git repository before sending it back to the HR representative with the appropriated commit messages.


## PG database

Should you need to connect a client to the PG database directly to look at data or otherwise, here is the connection string: `postgres://backend:backend@localhost:9998/app`.


## To Run Test (Bonus !)

- `cd backend`
- `yarn run test`

```
p.s make sure you have mocha installed globally
```
