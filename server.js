// Server related code
const express = require('express');
const cors = require('cors');

const app = express();

var corsOptions = {
  origin: '*'
}
app.use(cors(corsOptions));

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to JWTing!' });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running in port ${PORT}`);
});

// Persistence Related code
const db = require('./models');

db.sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
    // Uncomment the next line to create initial data.
    // sync();
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

const sync = () => {
  // force: true will drop the table if it already exists,
  // but it is the roles one, so we're cool with that.
  db.sequelize.sync({force: true}).then(() => {

    db.Role.create({
      id: 1,
      name: "user"
    });
   
    db.Role.create({
      id: 2,
      name: "moderator"
    });
   
    db.Role.create({
      id: 3,
      name: "admin"
    });

  });
}
