// Server related code
const express = require('express');
const cors = require('cors');

const app = express();

var corsOptions = {
  origin: '*'
}
app.use(cors(corsOptions));

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to JWTing!' });
});

require('./routes/auth.routes')(app);
require('./routes/user.routes')(app);

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
    sync();
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

const sync = () => {
  // force: true will drop the table if it already exists.
  db.sequelize.sync({force: true}).then(() => {

    db.ROLES.map((role) => {
      db.Role.create({
        id: db.ROLES.indexOf(role),
        name: role
      });
    });

  });
}
