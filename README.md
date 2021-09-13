# NodeReactLogin
Sample project for authentication using **Node.js (Express)** for server-side, **PostgreSQL** for database and **React** for client-side (**PERN** stack).
- Install all dependencies -

  ```
  npm run all-dep
  ```
### Starting the project in development mode
- Uncomment following two statements in index.js -
  - **app.use(express.static(path.join(__dirname, 'client/build')));**
  - **app.get('*', (req, res) => {res.sendFile(path.join(__dirname, 'client/build', 'index.html'))});**
- Start the project -

  ```
  npm run start-dev
  ```