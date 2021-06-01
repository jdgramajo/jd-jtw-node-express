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
    db.sequelize.sync({ force: true }).then(() => { db.Role.create({ id: 0, name: 'JWTING_ADMIN' }) });
    console.log('Connection to database successfull.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });
